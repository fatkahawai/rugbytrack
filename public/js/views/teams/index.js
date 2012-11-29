/**
 * teams/index.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * Backbone View module for the CLIENT-side application of RugbyTrack.
 * renders the template for the teams in templates/teams/index.html
 * 
 * @throws none
 * @see 
 * 
 * @author Bob Drummond
 * (C) 2012 PINK PELICAN NZ LTD
 */

define("TeamListView", [
  "jquery",
  "underscore",
  "backbone",
  "moment",
  "text!templates/teams/index.html",
  "TeamCollection"
], function($, _, Backbone, moment, tpl, TeamCollection) {
  var TeamListView;

  TeamListView = Backbone.View.extend({
    initialize: function() {
      var teamList;

      this.template = _.template(tpl);
      this.collection = new TeamCollection();
    },
    getData: function(callback) {
      this.collection.fetch({
        success: function(collection) {
          callback(collection);
        },
        error: function(coll, res) {
          if (res.status === 404) {
            // TODO: handle 404 Not Found
          } else if (res.status === 500) {
            // TODO: handle 500 Internal Server Error
          }
        }
      });
    },
    // render template after data refresh
    render: function(callback) {
      var that = this, tmpl;

      this.getData(function(collection) {
        tmpl = that.template({ teams: collection.toJSON() });
        $(that.el).html(tmpl);

        callback();
      });
    }
  });

  return TeamListView;
});
