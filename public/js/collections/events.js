/**
 * events.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * Backbone Event COLLECTIONS module for the client-side application of RugbyTrack.
 * 
 * 
 * @throws none
 * @see 
 * 
 * @author Bob Drummond
 * (C) 2012 PINK PELICAN NZ LTD
 */

define("EventCollection", [
  "jquery",
  "underscore",
  "backbone",
  "EventModel"
], function($, _, Backbone, Event) {
  var EventCollection;

  EventCollection = Backbone.Collection.extend({
    model : Event,
    url   : "api/v1/events"  // url for accessing my server-side API
  });

  return EventCollection;
});
