/**
 * collections/sessions.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * Backbone Session COLLECTIONS module for the client-side application of RugbyTrack.
 * 
 * 
 * @throws none
 * @see 
 * 
 * @author Bob Drummond
 * (C) 2012 PINK PELICAN NZ LTD
 */

define("SessionCollection", [
  "jquery",
  "underscore",
  "backbone",
  "SessionModel"
], function($, _, Backbone, Session) {
  var SessionCollection;

  SessionCollection = Backbone.Collection.extend({
    model : Session,
    url   : "api/v1/sessions"  // url for accessing my server-side API
  });

  return SessionCollection;
});
