/**
 * games_controller.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * server-side MVC Controller for the Games class
 * This module handles the API requests from web clients related to games
 * sets up the express Routes for the get/put/post/deletes for /games,
 * which is a request like "GET <url>/games?arg=something"
 * 
 * it uses the methods of the Game model in models/game.js to read and write games data
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
    log    = require("../../lib/logger"),
    _        = require("underscore"),
    NotFound = utils.NotFound,
    checkErr = utils.checkErr,
    GamesController;

GamesController = function(app, mongoose, config) {

  var Game = mongoose.model("Game");

/*
 * GET (all games)
 */
  app.get(v1 + "/games", function index(req, res, next) {
    Game.search(req.query, function(err, games) {
      checkErr(
        next,
        [{ cond: err }],
        function() {
          // TODO: finish etag support here, check for If-None-Match
          res.header("ETag", utils.etag(games));
          res.json(games);
        }
      );
    });
  });

/*
 * GET (a game)
 */
  app.get(v1 + "/games/:id", function show(req, res, next) {
    Game.findById(req.params.id, function(err, game) {
      checkErr(
        next,
        [{ cond: err }, { cond: !game, err: new NotFound("json") }],
        function() {
          // TODO: finish etag support here, check for If-None-Match
          res.header("ETag", utils.etag(game));
          res.json(game);
        }
      );
    });
  });

/*
 * POST - create game
 */
  app.post(v1 + "/games", function create(req, res, next) {
    var newGame;

    // disallow other fields besides those listed below
    newGame = new Game(_.pick(req.body, "gameID", "homeTeam", "awayTeam", "datePlayed", "dateRecorded", "approved", "twitterHashTag"));
    newGame.save(function(err) {
      var errors, code = 200, loc;

      if (!err) {
        loc = config.site_url + v1 + "/games/" + newGame._id;
        res.setHeader("Location", loc);
        res.json(newGame, 201);
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
 * PUT - update a game data
 */
  app.put(v1 + "/games/:id", function update(req, res, next) {
    Game.findById(req.params.id, function(err, game) {
      checkErr(
        next,
        [{ cond: err }, { cond: !game, err: new NotFound("json") }],
        function() {
          var newAttributes;

          // modify resource with allowed attributes
          newAttributes = _.pick(req.body, "gameID", "homeTeam", "awayTeam", "datePlayed", "dateRecorded", "approved", "twitterHashTag" );
          game = _.extend(game, newAttributes);

          game.save(function(err) {
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
 * DEL - remove a game
 */
  app.del(v1 + "/games/:id", function destroy(req, res, next) {
    Game.findById(req.params.id, function(err, game) {
      checkErr(
        next,
        [{ cond: err }, { cond: !game, err: new NotFound("json") }],
        function() {
          game.remove();
          res.json({});
        }
      );
    });
  });

};

module.exports = GamesController;
