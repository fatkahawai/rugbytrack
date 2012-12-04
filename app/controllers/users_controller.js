/**
 * users_controller.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * server-side MVC Controller for the Users class
 * This module handles the API requests from web clients related to users
 * sets up the express Routes for the get/put/post/deletes for /users,
 * which is a request like 'GET <url>/users?arg=something'
 * 
 * it uses the methods of the User model in models/user.js to read and write users data
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
    UsersController;

UsersController = function(app, mongoose, config) {

  var User = mongoose.model('User');

/*
 * GET (all users)
 */
  app.get(v1 + '/users', function index(req, res, next) {
    log.info('users_controller.js: GET all users');

    User.search(req.query, function(err, users) {
      log.info('users_controller.js: loaded '+users.length+' users');
      checkErr(
        next,
        [{ cond: err }],
        function() {
          // TODO: finish etag support here, check for If-None-Match
          res.header('ETag', utils.etag(users));
          res.json(users);
        }
      );
    });
  });

/*
 * GET (a user)
 */
  app.get(v1 + '/users/:id', function show(req, res, next) {
    log.info('users_controller.js: GET a user');

    User.findById(req.params.id, function(err, user) {
      checkErr(
        next,
        [{ cond: err }, { cond: !user, err: new NotFound('json') }],
        function() {
          // TODO: finish etag support here, check for If-None-Match
          res.header('ETag', utils.etag(user));
          res.json(user);
        }
      );
    });
  });

/*
 * POST - create user
 */
  app.post(v1 + '/users', function create(req, res, next) {
    var newUser;
    log.info('users_controller.js: POST to create a user');

    // disallow other fields besides those listed below
    newUser = new User(_.pick(req.body, 'userName', 'email', 'born' /*TODO: add all fields */));
    newUser.save(function(err) {
      var errors, code = 200, loc;

      if (!err) {
        loc = config.site_url + v1 + '/users/' + newUser._id;
        res.setHeader('Location', loc);
        res.json(newUser, 201);
      } else {
        errors = utils.parseDbErrors(err, config.error_messages);
        if (errors.code) {
          code = errors.code;
          delete errors.code;
          log.info(err);
        }
        res.json(errors, code);
      }
    });
  });

/*
 * PUT - update a user data
 */
  app.put(v1 + '/users/:id', function update(req, res, next) {
    log.info('users_controller.js: PUT to modify a user');
    
    User.findById(req.params.id, function(err, user) {
      checkErr(
        next,
        [{ cond: err }, { cond: !user, err: new NotFound('json') }],
        function() {
          var newAttributes;

          // modify resource with allowed attributes
          newAttributes = _.pick(req.body, 'userName', 'email', 'born'/*TODO: add all fields*/);
          user = _.extend(user, newAttributes);

          user.save(function(err) {
            var errors, code = 204;

            if (!err) {
              // send 204 No Content
              log.debug('users_controller.js: #PUT: save was ok, sending 204 no content');
              res.send();
            } else {
              log.debug('users_controller.js: #PUT: save failed. parsing Db error err.name= '+err.name);
              errors = utils.parseDbErrors(err, config.error_messages);
              log.debug('users_controller.js: #PUT: errors.code= '+errors.code);
              
              if (errors.code) {
                code = errors.code;
                delete errors.code;
                log.debug("users_controller.js: PUT error "+err);
              }
              log.debug("users_controller.js: PUT error - sending error response");
              res.json(errors, code);
              log.debug("users_controller.js: PUT - returning");
            }
          });
        }
      );
    });
  });

/*
 * DEL - remove a user
 */
  app.del(v1 + '/users/:id', function destroy(req, res, next) {
    log.info('users_controller.js: DEL a user');
    User.findById(req.params.id, function(err, user) {
      checkErr(
        next,
        [{ cond: err }, { cond: !user, err: new NotFound('json') }],
        function() {
          user.remove();
          res.json({});
        }
      );
    });
  });

};

module.exports = UsersController;
