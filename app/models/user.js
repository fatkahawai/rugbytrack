/**
 * user.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * server-side MVC MODEL definition for the Users class.
 * This module defines the MongoDB schema for the User class, validation of attributes, 
 * and some methods to search the collection for a specific user or users.
 * It is used by the users MVC Controller in controllers/users_controller.js 
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
      User;

  User = new Schema({
    
    userName  :  {
      type     : String,
      validate : [validator({
        isUserName : true,
        length: {
          min : 2,
          max : 100
        }
      }), 'userName'],
      required : true
    },
    
    password  :  {
      type     : String,
      validate : [validator({
        isPwd : true,
        length: {
          min : 0,
          max : 100
        }
      }), 'password'],
      default  : '',
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
    },
    
    fullName  :  {
      type     : String,
      validate : [validator({
        length: {
          min : 0,
          max : 100
        }
      }), 'fullName'],
      default  : '',
      required : false
    },
    
    email : {
      type     : String,
      validate : [validator({
        isEmail : true,
        length  : {
          min : 5,
          max : 100
        }
      }), 'email'],
      unique   : true,
      required : true
    },
    
    dateRegistered  :  {
      type : Date,
      validate : [validator({
        minAge : 0  // check its not a future date
      }), 'dateRegistered'],
      default  : new Date(),
      required : false
    },
    
    born  :  {
      type : Date,
      validate : [validator({
        minAge : 0
      }), 'born'],
      default  : '',
      required : false
    },
    
    country : {
      type     : String,
      validate : [validator({
        length: {
          min : 0,
          max : 100
        }
      }), 'country'],
      default  : '',
      required : false
    },

    city : {
      type     : String,
      validate : [validator({
        length: {
          min : 0,
          max : 100
        }
      }), 'city'],
      default  : '',
      required : false
    },

    timezone : {       // e.g. 'EST' or 'GMT+12'
      type     : String,
      validate : [validator({
        length: {
          min : 0,
          max : 100
        }
      }), 'timezone'],
      default  : '',
      required : false
    },

    homeTeam : {
      type     : String,
      validate : [validator({
        length: {
          min : 0,
          max : 100
        }
      }), 'homeTeam'],
      default  : '',
      required : false
    },

    favSecondTeam : {
      type     : String,
      validate : [validator({
        length: {
          min : 0,
          max : 100
        }
      }), 'favSecondTeam'],
      default  : '',
      required : false
    },

    facebookID : {
      type     : String,
      validate : [validator({
        length: {
          min : 0,
          max : 100
        }
      }), 'facebookID'],
      default  : '',
      required : false
    },
    
    facebookPwd  :  {
      type     : String,
      validate : [validator({
        length: {
          min : 0,
          max : 100
        }
      }), 'facebookPwd'],
      default  : '',
      required : false
    },
    
    twitterID : {
      type     : String,
      validate : [validator({
        length: {
          min : 0,
          max : 100
        }
      }), 'twitterID'],
      default  : '',
      required : false
    },
    
    twitterPwd  :  {
      type     : String,
      validate : [validator({
        length: {
          min : 0,
          max : 100
        }
      }), 'twitterPwd'],
      default  : '',
      required : false
    },
    
    googleID : {
      type     : String,
      validate : [validator({
        length: {
          min : 0,
          max : 100
        }
      }), 'googleID'],
      default  : '',
      required : false
    },
    
    googlePwd  :  {
      type     : String,
      validate : [validator({
        length: {
          min : 0,
          max : 100
        }
      }), 'googlePwd'],
      default  : '',
      required : false
    },
    
    
  });

/*
 * like - similar to SQL's like: case-insenstive search 
 */

  function like(query, field, val) {
    return (field) ? query.regex(field, new RegExp(val, 'i')) : query;
  }

/*
 * User.search
 */
  User.statics.search = function search(params, callback) {
    var Model = mongoose.model('User'),
        query = Model.find();

    like(query, 'userName', params.userName);
    like(query, 'fullName', params.fullName);
    like(query, 'email', params.email);

    query.exec(callback);
  };

/*
 * User.findById
 */
  User.statics.findById = function findById(id, callback) {
    var Model = mongoose.model('User'),
        query = Model.find();

    if (id.length !== 24) {   // a Mongo ObjectID is a 12-byte BSON type
      callback(null, null);
    } else {
      Model.findOne().where('_id', id).exec(callback);
    }
  };

  return mongoose.model('User', User);
}
