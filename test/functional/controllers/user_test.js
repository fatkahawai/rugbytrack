process.env.NODE_ENV = 'test';

var async    = require('async'),
    colors   = require('colors'),
    should   = require('should'),
    moment   = require('moment'),
    mongoose = require('mongoose'),
    request  = require('request'),
    _        = require('underscore'),
    root     = __dirname + '/../../../',
    utils    = require(root + 'lib/utils'),
    cleanDb  = utils.cleanDb,
    v1       = '/api/v1',
    ENV, AppEmitter, User, appUrl, usersBulk, config, appServ;

ENV = process.env.NODE_ENV;
AppEmitter = require(root + 'app');

describe('Controllers::Users', function() {
  var config;

  before(function(done) {
    utils.loadConfig(root + 'config', function(conf) {
      var calledApp = false;

      config = conf;
      appUrl = conf.site_url + "/api/v1";

      AppEmitter.on('getApp', function(app) {
        if (calledApp) { return false; }

        calledApp = true;
        appServ = app;
        app.listen(config[ENV].PORT, function() {
          app.serverUp = true;
        });
        User  = mongoose.model('User');

        cleanDb(User, function() {
          utils.loadFixtures(function(err, users) {
            if (err) { throw err; }

            usersBulk = users;
            utils.bulkInsert(User, users, done);
          });
        });
      });
      AppEmitter.emit('checkApp');

    });
  });

  after(function(done) {
    var closedApp = false;

    mongoose.disconnect();
    appServ.on('close', function() {
      setTimeout(function() {
        if (!closedApp) {
          done();
          closedApp = true;
        }
      }, 500);
    });
    appServ.close();
  });

  describe('#GET    '.cyan + v1 + '/users', function() {

    it("should get fixtures", function(done) {
      request(appUrl + '/users', function(err, res, body) {
        if (err) { throw err; }

        res.statusCode.should.equal(200);
        should.exist(res.headers.etag);
        _.isEqual(JSON.parse(body), usersBulk).should.be.true;

        done();
      });
    });

  });

  describe('#GET    '.cyan + v1 + '/users/:id', function() {
    var userId     = '4fd331ec0f0d9ec903000001',
        fakeUserId = '4fd331yyyy0d9ec9030x0001';

    it("should get user", function(done) {
      var expectedUser;

      expectedUser = _.find(usersBulk, function(doc) {
        return doc._id === userId;
      });

      request(appUrl + '/users/' + userId, function(err, res, body) {
        if (err) { throw err; }

        res.statusCode.should.equal(200);
        should.exist(res.headers.etag);
        _.isEqual(JSON.parse(body), expectedUser).should.be.true;

        done();
      })
    });

    it("should return 404 when user doesn't exist", function(done) {
      request(appUrl + '/users/' + fakeUserId, function(err, res, body) {
        if (err) { throw err; }

        should.not.exist(JSON.parse(body));
        res.statusCode.should.equal(404);

        done();
      })
    });

  });

  describe('#POST   '.cyan + v1 + '/users', function() {
    var newUser = {
      name: 'Andrew Jenkins',
      email: 'andy_jenks@gmail.fu',
      born: '1987-07-07T10:32:51.190Z',
      <TODO add other fields>: 'Andrew & associates'
    };

    it("should create user and return 201 Created && Location header", function(done) {
      async.waterfall([
        function createResource(callback) {
          request({
            method : "POST",
            url    : appUrl + '/users',
            form   : newUser
          }, callback);
        },
        function checkResponse(res, body, callback) {
          var jsonBody;

          jsonBody = JSON.parse(body);
          delete jsonBody._id;
          delete jsonBody.photo;

          res.statusCode.should.equal(201);
          should.exist(res.headers['location']);
          _.isEqual(newUser, jsonBody).should.be.true;

          callback(null, res.headers['location']);
        },
        function getCreated(loc, callback) {
          request(loc, callback);
        }
      ], function checkCreated(err, res, body) {
        var user;

        if (err) { throw err; }
        user = JSON.parse(body);

        res.statusCode.should.equal(200);
        user = _.pick(user, 'name', 'email', 'born', '<TODO add other fields>');
        _.isEqual(user, newUser).should.be.true;

        done();
      });
    });

    it("should return error for invalid name", function(done) {
      newUser.email = "example1@example.com";
      newUser.name  = "A";

      request({
        method : "POST",
        url    : appUrl + '/users',
        form   : newUser
      }, function(err, res, body) {
        if (err) { throw err; }

        body = JSON.parse(body);
        res.statusCode.should.equal(200);
        should.equal(body.errors.name, config.error_messages.NAME);

        done();
      });
    });

    it("should return error for existing email", function(done) {
      // using an existing email
      newUser.email = "andy_jenks@gmail.fu";
      newUser.name  = "And Jenks";

      request({
        method : "POST",
        url    : appUrl + '/users',
        form   : newUser
      }, function(err, res, body) {
        if (err) { throw err; }

        body = JSON.parse(body);
        res.statusCode.should.equal(200);
        should.equal(body.errors.email, config.error_messages.DUPLICATE);

        done();
      });

    });

    it("should return error for invalid email", function(done) {
      newUser.email = 'example@example';

      request({
        method : "POST",
        url    : appUrl + '/users',
        form   : newUser
      }, function(err, res, body) {
        if (err) { throw err; }

        body = JSON.parse(body);
        res.statusCode.should.equal(200);
        should.equal(body.errors.email, config.error_messages.EMAIL);

        done();
      });
    });

    it("should return error for invalid <TODO add other fields>", function(done) {
      newUser.name    = "Abc Def";
      newUser.<TODO add other fields> = "abc";
      newUser.email   = 'example2@example.co';

      request({
        method : "POST",
        url    : appUrl + '/users',
        form   : newUser
      }, function(err, res, body) {
        if (err) { throw err; }

        body = JSON.parse(body);
        res.statusCode.should.equal(200);
        should.equal(body.errors.<TODO add other fields>, config.error_messages.COMPANY);

        done();
      });
    });

    it("should return error for invalid birth date", function(done) {
      newUser.name    = "Alpha Bet";
      newUser.<TODO add other fields> = "McMc Lean";
      newUser.email   = "example2838@example.com";
      newUser.born    = "abc";

      request({
        method : "POST",
        url    : appUrl + '/users',
        form   : newUser
      }, function(err, res, body) {
        if (err) { throw err; }

        body = JSON.parse(body);
        res.statusCode.should.equal(200);
        should.equal(body.errors.born, config.error_messages.BORN);

        done();
      });
    });

    it("should return error if birth date occured less than 18 years ago", function(done) {
      newUser.name    = "Alpha Bet";
      newUser.<TODO add other fields> = "McMc Lean";
      newUser.email   = "example28929292938@example.com";
      newUser.born    = new Date();

      request({
        method : "POST",
        url    : appUrl + '/users',
        form   : newUser
      }, function(err, res, body) {
        if (err) { throw err; }

        body = JSON.parse(body);
        res.statusCode.should.equal(200);
        should.equal(body.errors.born, config.error_messages.BORN);

        done();
      });
    });

  });

  describe('#PUT    '.cyan + v1 + '/users/:id', function() {
    var existingUser = {
      "name"    : "Friedrich Jerde",
      "email"   : "Deon_Walter@janie.biz",
      "born"    : "1984-06-09T11:41:20.096Z",
      "<TODO add other fields>" : "Reinger-Kris",
      "_id"     : "4fd331ec0f0d9ec903000001",
      "photo"   : false
    };

    it("should modify user and return 204 No Content", function(done) {
      var user = _.clone(existingUser);

      user.<TODO add other fields> = "IT Soft Corp Blah";

      async.waterfall([
        function putResource(callback) {
          request({
            method : "PUT",
            url    : appUrl + '/users/' + user._id,
            form   : user
          }, callback);
        },
        function checkResponse(res, body, callback) {
          res.statusCode.should.equal(204);
          callback();
        },
        function getUpdatedResource(callback) {
          request(appUrl + '/users/' + user._id, callback);
        }
      ], function checkUpdated(err, res, body) {
        if (err) { throw err; }

        _.isEqual(user, JSON.parse(body)).should.be.true;

        done();
      });
    });

    it("should return 404 when trying to update non-existing user", function(done) {
      var user = _.clone(existingUser);

      user._id     = "4fd3NNNNNN0dQQQ903000001";
      user.<TODO add other fields> = "IT Soft Corp Blah";

      request({
        method : "PUT",
        url    : appUrl + '/users/' + user._id,
        form   : user
      }, function(err, res, body) {
        if (err) { throw err; }

        res.statusCode.should.equal(404);

        done();
      });
    });

    it("should return error for invalid name", function(done) {
      var user = _.clone(existingUser);

      user.name  = "A";

      request({
        method : "PUT",
        url    : appUrl + '/users/' + user._id,
        form   : user
      }, function(err, res, body) {
        if (err) { throw err; }

        body = JSON.parse(body);
        res.statusCode.should.equal(200);
        should.equal(body.errors.name, config.error_messages.NAME);

        done();
      });
    });

    it("should return error for existing email", function(done) {
      var user = _.clone(existingUser);

      // using an existing email
      user.email = "andy_jenks@gmail.fu";

      request({
        method : "PUT",
        url    : appUrl + '/users/' + user._id,
        form   : user
      }, function(err, res, body) {
        if (err) { throw err; }

        body = JSON.parse(body);
        res.statusCode.should.equal(200);
        should.equal(body.errors.email, config.error_messages.DUPLICATE);

        done();
      });

    });

    it("should return error for invalid email", function(done) {
      var user = _.clone(existingUser);
      user.email = 'example@example';

      request({
        method : "PUT",
        url    : appUrl + '/users/' + user._id,
        form   : user
      }, function(err, res, body) {
        if (err) { throw err; }

        body = JSON.parse(body);
        res.statusCode.should.equal(200);
        should.equal(body.errors.email, config.error_messages.EMAIL);

        done();
      });
    });

    it("should return error for invalid <TODO add other fields>", function(done) {
      var user = _.clone(existingUser);
      user.<TODO add other fields> = 'a';

      request({
        method : "PUT",
        url    : appUrl + '/users/' + user._id,
        form   : user
      }, function(err, res, body) {
        if (err) { throw err; }

        body = JSON.parse(body);
        res.statusCode.should.equal(200);
        should.equal(body.errors.<TODO add other fields>, config.error_messages.COMPANY);

        done();
      });
    });

    it("should return error for invalid birth date", function(done) {
      var user = _.clone(existingUser);
      user.born    = "abc";

      request({
        method : "PUT",
        url    : appUrl + '/users/' + user._id,
        form   : user
      }, function(err, res, body) {
        if (err) { throw err; }

        body = JSON.parse(body);
        res.statusCode.should.equal(200);
        should.equal(body.errors.born, config.error_messages.BORN);

        done();
      });
    });

    it("should return error if birth date occured less than 18 years ago", function(done) {
      var user = _.clone(existingUser);
      user.born    = new Date();

      request({
        method : "PUT",
        url    : appUrl + '/users/' + user._id,
        form   : user
      }, function(err, res, body) {
        if (err) { throw err; }

        body = JSON.parse(body);
        res.statusCode.should.equal(200);
        should.equal(body.errors.born, config.error_messages.BORN);

        done();
      });
    });

  });

  describe('#DELETE '.cyan + v1 + '/users/:id', function() {
    var userId = '4fd331ec0f0d9ec903000001';

    it("should delete user and return 200 OK", function(done) {

      async.series([
        function checkUser(callback) {
          User.findById(userId, function(err, user) {
            if (err) { throw err; }
            if (!user) { throw new Error("User doesn't exist"); }

            callback();
          })
        },
        function deleteUser(callback) {
          request.del(appUrl + '/users/' + userId, function(err, res, body) {
            if (err) { throw err; }

            res.statusCode.should.equal(200);
            callback();
          })
        },
        function checkDeletion() {
          request(appUrl + '/users/' + userId, function(err, res, body) {
            if (err) { throw err; }

            should.not.exist(JSON.parse(body));
            res.statusCode.should.equal(404);

            done();
          })
        }
      ]);

    });

    it("should return 404 if user doesn't exist", function(done) {
      var userId = '4fd331ec0f0d9ec903000001';

      request.del(appUrl + '/users/' + userId, function(err, res, body) {
        if (err) { throw err; }

        res.statusCode.should.equal(404);
        done();
      })
    });

  });

});
