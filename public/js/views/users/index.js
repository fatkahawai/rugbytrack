/**
 * users/index.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * Backbone View module for the CLIENT-side application of RugbyTrack.
 * renders the template for the users in templates/users/index.html
 * 
 * @throws none
 * @see 
 * 
 * @author Bob Drummond
 * (C) 2012 PINK PELICAN NZ LTD
 */

define('UserListView', [
  'jquery',
  'underscore',
  'backbone',
  'moment',
  'text!templates/users/index.html',
  'UserCollection'
], function($, _, Backbone, moment, tpl, UserCollection) {
  var UserListView;

  UserListView = Backbone.View.extend({
    initialize: function() {
      var userList;

      if (DEBUG) console.log('views/users/index.js: init')
      
      this.template = _.template(tpl);
      this.collection = new UserCollection();
    },

    getData: function(callback) {
      this.collection.fetch({
        success: function(collection) {
          callback(collection);
        },
        error: function(coll, res) {
          if (res.status === 404) {
            // TODO: handle 404 Not Found
            if(DEBUG) console.log('view/users/index.js: fetch failed - 404 not found');
          } else if (res.status === 500) {
            // TODO: handle 500 Internal Server Error
            if(DEBUG) console.log('view/users/index.js: fetch failed - 500 internal server error');
          }
        }
      });
    },
    // render template after data refresh
    render: function(callback) {
      var that = this, tmpl;

      this.getData(function(collection) {
        tmpl = that.template({ users: collection.toJSON() });
        $(that.el).html(tmpl);

        callback();
      });
    }
  });

  return UserListView;
});
