/**
 * event.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * Backbone Event MODEL module for the client-side application of RugbyTrack.
 * Models are used to represent data from your server and actions you perform 
 * on them will be translated to RESTful operations. The id attribute of a model 
 * identifies how to find it on the database usually mapping to the surrogate key.
 * 
 * The server has implemented a RESTful URL /events which allows us to interact with it.
 * If we wish to create a new event on the server then we will instantiate a new 
 * Event and call save. If the id attribute of the model is null, Backbone.js 
 * will send of POST request to the server to the urlRoot.
 * 
 * If we instantiate a model with an id, Backbone.js will automatically perform a 
 * get request to the urlRoot + "/id" (conforming to RESTful conventions)
 * 
 * we can perform an update using the save api call which is intelligent and will 
 * send a PUT request instead of a POST request if an id is present (conforming 
 * to RESTful conventions)
 * 
 * When a model has an id we know that it exists on the server, so if we wish 
 * to remove it from the server we can call destroy. destroy will fire off a 
 * DELETE /event/id (conforming to RESTful conventions).
 * 
 * @throws none
 * @see 
 * 
 * @author Bob Drummond
 * (C) 2012 PINK PELICAN NZ LTD
 */

define("EventModel", [
  "jquery",
  "underscore",
  "backbone"
], function($, _, Backbone) {
  var Event;

  Event = Backbone.Model.extend({

    idAttribute: "_id",

    urlRoot: "/api/v1/events", // my RESTful server API backbone uses to exchange data with my express server app

    // set defaults for checking existance in the template for the new model
    defaults: {
      eventID         : "",    // user command 
      eventType       : "",    // 
      eventParam      : "",    // optional argument to the command
      game            : "",    // ID of game for this event
      elapsedSeconds  : 0,     // seconds elapsed since match began (match clock) : 0 - 85*60
      possession      : "",    // team in possession
      positionX       : 0,     // X coordinate of event from mouse/pointer position
      positionY       : 0,     // Y coordinate of event
      player          : "",    // player in possession
      recordingUser   : ""     // userID of the admin user who recorded the event 
    },   
    
    // standard commands entered by recording user
    eventTypeNames: {
      "t" : "Timestamp",
      "s" : "Scrum",
      "p" : "Penalty",
      "f" : "Free kick",
      "l" : "Lineout",
      "r" : "Ruck",
      "m" : "Maul",
      " " : "Tackle",
      "k" : "Kick",
      "c" : "Catch",
      "o" : "Out of play",
      "e" : "Error",
      "w" : "Won possession",
      "s" : "Scoring"
    },
    
    kickArgumentNames: {
      "u" : "Punt",
      "." : "at Goal",
      "," : "dropout",
      "/" : "chargedown",
    },

    scoringArgumentNames: {
      "5" : "Try",
      "3" : "Penalty or Dropgoal",
      "2" : "Conversion",
    },
    /* 
     * i should maybe add an 
     initialize: function()
     * here. and add a listner on any of the model attributes like this example

       this.on("change:name", function(model){
                var name = model.get("name"); // "Stewie Griffin"
                alert("Changed my name to " + name );
            });
     *  or simply "this.on("change", function(model){});" to listen for changes to all attributes of the model.
     */
    validate: function(attrs) { // validate is called automatically by the backbone framework when saving etc
      var fields, i, len, nameLen, compLen, errors = {};

      /**
       * HACK: don"t validate when silent is passed as an attribute
       * Useful when fetching model from server only by id
       */
      if (!attrs._silent) {
        // check if REQUIRED fields are present
        // TODO: instead of validation, i could apply dynamic defaults here, such as team = team from last event
        fields = ["eventID", "eventType", "game", "positionX", "positionY"];
        for (i = 0, len = fields.length; i < len; i++) {
          if (!attrs[fields[i]]) {
            errors[fields[i]] = fields[i] + " required";
          }
        }

        // check valid event Type command - is only a single character
        commandLen = (attrs.eventType) ? attrs.eventType.length : null;
        if (commandLen < 1 || commandLen > 1) {
          errors.eventType = "invalid Event Type command - only one char per command";
        }

        // check valid command character
        if (!(/^[a-zA-Z0-9._-]$/.test(attrs.eventType))) {
          errors.eventType = "invalid Event Type command - key not reognised";
        }

        // check valid game ID 
        compLen = (attrs.game) ? attrs.game.length : null;
        if (!compLen || (compLen < 1 || compLen > 100)) { // do some relevant validation
          errors.game = "invalid game";
        }

        // TODO: check valid positionX and position Y
        // TODO: check valid optional fields ?
        
        if (_.keys(errors).length) {
          return {
            errors: errors
          };
        }
      } // if (!attrs._silent)
    } // validate
  }); // Backbone.Model.extend

  return Event;
}); // define
