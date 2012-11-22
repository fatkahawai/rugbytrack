/**
 * validator.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION: utility module for server-side validatation of parameters 
 * 
 * @throws none
 * @see 
 * 
 * @author Bob Drummond
 * (C) 2012 PINK PELICAN NZ LTD
 */

var moment = require('moment'),
    _      = require('underscore');

module.exports = function(opts) {
  return function(val) {
    var born;

    if (!val) { return false; }
    
    // validate email addresses
    if (opts.isEmail && !(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(val))) {
      return false;
    }
    
    // validate a parameter is between a min and max value
    if (opts.length && opts.length.min && opts.length.min !== 0 && opts.length.max) {
      if (val.length < opts.length.min || val.length > opts.length.max) { return false; }
    }
    
    // validate a user's age against a minimum age of 18
    if (opts.minAge) {
      born = moment(val);
      // calculate the duration between the current time and the date passed
      if (moment.duration(moment().diff(born)).years() < 18) {
        return false;
      }
    }
    
    // TODO: add any other validations here
    
    
    return true;
  };
};
