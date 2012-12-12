/**
 * logs_controller.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * server-side MVC Controller for logging client-side errors and stats
 * This module handles the API requests from web clients related to logs
 * 
 * it uses the methods of the Session model in models/log.js to read and write sessions data
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
    SessionsController;

SessionsController = function(app, mongoose, config) {

  var Session = mongoose.model('Session');

/*
 * GET (all sessions)
 */
  app.get(v1 + '/sessions', function index(req, res, next) {
    log.debug('sessions_controller.js: GET all sessions');

    Session.search(req.query, function(err, sessions) {
      log.debug('sessions_controller.js: loaded '+sessions.length+' sessions');
      checkErr(
        next,
        [{ cond: err }],
        function() {
          // TODO: finish etag support here, check for If-None-Match
          res.header('ETag', utils.etag(sessions));
          res.json(sessions);
        }
      ); // checkErr
    }); // search
  }); // app.get

/*
 * GET (a session)
 */
  app.get(v1 + '/sessions/:id', function index(req, res, next) {
    log.debug('sessions_controller.js: GET a session'+req.params.id);

    Session.findById(req.params.id, function(err, session) {
      log.debug('sessions_controller.js: loaded session');
      checkErr(
        next,
        [{ cond: err }, { cond: !session, err: new NotFound('json') }],
        function() {
          // TODO: finish etag support here, check for If-None-Match
          res.header('ETag', utils.etag(session));
          res.json(session);
        }
      ); // checkErr
    }); // search
  }); // app.get

/*
 * POST - create a new session entry 
 */
  app.post(v1 + '/sessions', function create(req, res, next) {
    var newSession;
    var name;
    var User = mongoose.model('User');
    var user;
    
    name = req.body.userName;
    log.debug('sessions_controller.js: received a POST to create a new session for user= '+name);

    User.search({ userName: name}, function(err, users) {
      if ( users.length != 1 ) {
        log.info('sessions_controller.js: Database consistency ERROR. found multple ('+users.length+') users matching this userName'+name);
        return;
      }
      user = users[0];
      log.debug('sessions_controller.js: found the userName='+user.userName+
                '\nuser object is '+JSON.stringify(user));
                
      createSession(user, res);
    }); // User.search

    // respond with OK and no content
    // res.send(204);
  }); // app.post

var createSession = function( user, res ) {
  
    var newSession;
    
    newSession = new Session({userName: user.userName, password: user.password, startDate: new Date(), isAdmin: user.isAdmin, isRecorder: user.isRecorder });
    
    log.debug('sessions_controller.js: added start date, isAdmin, isRecorder attributes. \nsaving new session. '+JSON.stringify(newSession));

    newSession.save(function(err) {
      var errors, code = 200, loc;

      if (!err) {
        log.debug('sessions_controller.js: saved new session OK, _id='+newSession._id);
        
        loc = config.site_url + v1 + '/sessions/' + newSession._id;
        log.debug('sessions_controller.js: sending response '+loc);
        res.setHeader('Location', loc);
        res.json(newSession, 201);
      } else {
        errors = utils.parseDbErrors(err, config.error_messages);
        if (errors.code) {
          code = errors.code;
          delete errors.code;
          log.info(err);
        }
        log.info('sessions_controller.js: couldnt save new session, sending response '+errors);
        res.json(errors, code);
      } // else
    }); // save

};

}; // SessionsController

module.exports = SessionsController;
