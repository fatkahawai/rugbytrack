/**
 * user.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * MVC model definition for the Users class.
 * This module defines the MongoDB schema for the User class, and some methods to search the collection
 * for a specific user or users.
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
  var validator = require('../../lib/validator'),
      Schema    = mongoose.Schema,
      User;

  User = new Schema({
    name  :  {
      type     : String,
      validate : [validator({
        length: {
          min : 2,
          max : 100
        }
      }), "name"],
      required : true
    },
    email : {
      type     : String,
      validate : [validator({
        isEmail : true,
        length  : {
          min : 7,
          max : 100
        }
      }), "email"],
      unique   : true,
      required : true
    },
    born  :  {
      type : Date,
      validate : [validator({
        minAge : 18
      }), "born"],
      required : true
    },
    googleID : {
      type     : String,
      validate : [validator({
        length: {
          min : 5,
          max : 100
        }
      }), "googleID"],
      required : false
    }
  });

/*
 * like - similar to SQL's like
 */

  function like(query, field, val) {
    return (field) ? query.regex(field, new RegExp(val, 'i')) : query;
  }

/*
 * User.statics.search
 */
  User.statics.search = function search(params, callback) {
    var Model = mongoose.model('User'),
        query = Model.find();

    like(query, 'name', params.name);
    like(query, 'email', params.email);

    query.exec(callback);
  };

/*
 * User.statics.findById
 */
  User.statics.findById = function findById(id, callback) {
    var Model = mongoose.model('User'),
        query = Model.find();

    if (id.length !== 24) {
      callback(null, null);
    } else {
      Model.findOne().where('_id', id).exec(callback);
    }
  };

  return mongoose.model('User', User);
}
