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
  'text!templates/header.html',
  'SessionModel',
], function($, _, Backbone, tpl, Session) {
  var HeaderView;

  HeaderView = Backbone.View.extend({
    selectedItem : String,
    
    initialize: function() {
      if (DEBUG) console.log('view/header.js: initialize' );
      var ajaxLoader;

      this.model.bind('change', this.render); 

      this.template = _.template(tpl);

      $('body').ajaxStart(function() {
        ajaxLoader = ajaxLoader || $('.ajax-loader');
        ajaxLoader.show();
      }).ajaxStop(function() {
        ajaxLoader.fadeOut('fast');
      });
    },
    
    render: function() {
      if (DEBUG) console.log('view/header.js: render the menu bar' );
      $(this.el).html(this.template); 

      if( window.activeSession.isLoggedIn() ){
        if (DEBUG) console.log('view/header.js: render : logged-in user, so hiding sign in menu' );
         $('.signin-menu').hide();
      }
      else $('.signin-menu').show();
      
      if( !window.activeSession.get('isAdmin') ){
        if (DEBUG) console.log('view/header.js: render : logged-in user is not Admin, so hiding admin menu' );
         $('.admin-menu').hide();
      }
      else $('.admin-menu').show();
      return this;
    },
    
    select: function(item) {
      if (DEBUG) console.log('view/header.js: select menu item '+item );

      $('.nav li').removeClass('active');
      $('.' + item).addClass('active');
      this.selectedItem = item;
    },
    
    currentActive: function() {  // bob: added to find out active menu item
      if (DEBUG) console.log('view/header.js: currentActive(): returning '+this.selectedItem);
      return(this.selectedItem);
    }
  });

  return HeaderView;
});
