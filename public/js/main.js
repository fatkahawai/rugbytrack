/**
 * main.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * Core module for the CLIENT-side application of RugbyTrack.
 * 
 * uses backbone.js MVC framework, which depends on the underscore.js utility library.
 * The main concept I follow when using Backbone.js is to make Views listen for 
 * changes in the Model and react accordingly.
 * Models are the heart of any JavaScript application, containing the interactive 
 * data as well as a large part of the logic surrounding it: conversions, validations, 
 * computed properties, and access control.A Model in Backbone.js can represent any entity. 
 * chair = Backbone.model.extend( {object definition});
 * 
 * We can easily create Models but without 
 * any structure they are fairly useless because we can’t iterate through 
 * them unless they are grouped together. So Backbone.js implements the Collection 
 * class which allows us to order our models. 
 * chairs = Backbone.collections.extend( {initialize: function(models, options  ) {});
 * 
 * Then you can bind listeners/events 
 * to Models and Collections. So whenever there are changes to the data we can 
 * call events to react accordingly.
 * AppView = Backbone.View.extend({});
 * 
 * @throws none
 * @see 
 * 
 * @author Bob Drummond
 * (C) 2012 PINK PELICAN NZ LTD
 */


requirejs.config({
  shim: {
    'underscore': {
      exports: '_'
    },
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'bootstrap': {
      deps: ['jquery'],
      exports: 'bootstrap'
    }
  },
  /**
   * HACK:
   * Modified Underscore and Backbone to be AMD compatible (define themselves)
   * since it didn't work properly with the RequireJS shim when optimizing
   */
  paths: {
    'text'             : 'lib/text',
    'jquery'           : 'lib/jquery',
    'underscore'       : 'lib/underscore-amd',
    'backbone'         : 'lib/backbone-amd',
    'bootstrap'        : 'lib/bootstrap',
    'moment'           : 'lib/moment',
    'Mediator'         : 'lib/mediator',
    'App'              : 'app',
    'Router'           : 'router',
    
    // <TODO - add other collections ,views, models
    'AboutView'      : 'views/about',
    
    
    'UserModel'      : 'models/user',
    'UserCollection' : 'collections/users',
    'HomeView'       : 'views/home',
    'HeaderView'     : 'views/header',
    'UserListView'   : 'views/users/index',
    'UserEditView'   : 'views/users/edit',
    'UserView'       : 'views/users/show'
  }
});

require(['App'], function(App, User) { // <TODO plus other collections
  App.initialize();
});
