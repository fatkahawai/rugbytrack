/**
 * logs_controller.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * server-side MVC Controller for logging client-side errors and stats
 * This module handles the API requests from web clients related to logs
 * 
 * it uses the methods of the Log model in models/log.js to read and write users data
 *  
 * This is server-side JavaScript, intended to be run with Express on NodeJS.
 * it uses Mongoose library for MongoDB
 * 
 * @throws none
 * @see 
 * 
 * @author Bob Drummond
 * (C) 2012 PINK PELICAN NZ LTD
 */

var v1       = '/api/v1',                    // versioning for the APIs
    utils    = require('../../lib/utils'),
    log      = require('../../lib/logger'),
    _        = require('underscore'),
    NotFound = utils.NotFound,
    checkErr = utils.checkErr,
    LogsController;

LogsController = function(app, mongoose, config) {

//  var Log = mongoose.model('Log');

/*
 * POST - create a new log entry 
 */
  app.post(v1 + '/logs', function create(req, res, next) {
    
    log.debug('logs_controller.js: received a POST to create a new server-side log entry');
    log.info('logs_controller.js: details='+req.body.details);

    // respond with OK and no content
    res.send(204);
  });


};

module.exports = LogsController;
