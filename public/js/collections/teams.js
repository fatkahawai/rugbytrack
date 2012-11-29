/**
 * teams.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * Backbone Team COLLECTIONS module for the client-side application of RugbyTrack.
 * 
 * 
 * @throws none
 * @see 
 * 
 * @author Bob Drummond
 * (C) 2012 PINK PELICAN NZ LTD
 */

define("TeamCollection", [
  "jquery",
  "underscore",
  "backbone",
  "TeamModel"
], function($, _, Backbone, Team) {
  var TeamCollection;

  TeamCollection = Backbone.Collection.extend({
    model : Team,
    url   : "api/v1/teams"  // url for accessing my server-side API
  });

  return TeamCollection;
});
