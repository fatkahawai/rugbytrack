/**
 * event.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * server-side MVC MODEL definition for the Events class.
 * This module defines the MongoDB schema for the Event class, validation of attributes, 
 * and some methods to search the collection for a specific event or events.
 * It is used by the events MVC Controller in controllers/events_controller.js 
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
      Event;

  Event = new Schema({

    eventID  :  {  // unique id for this event
      type     : String,
      unique   : true,
      required : true
    },
    
    eventType  :  {  // Command or event type
      type     : String,
      validate : [validator({
        isEventType: true
      }), "eventType"],
      required : true
    },

    eventParam  :  {
      type     : String,
      validate : [validator({
        isEventParam: true
      }), "eventParam"],
      required : true
    },

    game  :  {      // name reference to the game Object this event belongs to
      type     : String,
      validate : [validator({}), "game"],
      required : true
    },

    elapsedSeconds  :  {  // number of seconds since start of game (match clock not realtime)
      type     : Integer,
      validate : [validator({
        range: {
          min : 0,
          max : 90*60   // max 90 minutes
        }

      }), "elapsedSeconds"],
      required : false
    },

    possession  :  {
      type     : String,
      validate : [validator({
        
      }), "possession"],
      required : false
    },

    positionX  :  {
      type     : String,
      validate : [validator({
        isPositionCoord: true
      }), "positionX"],
      required : true
    },

    positionY  :  {
      type     : String,
      validate : [validator({
        isPositionCoord: true
      }), "positionY"],
      required : true
    },

    player  :  {
      type     : String,
      validate : [validator({
        isUserName: true
      }), "player"],
      required : true
    },

    recordingUser  :  {
      type     : String,
      validate : [validator({
        isUserName: true
      }), "recordingUser"],
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
 * Event.statics.search
 */
  Event.statics.search = function search(params, callback) {
    var Model = mongoose.model("Event"),
        query = Model.find();

    like(query, "eventType", params.eventType);

    query.exec(callback);
  };

/*
 * Event.statics.findById
 */
  Event.statics.findById = function findById(id, callback) {
    var Model = mongoose.model("Event"),
        query = Model.find();

    if (id.length !== 24) {
      callback(null, null);
    } else {
      Model.findOne().where("_id", id).exec(callback);
    }
  };

  return mongoose.model("Event", Event);
}
