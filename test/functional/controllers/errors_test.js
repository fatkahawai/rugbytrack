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

describe('Controllers::Errors', function() {

  before(function(done) {
    log.testbed("errors_test.js: before - entry");
    utils.loadConfig(root + 'config', function(conf) {
      var calledApp = false;
      log.testbed("errors_test.js: loadConfig callback - entry");

      config = conf;
      appUrl = conf.site_url + "/api/v1";

      AppEmitter.on('getApp', function(app) {
        log.testbed("errors_test.js: before: AppEmitter.on callback - entry");
        if (calledApp) { 
          log.testbed("errors_test.js: before: AppEmitter.on callback - ignoring");
          return false; 
        }

        calledApp = true;
        appServ = app;
        app.listen(config[ENV].PORT);
        log.testbed("errors_test.js: before: AppEmitter.on callback - called listen");
        done();
        log.testbed("errors_test.js: before: AppEmitter.on callback - called done");
      });
      AppEmitter.emit('checkApp');
    });
    log.testbed("errors_test.js: before - returning");
  });

  after(function(done) {
    var closedApp = false;

    log.testbed("errors_test.js: after - entry");
//    mongoose.disconnect();
    appServ.on('close', function() {
      log.testbed("errors_test.js: after- appServe.on callback - entry");
      setTimeout(function() {
        log.testbed("errors_test.js: after- appServe.on setTimeout callback - entry");
        if (!closedApp) {
          log.testbed("errors_test.js: after- appServe.on closing App");
          done();
          closedApp = true;
        }
      }, 500);
    });
    log.testbed("errors_test.js: after - closing appServ");
    appServ.close();
    log.testbed("errors_test.js: after - returning");
  });

  it("should return 404 for non-existing pages", function(done) {
    async.parallel([
      function get404(callback) {
        request(appUrl + '/users/kjsdflkjslkjdljsdlkjflskj', function(err, res, body) {
          callback(err, res.statusCode);
        });
      },
      function post404(callback) {
        request({
          method : "POST",
          url    : appUrl + '/users/kajshdkjhsdkjfhskjdhfkjhsdk',
          form   : {}
        }, function(err, res, body) {
          callback(err, res.statusCode);
        });
      },
      function put404(callback) {
        request({
          method : "PUT",
          url    : appUrl + '/cliekajshdkjhsdkjfhskjdhfkjhsdk',
          form   : {}
        }, function(err, res, body) {
          callback(err, res.statusCode);
        });
      },
      function del404(callback) {
       request.del(appUrl + '/cliekajshdkjhsdkjfhskjdhfkjhsdk', function(err, res, body) {
         callback(err, res.statusCode);
       });
      }
    ], function(err, results) {
      if (err) { throw err; }

      results.forEach(function(code) {
        code.should.equal(404);
      });

      done();
    });
  });

  it("should return 500 when internal error encountered", function(done) {
    request(appUrl.replace('/api/v1', '') + '/test_500_page', function(err, res, body) {
      log.testbed("result of the test_500_page simulate internal error test. res.statusCode ="+res.statusCode );
      if (err) { throw err; }

      res.statusCode.should.equal(500);
      done();
    });
  });

});
