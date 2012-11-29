/**
 * games.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * Backbone Game COLLECTIONS module for the client-side application of RugbyTrack.
 * 
 * 
 * @throws none
 * @see 
 * 
 * @author Bob Drummond
 * (C) 2012 PINK PELICAN NZ LTD
 */

define("GameCollection", [
  "jquery",
  "underscore",
  "backbone",
  "GameModel"
], function($, _, Backbone, Game) {
  var GameCollection;

  GameCollection = Backbone.Collection.extend({
    model : Game,
    url   : "api/v1/games"  // url for accessing my server-side API
  });

  return GameCollection;
});
