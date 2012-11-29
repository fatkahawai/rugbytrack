/**
 * games/index.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * Backbone View module for the CLIENT-side application of RugbyTrack.
 * renders the template for the games in templates/games/index.html
 * 
 * @throws none
 * @see 
 * 
 * @author Bob Drummond
 * (C) 2012 PINK PELICAN NZ LTD
 */

define("GameListView", [
  "jquery",
  "underscore",
  "backbone",
  "moment",
  "text!templates/games/index.html",
  "GameCollection"
], function($, _, Backbone, moment, tpl, GameCollection) {
  var GameListView;

  GameListView = Backbone.View.extend({
    initialize: function() {
      var gameList;

      this.template = _.template(tpl);
      this.collection = new GameCollection();
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
        tmpl = that.template({ games: collection.toJSON() });
        $(that.el).html(tmpl);

        callback();
      });
    }
  });

  return GameListView;
});
