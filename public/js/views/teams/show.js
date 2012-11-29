/**
 * teams/show.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * Backbone View module for the CLIENT-side application of RugbyTrack.
 * renders the template for the teams in templates/teams/show.html
 * 
 * @throws none
 * @see 
 * 
 * @author Bob Drummond
 * (C) 2012 PINK PELICAN NZ LTD
 */

define("TeamView", [
  "jquery",
  "underscore",
  "backbone",
  "moment",
  "text!templates/teams/show.html",
  "TeamModel"
], function($, _, Backbone, moment, tpl, Team) {
  var TeamView;

  TeamView = Backbone.View.extend({
    initialize: function() {
      this.template = _.template(tpl);
    },
    events: {
      "click .delete-btn": "removeTeam"
    },
    render: function() {
      var that = this, tmpl;

      tmpl = that.template({ team: this.model.toJSON() });
      $(that.el).html(tmpl);

      return this;
    },
    removeTeam: function(e) {
      e.preventDefault();

      this.model.destroy({
        sync: true,
        success: function(model) {
          model.trigger("delete-success");
        },
        error: function(model, res) {
          if (res.status === 404) {
            // TODO: handle 404 Not Found
          } else if (res.status === 500) {
            // TODO: handle 500 Internal Server Error
          }
        }
      })
    }
  });

  return TeamView;
});
