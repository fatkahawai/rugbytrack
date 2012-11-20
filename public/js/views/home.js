/**
 * home.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * Backbone View module for the CLIENT-side application of RugbyTrack.
 * renders the template in home.html
 * 
 * Backbone views are used to reflect what your applications' data models look 
 * like. They are also used to listen to events and react accordingly. 
 * The views use a JavaScript templating library to render html, specifically 
 * Underscore.js's _.template.
 * We use jQuery 1.8.2 as our DOM manipulator.
 * With Backbone, the "el" property references the DOM object created in the browser. 
 * To attach a listener to our view, we use the "events" attribute of Backbone.View. 
 * Remember that event listeners can only be attached to child elements of the "el" property.
 * 
 * @throws none
 * @see 
 * 
 * @author Bob Drummond
 * (C) 2012 PINK PELICAN NZ LTD
 */

define('HomeView', [
  'jquery',
  'underscore',
  'backbone',
  'text!templates/home.html'
], function($, _, Backbone, tpl) {
  var HomeView;

  HomeView = Backbone.View.extend({

    // Constructor
    initialize: function() {
      this.template = _.template(tpl);
    },
    
    // The "render()" function will load our template into the view's "el" property using jQuery.
    render: function() {
      $(this.el).html(this.template());
      return this;
    }
  });

  return HomeView;
});
