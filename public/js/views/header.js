/**
 * header.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * Backbone View module for the CLIENT-side application of RugbyTrack.
 * renders the template for the navbar menu in header.html
 * NB: When the text! prefix is used for a dependency, RequireJS will automatically 
 * load the text plugin and treat the dependency as a text resource.
 * 
 * @throws none
 * @see 
 * 
 * @author Bob Drummond
 * (C) 2012 PINK PELICAN NZ LTD
 */

define('HeaderView', [
  'jquery',
  'underscore',
  'backbone',
  'text!templates/header.html'
], function($, _, Backbone, tpl) {
  var HeaderView;

  HeaderView = Backbone.View.extend({
    initialize: function() {
      var ajaxLoader;

      this.template = _.template(tpl);

      $('body').ajaxStart(function() {
        ajaxLoader = ajaxLoader || $('.ajax-loader');
        ajaxLoader.show();
      }).ajaxStop(function() {
        ajaxLoader.fadeOut('fast');
      });
    },
    render: function() {
      $(this.el).html(this.template());
      return this;
    },
    select: function(item) {
      $('.nav li').removeClass('active');
      $('.' + item).addClass('active');
    }
  });

  return HeaderView;
});
