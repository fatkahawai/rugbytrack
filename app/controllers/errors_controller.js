/**
 * errors_controller.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * MVC Controller for the Errors class
 * This module sets up the express 'routes' for errors
 * 
 * This is server-side JavaScript, intended to be run with Express on NodeJS.
 * uses Mongoose library for MongoDB
 * 
 * @throws none
 * @see 
 * 
 * @author Bob Drummond
 * (C) 2012 PINK PELICAN NZ LTD
 */
var utils    = require('../../lib/utils'),
    NotFound = utils.NotFound,
    log      = require('../../lib/logger'),
    ErrorsController;

/*
 * ErrorsController - the namespace to be exported
 */
ErrorsController = function(app, mongoose) {

  // only for test environment
  utils.ifEnv('test', function() {
    app.get('/test_500_page', function(req, res, next) {
      next(new Error('test'));
    });
  });

/*
 * Express Route: app.all('*',
 */
  app.all('*', function(req, res, next) {
    log.info('errors_controller.js: received an unknown request: '+JSON.stringify(req.body));
    throw new NotFound();
  });

  app.error(function(err, req, res, next) {
    log.info('errors_controller.js: error route activated: '+err.msg);
    if (err instanceof NotFound) {
      if (err.msg && err.msg === 'json') {
        res.json(null, 404);
      } else {
        log.info('errors_controller.js: 404 error '+err);
        res.send('404 - Page Not Found', 404);
      }
    } else {
      log.info('errors_controller.js: 500 error '+err);
      res.send('500 - Internal Server Error', 500);
    }
  });

};

module.exports = ErrorsController;
