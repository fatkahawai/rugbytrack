/**
 * validator.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION: utility module for server-side validatation of parameters. Used by the MODEL modules
 * 
 * @throws none
 * @see 
 * 
 * @author Bob Drummond
 * (C) 2012 PINK PELICAN NZ LTD
 */

var moment = require("moment"),
    log    = require("./logger"),
    _      = require("underscore");

module.exports = function(opts) {   // opts is an object with any parameters relevant to the test
  return function(val) {            // val is the value you are testing 
    var born;

    if (val == undefined) { 
      log.debug("validator.js: undefined value argument passed. returning false.");
      return false; 
      }

    // validate email addresses
    if (opts.isEmail && !(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(val))) {
      log.info("validator.js: email test failed for "+val);
      return false;
    }

    // validate length of a parameter string is between a min and max value
    if (opts.length && opts.length.min && opts.length.min !== 0 && opts.length.max) {
      if (val.length < opts.length.min || val.length > opts.length.max) { 
        log.info("validator.js: string length test failed for "+val);
        return false; 
      }
    }

    // validate a user"s age against a minimum age of 18
    if (opts.minAge) {
      born = moment(val); // create a 'moment' lib version of a Date object
      // calculate the duration between the current time and the date passed
      if (moment.duration(moment().diff(born)).years() < 18) {
        log.info("validator.js: minAge test failed for "+val);
        return false;
      }
    }

    //
    // TODO: add my  common general validations here
    //

    // validate a parameter integer is between a min and max value
    if (opts.range && opts.range.min && opts.range.min !== 0 && opts.range.max) {
      if (val.range < opts.range.min || val.range > opts.range.max) { 
        log.info("validator.js: range test failed for "+val);
        return false; 
      }
    }

    // validate User IDs
    if (opts.isUserName && !(/^[a-zA-Z0-9]+$/.test(val))) {
      log.info("validator.js: isUserName test failed for "+val);
      return false;
    }

    // validate Event Types are only letters, numbers, or punc
    if (opts.isEventType && !(/^[a-zA-Z0-9,-=.\/]$/.test(val))) {
      log.info("validator.js: isEventType test failed for "+val);
      return false;
    }

    // validate Event Parameters are only letters, numbers, or punc
    if (opts.isEventParam && !(/^[a-zA-Z0-9,-=.\/]$/.test(val))) {
      log.info("validator.js: isEventParam test failed for "+val);
      return false;
    }

    // validate Passwords
    if (opts.isPassword && !(/^[a-zA-Z0-9]+$/.test(val))) {
      log.info("validator.js: isPassword test failed for "+val);
      return false;
    }

    // validate field position coordinates
    if (opts.isPositionCoord && !(/^[0-9]+$/.test(val))) {
      log.info("validator.js: isPositionCoord test failed for "+val);
      return false;
    }

    // validate Twitter Hast Tags
    if (opts.isTwitterhashTag && !(/^#[a-zA-Z0-9]+$/.test(val))) {
      log.info("validator.js: twitterHashTag test failed for "+val);
      return false;
    }

    return true;
  };
};
