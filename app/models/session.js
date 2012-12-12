/**
 * session.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * server-side MVC MODEL definition for the Sessions class.
 * This module defines the MongoDB schema for the Session class, validation of attributes, 
 * and some methods to search the collection for a specific session or sessions.
 * It is used by the sessions MVC Controller in controllers/sessions_controller.js 
 * 
 * This is server-side JavaScript, intended to be run with Express on NodeJS using MongoDB NoSQL Db for persistence.
 * 
 * @throws none
 * @see 
 * 
 * @author Bob Drummond
 * (C) 2012 PINK PELICAN NZ LTD
 */

module.exports = function(mongoose) {
  var validator = require('../../lib/validator'),  // my validation methods 
      Schema    = mongoose.Schema,
      Session;

  Session = new Schema({
    
    userName  :  {
      type     : String,
      default  : '',
      required : false
    },

    startDate  :  {
      type : Date,
      default  : new Date(),
      required : false
    },

    isAdmin  :  {
      type     : Boolean,
      default  : false,
      required : false
    },

    isRecorder :  {
      type     : Boolean,
      default  : false,
      required : false
    }

  });

/*
 * like - similar to SQL's like: case-insenstive search 
 */

  function like(query, field, val) {
    return (field) ? query.regex(field, new RegExp(val, 'i')) : query;
  }

/*
 * Session.search
 */
  Session.statics.search = function search(params, callback) {
    var Model = mongoose.model('Session'),
        query = Model.find();

    like(query, 'userName', params.sessionName);

    query.exec(callback);
  };

/*
 * Session.findById
 */
  Session.statics.findById = function findById(id, callback) {
    var Model = mongoose.model('Session'),
        query = Model.find();

    if (id.length !== 24) {   // a Mongo ObjectID is a 12-byte BSON type
      callback(null, null);
    } else {
      Model.findOne().where('_id', id).exec(callback);
    }
  };

  return mongoose.model('Session', Session);
}
