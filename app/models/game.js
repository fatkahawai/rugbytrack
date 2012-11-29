/**
 * models/game.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * server-side MVC MODEL module for the game class.
 * Contains the MongoDB Schema  and validation calls for a game class.
 * And search methods to find a specific game stored in the Db
 * 
 * This is server-side JavaScript, intended to be run with Express on NodeJS using MongoDB NoSQL Db for persistence.
 * 
 * @throws none
 * @see 
 * 
 * @author Bob Drummond
 * (C) 2012 PINK PELICAN NZ LTD
 */
module.exports = function(mongoose) {
  var validator = require("../../lib/validator"),
      Schema    = mongoose.Schema,
      Game;

  Game = new Schema({
    
    // Each Game must have a unique ID or name
    gameID :  {
      type     : String,
      validate   : [validator({   
        isUnique : true
      }), "gameID"],
      unique   : true,  // TODO: do you have to give this unique to mongo or can mongo create a unique key ??
      required : true,   
      key: val 
    },
    
    // the name of the home team, from the Teams database list
    homeTeam : { 
      type: String,
      required : true,
      key: val 
    },
    
    // the name of the away team, from the Teams database list      
    awayTeam : { 
      type: String,
      required : true,
      key: val 
    },
    
    // The Kickoff time and date the game was or is to be played
    datePlayed :  {
      type     : Date,
      validate   : [validator({   // what if i"m creating an entry for a game to be played tomorrow ??"
        isHistoricDate : true
      }), "datePlayed"],
      required : true
    },
    
    // the time and date the game was recorded by a RugbyTrack user
    dateRecorded : { 
      type     : Date,
      required : true
    },
    
    // set true when the game record has been reviewed and approved
    approved : { 
      type: Boolean,
      required : false
    },
    
    // a twitter hashtag the app will use when tweeting stats, e.g. "#NZLvWAL"
    twitterHashTag : { 
      type: String,
      validate   : [validator({   // what if i"m creating an entry for a game to be played tomorrow ??"
        isTwitterHashTag : true
      }), "twitterHashTag"],
      required : false
    }

  });

/*
 * Method: search
 * 
 * similar to SQL"s like
 * 
 * @param query
 * @param field
 * @param val
 */
  function like(query, field, val) {
    return (field) ? query.regex(field, new RegExp(val, "i")) : query;
  }

/*
 * Method: search
 * 
 * @param id
 * @param callback
 */
  Game.statics.search = function search(params, callback) {
    var Model = mongoose.model("Game"),
        query = Model.find();


    like(query, "gameID", params.gameID);

    query.exec(callback);
  };

/*
 * Method: findById
 * 
 * @param id
 * @param callback
 */
  Game.statics.findById = function findById(id, callback) {
    var Model = mongoose.model("Game"),
        query = Model.find();

    if (id.length !== 24) {
      callback(null, null);
    } else {
      Model.findOne().where("_id", id).exec(callback);
    }
  };

  return mongoose.model("Game", Game);
}
