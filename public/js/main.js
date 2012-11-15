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
    
    'UserModel'      : 'models/user',
    'UserCollection' : 'collections/users',
    'HomeView'       : 'views/home',
    'HeaderView'     : 'views/header',
    'UserListView'   : 'views/users/index',
    'UserEditView'   : 'views/users/edit',
    'UserView'       : 'views/users/show'
    
    // <TODO - add other collections ,views, models
  }
});

require(['App'], function(App, User) { // <TODO plus other collections
  App.initialize();
});
