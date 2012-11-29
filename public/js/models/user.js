/**
 * user.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * Backbone User MODEL module for the client-side application of RugbyTrack.
 * Models are used to represent data from your server and actions you perform 
 * on them will be translated to RESTful operations. The id attribute of a model 
 * identifies how to find it on the database usually mapping to the surrogate key.
 * 
 * The server has implemented a RESTful URL /users which allows us to interact with it.
 * If we wish to create a new user on the server then we will instantiate a new 
 * User and call save. If the id attribute of the model is null, Backbone.js 
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
 * DELETE /user/id (conforming to RESTful conventions).
 * 
 * @throws none
 * @see 
 * 
 * @author Bob Drummond
 * (C) 2012 PINK PELICAN NZ LTD
 */

define("UserModel", [
  "jquery",
  "underscore",
  "backbone"
], function($, _, Backbone) {
  var User;

  User = Backbone.Model.extend({

    idAttribute: "_id",

    urlRoot: "/api/v1/users", // my RESTful server API backbone uses to exchange data with my express server app

    // set defaults for checking existance in the template for the new model
    defaults: {
      userName        : "",
      password        : "",
      fullName        : "",
      email           : "",
      dateRegistered  : new Date(),
      born            : new Date(),
      country         : "",
      city            : "",
      timeZone        : "",
      homeTeam        : "",
      favSecondTeam   : "",
      facebookID      : "",
      facebookPwd     : "",
      twitterID       : "",
      twitterPwd      : "",
      googleID        : "",
      googlePwd       : ""

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
      var fields, i, len, nameLen, errors = {};

      /**
       * HACK: don"t validate when silent is passed as an attribute
       * Useful when fetching model from server only by id
       */
      if (!attrs._silent) {
        // check required fields
        fields = ["userName", "password", "fullName", "email" ];  // TODO: make sure this list is complete
        for (i = 0, len = fields.length; i < len; i++) {
          if (!attrs[fields[i]]) {
            errors[fields[i]] = fields[i] + " required";
          }
        }

        // TODO: complete these client-side validations of user inputs

        // check valid userName
        nameLen = (attrs.userName) ? attrs.userName.length : null;
        if (nameLen < 2 || nameLen > 100) {
          errors.userName = "invalid username - must be between 5 and 32 alphanumeric characters only";
        }

        // TODO: check valid password, fullName, birth date, country, city, homeTeam, favSecondTeam
        if ( attrs.fullName ) 
          if (!(/^[a-zA-Z0-9\-\ ]+$/.test(attrs.email))) {
            errors.fullName = "invalid full Name";
        }
        
        // check valid email
        if (!(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(attrs.email))) {
          errors.email = "invalid email address format";
        }

        // check valid twitterID
        if (!(/^\@[a-zA-Z0-9._-]+$/.test(attrs.twitterID))) {
          errors.twitterID = "invalid twitter ID format";
        }

        if (_.keys(errors).length) {
          return {
            errors: errors
          };
        }
      } // if (!attrs._silent)
    } // validate
  }); // Backbone.Model.extend

  return User;
}); // define namespace
