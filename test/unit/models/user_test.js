process.env.NODE_ENV = 'test';

var mongoose = require('mongoose'),
    root     = __dirname + '/../../../',
    utils    = require(root + 'lib/utils'),
    should   = require('should'),
    moment   = require('moment'),
    _        = require('underscore'),
    cleanDb  = utils.cleanDb,
    ENV, usersBulk;

ENV = process.env.NODE_ENV;

describe('Models::User', function() {
  var config, User;

  before(function(done) {
    utils.loadConfig(root + 'config', function(conf) {
      config = conf;
      mongoose = utils.connectToDatabase(mongoose, config.db[ENV].main, function (err) {
        if (err) { throw err; }

        User = require(root + 'app/models/user')(mongoose);
        done();
      });
    });
  });

  after(function(done) {
    cleanDb(User, function() {
      mongoose.disconnect();
      setTimeout(done, 1000);
    });
  });

  describe('#New user', function() {

    beforeEach(function(done) {
      cleanDb(User, function() {
        setTimeout(done, 200);
      });
    });

    it('should have the fields name, email, born required', function() {
      var newUser = new User();

      newUser.save(function(err) {
        err.errors.should.have.property('name');
        err.errors.should.have.property('email');
        err.errors.should.have.property('born');
      });
    });

    // 2 <= name.length <= 100
    it('should have a valid name', function(done) {
      var newUser     = new User(),
          anotherUser = new User(),
          lastUser    = new User(),
          left          = 3,
          temp          = '',
          i;

      newUser.name    = "A";
      newUser.email   = "example@example.com";
      newUser.born    = moment().year(1987).toDate();

      newUser.save(function(err) {
        err.errors.should.have.property('name');
        if (!--left) { done(); }
      });

      for (i = 1; i <= 101; i++) {
        temp += 'a';
      }

      anotherUser.name = temp;
      anotherUser.email   = "example2@example.com";
      anotherUser.born    = moment().year(1980).toDate();

      anotherUser.save(function(err) {
        err.errors.should.have.property('name');
        if (!--left) { done(); }
      });

      lastUser.name    = "Andrew";
      lastUser.email   = "example3asdasd@example.com";
      lastUser.born    = moment().year(1987).toDate();

      lastUser.save(function(err) {
        should.not.exist(err);
        if (!--left) { done(); }
      });
    });

    it('should have a valid email', function(done) {
      var newUser     = new User(),
          anotherUser = new User(),
          lastUser    = new User(),
          left          = 3;

      newUser.name    = "Andrew";
      newUser.email   = "examp$le@example.com";
      newUser.born    = moment().year(1987).toDate();

      newUser.save(function(err) {
        err.errors.should.have.property('email');
        if (!--left) { done(); }
      });

      anotherUser.name = "John";
      anotherUser.email   = "example2@example";
      anotherUser.born    = moment().year(1980).toDate();

      anotherUser.save(function(err) {
        err.errors.should.have.property('email');
        if (!--left) { done(); }
      });

      lastUser.name    = "Andrew";
      lastUser.email   = "john.doe@yahoo.co.uk";
      lastUser.born    = moment().year(1987).toDate();

      lastUser.save(function(err) {
        should.not.exist(err);
        if (!--left) { done(); }
      });
    });

    it('should have a valid birth date', function(done) {
      var newUser     = new User(),
          anotherUser = new User(),
          lastUser = new User(),
          left          = 3;

      newUser.name    = "Andrew";
      newUser.email   = "andrew.doe@example.com";
      newUser.born    = "abc";

      newUser.save(function(err) {
        err.name.should.equal('CastError');
        if (!--left) { done(); }
      });

      anotherUser.name = "John";
      anotherUser.email   = "example@example.com";
      anotherUser.born    = moment().subtract('years', 17).toDate();

      anotherUser.save(function(err) {
        err.errors.should.have.property('born');
        if (!--left) { done(); }
      });

      lastUser.name    = "Andrew";
      lastUser.email   = "john.doe@yahoo.co.uk";
      lastUser.born    = moment().year(1987).toDate();

      lastUser.save(function(err) {
        should.not.exist(err);
        if (!--left) { done(); }
      });
    });
  });

  describe('#Static methods', function() {

    before(function(done) {
      cleanDb(User, function() {
        utils.loadFixtures(function(err, users) {
          if (err) { throw err; }

          usersBulk = users;
          utils.bulkInsert(User, users, done);
        });
      });
    });

    it('should search user by name', function(done) {
      var searchTerm = 'Fiona';

      User.search({ name: searchTerm }, function(err, docs) {
        var bulkLen = usersBulk.length, expectedUsers;

        expectedUsers = _.filter(usersBulk, function(doc) {
          return doc.name.indexOf(searchTerm) !== -1;
        });

        // "sanitize" docs just in case, since Mongoose has strange getters and setters
        docs = JSON.parse(JSON.stringify(docs));
        docs.length.should.equal(2);
        _.isEqual(docs, expectedUsers).should.be.true;

        done();
      });
    });

    it('should search user by email', function(done) {
      var searchTerm = 'Sandrine@candice.us';

      User.search({ email: searchTerm }, function(err, docs) {
        var bulkLen = usersBulk.length, expectedUser;

        expectedUser = _.find(usersBulk, function(doc) {
          return doc.email.indexOf(searchTerm) !== -1;
        });

        docs = JSON.parse(JSON.stringify(docs));
        docs.length.should.equal(1);
        _.isEqual(docs[0], expectedUser).should.be.true;

        done();
      });
    });

  });

});
