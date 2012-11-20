/**
 * about.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * Backbone View module for the CLIENT-side application of RugbyTrack.
 * renders the template in about.html
 * 
 * @throws none
 * @see 
 * 
 * @author Bob Drummond
 * (C) 2012 PINK PELICAN NZ LTD
 */

define('AboutView', [
  'jquery',
  'underscore',
  'backbone',
  'text!templates/about.html'
], function($, _, Backbone, tpl) {
  var AboutView;

  AboutView = Backbone.View.extend({

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

  return AboutView;
});
