process.env.NODE_ENV = 'test';

var mongoose = require('mongoose'),
    root     = __dirname + '/../../../',
    utils    = require(root + 'lib/utils'),
    log      = require(root + 'lib/logger'),
    should   = require('should'),
    moment   = require('moment'),
    _        = require('underscore'),
    cleanDb  = utils.cleanDb,
    ENV, usersBulk;

ENV = process.env.NODE_ENV;

describe('Models::User', function() {
  var config, User;

  log.testbed( 'models/user_test.js: Models::User describe - entry');

  before(function(done) {
    log.testbed( 'models/user_test.js: before - entry');
    
    utils.loadConfig(root + 'config', function(conf) {
      log.testbed( 'models/user_test.js: loadConfig callback begin. connecting to DB...');

      config = conf;
        User = require(root + 'app/models/user')(mongoose);
        done();
    });
    log.testbed( 'models/user_test.js: before - returning');

  });

  after(function(done) {
    log.testbed( 'models/user_test.js: after - entry. cleaning Db');

    cleanDb(User, function() {
      log.testbed( 'models/user_test.js: cleanDb callback. disconnecting');
//      mongoose.disconnect();
      setTimeout(done, 1000);
    });
    log.testbed( 'models/user_test.js:  after - returning');
  });

  describe('#New user', function() {
  log.testbed( 'models/user_test.js: #New User describe - entry');

    beforeEach(function(done) {
      log.testbed( 'models/user_test.js: beforeEach - entry');
      cleanDb(User, function() {
        setTimeout(done, 200);
      });
    });

    log.testbed( 'models/user_test.js: running tests');
    
    it('should have the fields userName, email  required', function() {
      var newUser = new User();

      newUser.save(function(err) {
        err.errors.should.have.property('userName');
        err.errors.should.have.property('email');
      });
    });

    // 2 <= userName.length <= 100
    it('should have a valid userName', function(done) {
      var newUser     = new User(),
          anotherUser = new User(),
          lastUser    = new User(),
          left          = 3,
          temp          = '',
          i;

      newUser.userName    = 'A';
      newUser.email   = 'example@example.com';
      newUser.dateRegistered    = moment().year(1987).toDate();
      newUser.born    = moment().year(1987).toDate();

      newUser.save(function(err) {
        err.errors.should.have.property('userName');
        if (!--left) { done(); }
      });

      for (i = 1; i <= 101; i++) {
        temp += 'a';
      }

      anotherUser.userName = temp;
      anotherUser.email   = 'example2@example.com';
      anotherUser.dateRegistered    = moment().year(1987).toDate();
      anotherUser.born    = moment().year(1980).toDate();

      anotherUser.save(function(err) {
        err.errors.should.have.property('userName');
        if (!--left) { done(); }
      });

      lastUser.userName    = 'Andrew';
      lastUser.email   = 'example3asdasd@example.com';
      lastUser.dateRegistered    = moment().year(1987).toDate();
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

      newUser.userName    = 'Andrew';
      newUser.email   = 'examp$le@example.com';
      newUser.born    = moment().year(1987).toDate();

      newUser.save(function(err) {
        err.errors.should.have.property('email');
        if (!--left) { done(); }
      });

      anotherUser.userName = 'John';
      anotherUser.email   = 'example2@example';
      anotherUser.born    = moment().year(1980).toDate();

      anotherUser.save(function(err) {
        err.errors.should.have.property('email');
        if (!--left) { done(); }
      });

      lastUser.userName    = 'Andrew';
      lastUser.email   = 'john.doe@yahoo.co.uk';
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

      newUser.userName    = 'Andrew';
      newUser.email   = 'andrew.doe@example.com';
      newUser.born    = 'abc';

      newUser.save(function(err) {
        log.testbed("save error shold be CastError: "+err.name);
        err.name.should.equal('CastError');
        if (!--left) { done(); }
      });

      anotherUser.userName = 'John';
      anotherUser.email   = 'example@example.com';
      anotherUser.born    = moment().subtract('years', 17).toDate();

      anotherUser.save(function(err) {
        err.errors.should.have.property('born');
        if (!--left) { done(); }
      });

      lastUser.userName    = 'Andrew';
      lastUser.email   = 'john.doe@yahoo.co.uk';
      lastUser.born    = moment().year(1987).toDate(); // valid

      lastUser.save(function(err) {
        should.not.exist(err);
        if (!--left) { done(); }
      });
    });
  });

  describe('#Static methods', function() {
  log.testbed( 'models/user_test.js: Static Methods describe - entry');

    before(function(done) {
    log.testbed( 'models/user_test.js: before callback - entry');
      cleanDb(User, function() {
        log.testbed( 'models/user_test.js: cleanDb callback - entry');
  
        utils.loadFixtures(function(err, users) {
          log.testbed( 'models/user_test.js: loadFixtures callback - entry');
          if (err) { throw err; }
          
          log.testbed( 'models/user_test.js: loadFixtures callback - calling bulkInsert');
          usersBulk = users;
          utils.bulkInsert(User, users, done);
        });
      });
    log.testbed( 'models/user_test.js: before callback - returning');
    });

    it('should search user by name', function(done) {
      var searchTerm = 'Fiona';

      User.search({ userName: searchTerm }, function(err, docs) {
        var bulkLen = usersBulk.length, expectedUsers;

        expectedUsers = _.filter(usersBulk, function(doc) {
          return doc.userName.indexOf(searchTerm) !== -1;
        });

        // 'sanitize' docs just in case, since Mongoose has strange getters and setters
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
