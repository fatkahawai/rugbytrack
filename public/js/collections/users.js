/**
 * users.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * Backbone User COLLECTIONS module for the client-side application of RugbyTrack.
 * 
 * 
 * @throws none
 * @see 
 * 
 * @author Bob Drummond
 * (C) 2012 PINK PELICAN NZ LTD
 */

define("UserCollection", [
  "jquery",
  "underscore",
  "backbone",
  "UserModel"
], function($, _, Backbone, User) {
  var UserCollection;

  UserCollection = Backbone.Collection.extend({
    model : User,
    url   : "api/v1/users"  // url for accessing my server-side API
  });

  return UserCollection;
});
