/**
 * events_controller.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * server-side MVC Controller for the Events class
 * This module handles the API requests from web clients related to events
 * sets up the express Routes for the get/put/post/deletes for /events,
 * which is a request like "GET <url>/events?arg=something"
 * 
 * it uses the methods of the Event model in models/event.js to read and write events data
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

var v1       = "/api/v1",                    // versioning for the APIs
    utils    = require("../../lib/utils"),
    log      = require("../../lib/logger"),
    _        = require("underscore"),
    NotFound = utils.NotFound,
    checkErr = utils.checkErr,
    EventsController;

EventsController = function(app, mongoose, config) {

  var Event = mongoose.model("Event");

/*
 * GET (all events)
 */
  app.get(v1 + "/events", function index(req, res, next) {
    Event.search(req.query, function(err, events) {
      checkErr(
        next,
        [{ cond: err }],
        function() {
          // TODO: finish etag support here, check for If-None-Match
          res.header("ETag", utils.etag(events));
          res.json(events);
        }
      );
    });
  });

/*
 * GET (a event)
 */
  app.get(v1 + "/events/:id", function show(req, res, next) {
    Event.findById(req.params.id, function(err, event) {
      checkErr(
        next,
        [{ cond: err }, { cond: !event, err: new NotFound("json") }],
        function() {
          // TODO: finish etag support here, check for If-None-Match
          res.header("ETag", utils.etag(event));
          res.json(event);
        }
      );
    });
  });

/*
 * POST - create event
 */
  app.post(v1 + "/events", function create(req, res, next) {
    var newEvent;

    // disallow other fields besides those listed below
    newEvent = new Event(_.pick(req.body, "eventID", "eventType", "eventParam", "game", "elapsedSeconds", "possession", "positionX", "positionY", "player", "recordingUser"));
    newEvent.save(function(err) {
      var errors, code = 200, loc;

      if (!err) {
        loc = config.site_url + v1 + "/events/" + newEvent._id;
        res.setHeader("Location", loc);
        res.json(newEvent, 201);
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
 * PUT - update a event data
 */
  app.put(v1 + "/events/:id", function update(req, res, next) {
    Event.findById(req.params.id, function(err, event) {
      checkErr(
        next,
        [{ cond: err }, { cond: !event, err: new NotFound("json") }],
        function() {
          var newAttributes;

          // modify resource with allowed attributes
          newAttributes = _.pick(req.body, "eventID", "eventType", "eventParam", "game", "elapsedSeconds", "possession", "positionX", "positionY", "player", "recordingUser");
          event = _.extend(event, newAttributes);

          event.save(function(err) {
            var errors, code = 200;

            if (!err) {
              // send 204 No Content
              res.send();
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
        }
      );
    });
  });

/*
 * DEL - remove a event
 */
  app.del(v1 + "/events/:id", function destroy(req, res, next) {
    Event.findById(req.params.id, function(err, event) {
      checkErr(
        next,
        [{ cond: err }, { cond: !event, err: new NotFound("json") }],
        function() {
          event.remove();
          res.json({});
        }
      );
    });
  });

};

module.exports = EventsController;
