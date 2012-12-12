/*
 * main.js - client-side testbed using Mocha
 * 
 * (C) 2012 Pink Pelican NZ Ltd
 */
requirejs.config({
  shim: {
    'underscore': {
      exports: '_'
    },

    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    }
  },
  paths: {
    'chai'             : '../../js/lib/chai',
    'mocha'            : '../../js/lib/mocha',
    'jquery'           : '../../js/lib/jquery',
    'underscore'       : '../../js/lib/underscore-amd',
    'backbone'         : '../../js/lib/backbone-amd',
    'App'              : '../../js/app',
    'Router'           : '../../js/router',

    // ============ Models and Collections follow ============
    'UserModel'      : '../../js/models/user',
    'UserCollection' : '../../js/collections/users',
    'TeamModel'      : '../../js/models/team',
    'TeamCollection' : '../../js/collections/teams',
    'GameModel'      : '../../js/models/game',
    'GameCollection' : '../../js/collections/games',
    'EventModel'      : '../../js/models/event',
    'EventCollection' : '../../js/collections/events',
//    <TODO: add the other models >

    // ============ Test Specs follow ============
    'UserModelSpec'  : 'js/spec/user.spec'
  }
});

require(['require', 'jquery', 'chai', 'mocha'], function(require, $, chai) {
  // register should on the Object prototype and expose chai goodies globally
  chai.should();
  window.expect = chai.expect;
  window.assert = chai.assert;

  /**
   * After mocha.run will be called it will check the global vars for leaks
   * You can setup allowed globals by setting the globals opt to an array
   * in mocha.setup(opts);
   * Any global vars defined before mocha.run() are accepted
   */
  mocha.setup({ ui: 'bdd', globals: ['console'] });
  require(['UserModelSpec'], function(App, 
    User
   /* TODO: add the other models Team, Game, Event*/
    ) {
    mocha.run();
  });
});
