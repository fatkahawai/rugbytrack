/**
 * app.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * App module for the CLIENT-side application of RugbyTrack.
 * uses backbone.js MVC framework, which depends on the underscore.js utility library.
 * 
 * @throws none
 * @see 
 * 
 * @author Bob Drummond
 * (C) 2012 PINK PELICAN NZ LTD
 */

define('App', [
  'jquery',
  'underscore',
  'backbone',
  'Router',
  'bootstrap'
], function($, _, Backbone, Router) {

  function initialize() {
    var app = new Router();

    Backbone.history.start();
  }

  // TODO: error handling with window.onerror
  // http://www.slideshare.net/nzakas/enterprise-javascript-error-handling-presentation

  return {
    initialize: initialize
  };
}); // define
