/**
 * events/show.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * Backbone View module for the CLIENT-side application of RugbyTrack.
 * renders the template for the events in templates/events/show.html
 * Show a list of all events in a game collection. allow user to delete individual events.
 * 
 * @throws none
 * @see 
 * 
 * @author Bob Drummond
 * (C) 2012 PINK PELICAN NZ LTD
 */

define("EventView", [
  "jquery",
  "underscore",
  "backbone",
  "moment",
  "text!templates/events/show.html",
  "EventModel"
], function($, _, Backbone, moment, tpl, Event) {
  var EventView;

  EventView = Backbone.View.extend({
    initialize: function() {
      this.template = _.template(tpl);
    },
    events: {
      "click .delete-btn": "removeEvent"
    },
    render: function() {
      var that = this, tmpl;

      tmpl = that.template({ event: this.model.toJSON() });
      $(that.el).html(tmpl);

      return this;
    },
    removeEvent: function(e) {
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

  return EventView;
});
