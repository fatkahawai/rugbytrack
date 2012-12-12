/**
 * models/session.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * Backbone Session MODEL module for the client-side application of RugbyTrack.
 * 
 * @throws none
 * @see 
 * 
 * @author Bob Drummond
 * (C) 2012 PINK PELICAN NZ LTD
 */

define('SessionModel', [
  'jquery',
  'underscore',
  'backbone',
  'myassert',
  'logToServer'
], function($, _, Backbone,myassert,logToServer) {  
  var Session;

  Session = Backbone.Model.extend({

    idAttribute: '_id',

    urlRoot: '/api/v1/sessions', // my RESTful server API backbone uses to exchange data with my express server app

    // set defaults for checking existance in the template for the new model
    defaults: {
      userName            : '',
      password            : '',
      startDate           : '',
      isAdmin    : false,
      isRecorder : false
    },
    
    initialize: function() {
      this.on('change', function(model){
        if (DEBUG) console.log('model/session.js: [onchange] eventhandler: _id has changed to '+model.get('_id')+
        ' userName= '+model.get('userName')+
        ' isAdmin= '+model.get('isAdmin')+
        ' isRecorder= '+model.get('isRecorder')
        );
        if (DEBUG) console.log('isLoggedIn() returns '+model.isLoggedIn() );
        
        // save the username and password into the global activeSession object
        window.activeSession.set({
          _id                 : model.get('_id'),
          userName            : model.get('userName'),
          password            : model.get('password'),
          startDate           : model.get('startDate'),
          isAdmin             : model.get('isAdmin'),
          isRecorder          : model.get('isRecorder')
        });


      });
    /*  or simply 'this.on('change', function(model){});' to listen for changes to all attributes of the model.*/
    },

    isLoggedIn         : function() {
      return (this.get('userName').length > 0);
    },
  }); // Backbone.Model.extend

  // instantiate a global Session object for the current session.
  window.activeSession = new Session;
  
  return Session;
}); // define namespace
