/**
 * sessions/index.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * Backbone View module for the CLIENT-side application of RugbyTrack.
 * renders the template for the sessions in templates/sessions/index.html
 * 
 * @throws none
 * @see 
 * 
 * @author Bob Drummond
 * (C) 2012 PINK PELICAN NZ LTD
 */

define("SessionListView", [
  "jquery",
  "underscore",
  "backbone",
  "moment",
  "text!templates/sessions/index.html",
  "SessionCollection"
], function($, _, Backbone, moment, tpl, SessionCollection) {
  var SessionListView;

  SessionListView = Backbone.View.extend({
    initialize: function() {
      var sessionList;

      this.template = _.template(tpl);
      this.collection = new SessionCollection();
    },
    getData: function(callback) {
      this.collection.fetch({
        success: function(collection) {
          callback(collection);
        },
        error: function(coll, res) {
          if (res.status === 404) {
            // TODO: handle 404 Not Found
            if(DEBUG) console.log("views/session/index.js: fetch sessions failed - 404 not found");
          } else if (res.status === 500) {
            // TODO: handle 500 Internal Server Error
            if(DEBUG) console.log("views/session/index.js: fetch sessions failed - 500 internal server error");
          }
        }
      });
    },
    // render template after data refresh
    render: function(callback) {
      var that = this, tmpl;

      if (DEBUG) console.log('views/session/index.js: render event. isLoggedIn= '+window.activeSession.isLoggedIn()+' isAdmin= '+window.activeSession.get('isAdmin'));

      if( window.activeSession.get('isAdmin') ){
        this.getData(function(collection) {
          tmpl = that.template({ sessions: collection.toJSON() });
          $(that.el).html(tmpl);

          callback();
        });
      }
      else{
        if (DEBUG) console.log('views/session/index.js: User is not authorised to view sessions list');
        
      }
    }
  });

  return SessionListView;
});
