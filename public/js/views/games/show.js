/**
 * games/show.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * Backbone View module for the CLIENT-side application of RugbyTrack.
 * renders the template for the games in templates/games/show.html
 * 
 * @throws none
 * @see 
 * 
 * @author Bob Drummond
 * (C) 2012 PINK PELICAN NZ LTD
 */

define("GameView", [
  "jquery",
  "underscore",
  "backbone",
  "moment",
  "text!templates/games/show.html",
  "GameModel"
], function($, _, Backbone, moment, tpl, Game) {
  var GameView;

  GameView = Backbone.View.extend({
    initialize: function() {
      this.template = _.template(tpl);
    },
    events: {
      "click .delete-btn": "removeGame"
    },
    render: function() {
      var that = this, tmpl;

      tmpl = that.template({ game: this.model.toJSON() });
      $(that.el).html(tmpl);

      return this;
    },
    removeGame: function(e) {
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

  return GameView;
});
