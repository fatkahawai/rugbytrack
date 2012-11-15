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
    'jquery'           : '../../js/lib/jquery.min',
    'underscore'       : '../../js/lib/underscore.min',
    'backbone'         : '../../js/lib/backbone',
    'App'              : '../../js/app',
    'Router'           : '../../js/router',

    'UserModel'      : '../../js/models/user',
    'UserCollection' : '../../js/collections/users',
    // ============ Specs follow ============
    'UserModelSpec'  : 'js/spec/user.spec'
  }
//    <TODO add the other tables>
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
  mocha.setup({ ui: 'bdd' });
  require(['UserModelSpec'], function(App, User) {
    <TODO add the other tables>
    mocha.run();
  });
});
