/**
* @author Bob Drummond
* 
* MYASSERT.JS
* 
* @version 1.0
* @see
* @throws none
* 
* INTEGRATING THE MODULE 
* include <script src="js/utils/assert.js"></script> in your html file
* include "var debug = utils.assert;" in your .js file and call assert.ok (or call utils.assert.ok() directly)
* 
* USE 
  assert.ok( condition, errorMsg ) 

* (c) 2012 Pink Pelican Ltd 
*/

// set up namespace as utils.assert
var myassert;                  // this is my parent module
if (!myassert){ 
  myassert = {};     // if it wasn't already created by loading another module in utils, create a utils object
}

// namespace envelope function to restrict scope of debug attributes 
// see at the end of the namespace function definition, where we export the public interface of the debug module
//
(function namespace() {

"use strict"; //can"t use strict mode else accessing function name and args will throw exception

var isEnabled        = false;

var displayInWindow  = false;   // default settings
var displayInConsole = true;
var displayInAlert   = false;

var outputElement = document.getElementById("assert-output"); // find the <ul> element marked "#assert-output"

/* 
 * assert method.
 * 
 * @param Boolean condition -  the condition to test for thuthy 
 * @param string errorMsg   -  the message to log if condition is not true
 *
 * @return Boolean result of test
 */
function ok(
               condition,   
               errorMsg){
  var msg = "Assert FAILED: "+errorMsg;

  if ( isEnabled ) {
    if ( displayInWindow )
    {
      var li = document.createElement("li");  
      li.className = condition ? "pass" : "fail";  
      li.appendChild( document.createTextNode( msg ) );  
      outputElement.appendChild(li);  
    }

    if( !condition ) // failed
    {
      if (displayInConsole){
        console.log(msg);
      }
      if ( displayInAlert ){    
         alert(msg);
      }
    } // if fail
  }
};

/*
 * Getters and setters
 */
function enable( ) {
  isEnabled = true;
  return true;
};

function disable( ) {
  isEnabled = false;
  return false;
};

function setDisplayInWindow( val ) {
  if (val){
    displayInWindow = true;
    isEnabled = true;
  }
  else
    displayInWindow = false;
  return displayInWindow;
};

function setDisplayInConsole( val ) {
  if (val){
    displayInConsole = true;
    isEnabled = true;
  }
  else
    displayInConsole = false;
  return displayInConsole;
};

function setDisplayInAlert( val ) {
  if (val){
    displayInAlert = true;
    isEnabled = true;
  }
  else
    displayInAlert = false;
  return displayInAlert;
};


  // Export module interface ************
  myassert.ok                  = ok;
  myassert.enable              = enable;
  myassert.disable             = disable;
  myassert.setDisplayInWindow  = setDisplayInWindow;
  myassert.setDisplayInConsole = setDisplayInConsole;
  myassert.setDisplayInAlert   = setDisplayInAlert;
  // ************************************

}()); // namespace termination
