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

var DEBUG = true;

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
    'myassert'         : 'lib/myassert',
    'logtoserver'      : 'lib/logtoserver',
    'App'              : 'app',
    'Router'           : 'router',
    
    // <TODO - add other collections ,views, models
    'HomeView'       : 'views/home',
    'HeaderView'     : 'views/header',
    'AboutView'        : 'views/about',
    'SigninView'       : 'views/signin',
    'ContactView'      : 'views/contact',
    'FieldView'        : 'views/field',
    
    'UserModel'      : 'models/user',
    'UserCollection' : 'collections/users',
    'UserListView'   : 'views/users/index',
    'UserEditView'   : 'views/users/edit',
    'UserView'       : 'views/users/show',

    'TeamModel'      : 'models/team',
    'TeamCollection' : 'collections/teams',
    'TeamListView'   : 'views/teams/index',
    'TeamEditView'   : 'views/teams/edit',
    'TeamView'       : 'views/teams/show',

    'GameModel'      : 'models/game',
    'GameCollection' : 'collections/games',
    'GameListView'   : 'views/games/index',
    'GameEditView'   : 'views/games/edit',
    'GameView'       : 'views/games/show',

    'EventModel'      : 'models/event',
    'EventCollection' : 'collections/events',
    'EventListView'   : 'views/events/index',
    'EventEditView'   : 'views/events/edit',
    'EventView'       : 'views/events/show'

  }
});

require(['App','myassert','logtoserver'], function(App, User, Team, Game, Event) { // <TODO plus other collections
  App.initialize();

  if(DEBUG){
    myassert.setDisplayInWindow(true);    // log assertion failures and passes in the window footer 
    myassert.setDisplayInConsole(true);   // log to browser debug console on assertion failed
    myassert.setDisplayInAlert(true);     // popup on assert failed
    
    // as a test of displayInWindow only
    var randomtestresult = 24;
    myassert.ok( randomtestresult > 23, 'Checking the assert function - this should show as true');  
  }
  // log client-side window DOM or jQuery errors to the server for stats
  window.onerror = function(message, file, line) {
    logtoserver(file + ':' + line + ' #error #window_error ' + message); 
  };
  
   // log client-side ajax errors to the server for stats
   $(document).ajaxError(function(e, xhr, settings) {
     logtoserver(settings.url + ':' + xhr.status + ' #error #ajax_error ' + xhr.responseText);
   });
});
