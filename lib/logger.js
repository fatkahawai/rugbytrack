/**
 * logger.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION: utility module for server-side logging 
 * 
 * @throws none
 * @see 
 * 
 * @author Bob Drummond
 * (C) 2012 PINK PELICAN NZ LTD
 */
var fs  = require('fs'),
    log = {},
    ENV = process.env.NODE_ENV || 'development',
    fileWriter, filePath,
    debugMode = false;

filePath = __dirname + '/../logs/' + ENV.toLowerCase() + '.log';

fileWriter = fs.createWriteStream(filePath, {
  flags: "a",
  encoding: "utf-8",
  mode: 0666
});

log.write = function(msg) {
  console.log(msg);
  fileWriter.write('\n-----\n' + msg.toString());
};

log.info = function(msg) {
  log.write("INFO :"+msg);
};

log.debug = function(msg) {
  if(this.debugMode){
    log.write("DEBUG: "+msg);
  }
};

log.debugOn = function(){
  this.debugMode = true;
  log.debug("Debug ON");
};

log.debugOff = function(){
  log.debug("Debug OFF");
  this.debugMode = false;
};

log.err = function(msg) {
  // testing purposes, ignore
  if (msg === 'test') { return false; }

  try {
    throw new Error(msg);
  }
  catch (err) {
    log.info(err.stack);
  }
};

log.testbed = function(msg) {
  log.write("TEST : "+msg);
};

module.exports = log;
