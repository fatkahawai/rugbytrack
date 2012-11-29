/**
 * events/index.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * Backbone View module for the CLIENT-side application of RugbyTrack.
 * renders the template for the events in templates/events/index.html
 * 
 * @throws none
 * @see 
 * 
 * @author Bob Drummond
 * (C) 2012 PINK PELICAN NZ LTD
 */

define("EventListView", [
  "jquery",
  "underscore",
  "backbone",
  "moment",
  "text!templates/events/index.html",
  "EventCollection"
], function($, _, Backbone, moment, tpl, EventCollection) {
  var EventListView;

  EventListView = Backbone.View.extend({
    initialize: function() {
      var eventList;

      this.template = _.template(tpl);
      this.collection = new EventCollection();
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
        tmpl = that.template({ events: collection.toJSON() });
        $(that.el).html(tmpl);

        callback();
      });
    }
  });

  return EventListView;
});
