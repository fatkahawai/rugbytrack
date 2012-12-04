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
    log      = require(root + 'lib/logger'),
    cleanDb  = utils.cleanDb,
    v1       = '/api/v1',
    ENV, AppEmitter, User, appUrl, usersBulk, config, appServ;

ENV = process.env.NODE_ENV;
AppEmitter = require(root + 'app');

describe('Controllers::Users', function() {
  var config;
  log.testbed( 'controllers/user_test.js: Controllers::Users describe  - entry');

  before(function(done) {
    log.testbed( 'controllers/user_test.js: before callback - entry');
    utils.loadConfig(root + 'config', function(conf) {
      var calledApp = false;

      log.testbed( 'controllers/user_test.js: loadConfig callback - entry');
      config = conf;
      appUrl = conf.site_url + '/api/v1';
      
      log.testbed( 'controllers/user_test.js: setting AppEmitter.on getApp handler');
      AppEmitter.on('getApp', function(app) {
        log.testbed( 'controllers/user_test.js: AppEmitter.on callback');
        if (calledApp) { return false; }

        calledApp = true;
        appServ = app;
        app.listen(config[ENV].PORT, function() {
          log.testbed( 'controllers/user_test.js: app.listen callback. server is up on port '+config[ENV].PORT);
          app.serverUp = true;
        });
        
        User  = mongoose.model('User');
        log.testbed( 'controllers/user_test.js: mongoose.model '+User.modelName+' linked. cleaning Db');

        cleanDb(User, function() {
          log.testbed( 'controllers/user_test.js: cleanDb callback. loading fixtures');
          utils.loadFixtures(function(err, users) {
            log.testbed( 'controllers/user_test.js: loadFixtures callback - entry');
            if (err) { throw err; }

            log.testbed( 'controllers/user_test.js: loadFixtures callback, starting bulkInsert');
            usersBulk = users;
            utils.bulkInsert(User, users, done);
            log.testbed( 'controllers/user_test.js: loadFixtures callback - returning');

          }); // loadFixtures
        }); // cleanDb
      }); // AppEmitter.on

      AppEmitter.emit('checkApp');
      log.testbed( 'controllers/user_test.js: loadConfig: AppEmitter.emit done. returning');

    });
  });

  after(function(done) {
    var closedApp = false;
    log.testbed( 'controllers/user_test.js: after');

//    mongoose.disconnect(); // i commented this out - if you disconnect db, tests for the next model will fail!
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
    log.testbed( 'controllers/user_test.js: #GET describe  - entry');

    it('should get fixtures', function(done) {
      request(appUrl + '/users', function(err, res, body) {
        log.testbed( 'controllers/user_test.js: request callback - entry');
        if (err) { 
          log.testbed( 'controllers/user_test.js: request callback. error getting users');
          throw err; 
        }
        log.testbed( 'controllers/user_test.js: request callback. statuscode should be 200, it is '+res.statusCode);
        res.statusCode.should.equal(200);

        log.testbed( 'controllers/user_test.js: request callback. headers should exist '+res.headers.etag);
        should.exist(res.headers.etag);

        log.testbed( 'controllers/user_test.js: request callback. body and usersBulk should be same '+_.isEqual(JSON.parse(body), usersBulk));
        log.testbed( 'controllers/user_test.js: request callback. body[0].userName= '+JSON.parse(body)[0].userName);
        log.testbed( 'controllers/user_test.js: request callback. usersBulk[0].userName= '+usersBulk[0].userName);
        log.testbed( 'controllers/user_test.js: request callback. body.length= '+JSON.parse(body).length);
        log.testbed( 'controllers/user_test.js: request callback. usersBulk.length= '+usersBulk.length);

        _.isEqual(JSON.parse(body), usersBulk).should.be.true;

        log.testbed( 'controllers/user_test.js: request callback - calling done()');
        done();
        log.testbed( 'controllers/user_test.js: request callback - returning');
      });
    });

  });

  describe('#GET    '.cyan + v1 + '/users/:id', function() {
    var userId     = '4fd331ec0f0d9ec903000001',
        fakeUserId = '4fd331yyyy0d9ec9030x0001';
    log.testbed( 'controllers/user_test.js: #GET describe  - entry');

    it('should get user', function(done) {
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

    it('should return 404 when user doesnt exist', function(done) {
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
      userName: 'AndrewJenkins',
      email: 'andy_jenks@gmail.fu',
      born: '1987-07-07T10:32:51.190Z'
    };
    log.testbed( 'controllers/user_test.js: #POST describe  - entry');

    it('should create user and return 201 Created && Location header', function(done) {
      async.waterfall([
        function createResource(callback) {
          request({
            method : 'POST',
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
        user = _.pick(user, 'userName', 'email', 'born');
        _.isEqual(user, newUser).should.be.true;

        done();
      });
    });

    it('should return error for invalid name', function(done) {
      newUser.email = 'example1@example.com';
      newUser.userName  = 'A';

      request({
        method : 'POST',
        url    : appUrl + '/users',
        form   : newUser
      }, function(err, res, body) {
        if (err) { throw err; }

        body = JSON.parse(body);
        log.testbed('body.errors.userName= '+body.errors.userName);
        log.testbed('res.statusCode= '+res.statusCode);
        log.testbed('config.error_messages.USERNAME= '+config.error_messages.USERNAME);
        res.statusCode.should.equal(200);
        should.equal(body.errors.userName, config.error_messages.USERNAME);

        done();
      });
    });

    it('should return error for existing email', function(done) {
      // using an existing email
      newUser.email = 'andy_jenks@gmail.fu';
      newUser.userName  = 'AndJenks';

      request({
        method : 'POST',
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

    it('should return error for invalid email', function(done) {
      newUser.email = 'example@example';

      request({
        method : 'POST',
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


    it('should return error for invalid birth date', function(done) {
      newUser.userName    = 'AlphaBet';
      newUser.email   = 'example2838@example.com';
      newUser.born    = 'abc';

      request({
        method : 'POST',
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

    it('should return error if birth date occured less than 18 years ago', function(done) {
      newUser.userName    = 'AlphaBet';
      newUser.email   = 'example28929292938@example.com';
      newUser.born    = new Date();

      request({
        method : 'POST',
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
      'userName'    : 'FriedrichJerde',
     "password"       : "Friedrich",
     "fullName"    : "Friedrich Jerde",
     'email'   : 'Deon_Walter@janie.biz',
    "dateRegistered" : "1984-06-09T11:41:20.096Z",
      'born'    : '1984-06-09T11:41:20.096Z',
      '_id'     : '4fd331ec0f0d9ec903000001'
    };

    it('should modify user and return 204 No Content', function(done) {
      var user = _.clone(existingUser);

      log.testbed('will modify user '+user._id);
      async.waterfall([
        function putResource(callback) {
          log.testbed('putResource');
          request({
            method : 'PUT',
            url    : appUrl + '/users/' + user._id,
            form   : user
          }, callback);
        },
        function checkResponse(res, body, callback) {
          log.testbed('checkResponse: statuscode= '+res.statusCode);
          res.statusCode.should.equal(204);
          callback();
        },
        function getUpdatedResource(callback) {
          log.testbed('getUpdatedResource: reloading modified user '+user.userName);
          log.testbed('getUpdatedResource: requesting GET '+appUrl + '/users/' + user._id);
          request(appUrl + '/users/' + user._id, callback);
        }
      ], function checkUpdated(err, res, body) {
        if (err) { 
          log.testbed('checkUpdated yielded error. err= '+err);
          log.testbed('checkUpdated yielded error. statuscode='+res.statusCode);
          log.testbed('JSON.parse(body).userName= '+JSON.parse(body).userName);
          throw err; 
        }

          log.testbed('user.userName= '+user.userName);
          log.testbed('JSON.parse(body).userName= '+JSON.parse(body).userName);
          log.testbed('user.password= '+user.password);
          log.testbed('JSON.parse(body).password= '+JSON.parse(body).password);
          log.testbed('user.email= '+user.email);
          log.testbed('JSON.parse(body).email= '+JSON.parse(body).email);
          
        _.isEqual(user, JSON.parse(body)).should.be.true;

        done();
      });
    });

    it('should return 404 when trying to update non-existing user', function(done) {
      var user = _.clone(existingUser);

      user._id     = '4fd3NNNNNN0dQQQ903000001';
//      user.<TODO add other fields> = 'IT Soft Corp Blah';

      request({
        method : 'PUT',
        url    : appUrl + '/users/' + user._id,
        form   : user
      }, function(err, res, body) {
        if (err) { throw err; }

        res.statusCode.should.equal(404);

        done();
      });
    });

    it('should return error for invalid name', function(done) {
      var user = _.clone(existingUser);

      user.userName  = 'B';

      log.testbed('sending request for= '+appUrl + '/users/' + user._id);
      request({
        method : 'PUT',
        url    : appUrl + '/users/' + user._id,
        form   : user
      }, function(err, res, body) {
        log.testbed('request callback. res.statusCode= '+res.statusCode);
        if (err) { 
          log.testbed('PUT returned an error. err=  '+err);
          throw err; 
        }

        if(body){
          body = JSON.parse(body);
          log.testbed('body.errors.userName= '+body.errors.userName);
        }
        log.testbed('config.error_messages.USERNAME= '+config.error_messages.USERNAME);

        res.statusCode.should.equal(200);
        should.equal(body.errors.userName, config.error_messages.USERNAME);

        done();
      });
    });

    it('should return error for existing email', function(done) {
      var user = _.clone(existingUser);

      // using an existing email
      user.email = 'andy_jenks@gmail.fu';

      request({
        method : 'PUT',
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

    it('should return error for invalid email', function(done) {
      var user = _.clone(existingUser);
      user.email = 'example@example';

      request({
        method : 'PUT',
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

    it('should return error for invalid birth date', function(done) {
      var user = _.clone(existingUser);
      user.born    = 'abc';

      request({
        method : 'PUT',
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

    it('should return error if birth date occured less than 18 years ago', function(done) {
      var user = _.clone(existingUser);
      user.born    = new Date();

      request({
        method : 'PUT',
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

    it('should delete user and return 200 OK', function(done) {

      async.series([
        function checkUser(callback) {
          User.findById(userId, function(err, user) {
            if (err) { throw err; }
            if (!user) { throw new Error('User doesnt exist'); }

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

    it('should return 404 if user doesnt exist', function(done) {
      var userId = '4fd331ec0f0d9ec903000001';

      request.del(appUrl + '/users/' + userId, function(err, res, body) {
        if (err) { throw err; }

        res.statusCode.should.equal(404);
        done();
      })
    });

  });

});
