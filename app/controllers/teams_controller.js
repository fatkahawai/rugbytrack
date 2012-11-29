/**
 * teams_controller.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * server-side MVC Controller for the Teams class
 * This module handles the API requests from web clients related to teams
 * sets up the express Routes for the get/put/post/deletes for /teams,
 * which is a request like "GET <url>/teams?arg=something"
 * 
 * it uses the methods of the Team model in models/team.js to read and write teams data
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
    TeamsController;

TeamsController = function(app, mongoose, config) {

  var Team = mongoose.model("Team");

/*
 * GET (all teams)
 */
  app.get(v1 + "/teams", function index(req, res, next) {
    Team.search(req.query, function(err, teams) {
      checkErr(
        next,
        [{ cond: err }],
        function() {
          // TODO: finish etag support here, check for If-None-Match
          res.header("ETag", utils.etag(teams));
          res.json(teams);
        }
      );
    });
  });

/*
 * GET (a team)
 */
  app.get(v1 + "/teams/:id", function show(req, res, next) {
    Team.findById(req.params.id, function(err, team) {
      checkErr(
        next,
        [{ cond: err }, { cond: !team, err: new NotFound("json") }],
        function() {
          // TODO: finish etag support here, check for If-None-Match
          res.header("ETag", utils.etag(team));
          res.json(team);
        }
      );
    });
  });

/*
 * POST - create team
 */
  app.post(v1 + "/teams", function create(req, res, next) {
    var newTeam;

    // disallow other fields besides those listed below
    newTeam = new Team(_.pick(req.body, "teamName", "country", "province", "homeVenue", "homeStrip", "homeURL", "twitterHandle"));
    newTeam.save(function(err) {
      var errors, code = 200, loc;

      if (!err) {
        loc = config.site_url + v1 + "/teams/" + newTeam._id;
        res.setHeader("Location", loc);
        res.json(newTeam, 201);
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
 * PUT - update a team data
 */
  app.put(v1 + "/teams/:id", function update(req, res, next) {
    Team.findById(req.params.id, function(err, team) {
      checkErr(
        next,
        [{ cond: err }, { cond: !team, err: new NotFound("json") }],
        function() {
          var newAttributes;

          // modify resource with allowed attributes
          newAttributes = _.pick(req.body, "teamName", "country", "province", "homeVenue", "homeStrip", "homeURL", "twitterHandle" );
          team = _.extend(team, newAttributes);

          team.save(function(err) {
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
 * DEL - remove a team
 */
  app.del(v1 + "/teams/:id", function destroy(req, res, next) {
    Team.findById(req.params.id, function(err, team) {
      checkErr(
        next,
        [{ cond: err }, { cond: !team, err: new NotFound("json") }],
        function() {
          team.remove();
          res.json({});
        }
      );
    });
  });

};

module.exports = TeamsController;
