/**
 * team.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * server-side MVC MODEL definition for the Teams class.
 * This module defines the MongoDB schema for the Team class, validation of attributes, 
 * and some methods to search the collection for a specific team or teams.
 * It is used by the teams MVC Controller in controllers/teams_controller.js 
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
  var validator = require("../../lib/validator"),  // my validation methods 
      Schema    = mongoose.Schema,
      Team;

  Team = new Schema({

    teamName  :  {
      type     : String,
      validate : [validator({
        isTeamName: true 
      }), "teamName"],
      unique   : true,
      required : true
    },

    country : {
      type     : String,
      validate : [validator({
        isCountry : true
      }), "country"],
      required : false
    },

    province : {
      type     : String,
      required : false
    },

    homeVenue : {
      type     : String,
      validate : [validator({
        isVenue : true
      }), "homeVenue"],
      required : true
    },

    homeStrip : {
      type     : String,
      validate : [validator({
        isColor : true
      }), "homeStrip"],
      required : true
    },

    homeURL : {
      type     : String,
      validate : [validator({
        isURL : true
      }), "homeURL"],
      required : true
    },

    twitterHandle : {
      type     : String,
      validate : [validator({
        
      }), "twitterHandle"],
      required : true
    }

  });

/*
 * like - similar to SQL"s like
 */

  function like(query, field, val) {
    return (field) ? query.regex(field, new RegExp(val, "i")) : query;
  }

/*
 * Team.statics.search
 */
  Team.statics.search = function search(params, callback) {
    var Model = mongoose.model("Team"),
        query = Model.find();

    like(query, "teamName", params.teamName);
    like(query, "country", params.country);
    like(query, "province", params.province);

    query.exec(callback);
  };

/*
 * Team.statics.findById
 */
  Team.statics.findById = function findById(id, callback) {
    var Model = mongoose.model("Team"),
        query = Model.find();

    if (id.length !== 24) {
      callback(null, null);
    } else {
      Model.findOne().where("_id", id).exec(callback);
    }
  };

  return mongoose.model("Team", Team);
}
