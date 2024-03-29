## What's this?

RugbyTrack is a single-page web application build with Backbone, RequireJS and Twitter Bootstrap on the frontend. 

The backend part of the application uses Express.js and the MongoDB NoSQL database and Mongoose (amongst other libraries).

its derived from the "ClientManager" project

server-side
-----------

NB I've installed these server side modules under Sites directory on Bob's WD Passport Drive
so copy the project files there to run the server from that disk. 

* node - async server framework using on Google Chrome V8 core
* express - server-side framework based on node. simplifies http server and RESTful apis
* underscore - util library
* MongoDB and mongoose library

client-side
-----------
* twitter-bootstrap - UI library
* backbone.js - client-side MVC framework
*  since Underscore.js is a hard dependency of Backbone.js, we decided to use Underscore's template() method as our client-side HTML partial rendering engine.
* jQuery - util library
* require.js
* Backbone.BootstrapModal Takes care of instantiation and opening/closing modals, and Removes the element from the DOM when closed


## Quick start

- Make sure Node.js and NPM should be installed (I prefer to do it using NVM). This project was developed on Node 0.6.x.
- Install project dependency modules on the server with NPM by running the following command in the terminal (project root):

    npm install xyz
    e.g. npm install express

- Configure the ports for the application (for multiple environments: dev, test, production) and also the settings for the MongoDB connection (you can either host MongoDB locally or try a free hosting provider such as MongoLab). The config data is in /config
- Start the server:

  a) Production

    npm start 

  b) Development (note that if you want to load all the files uncompressed you should visit http://<server>:<port>/dev.html)

    node app.js
    
    then open your browser and go to localhost:8080 which should display the rendered public website

## App structure

The application has a structure similar to Rails:

- the model and controller folders are within '/app'
- the configuration stored into json files in '/config'.
- public directory for the server: '/public'
- logs are kept into their own '/logs' folder, having one file per environment
- '/lib' is where application specific files reside
- all backend test files are inside '/test', structured into: unit tests ('/unit'), 
  functional tests ('/functional') and the fixtures
- the Jakefile: similar to make or rake, can run tasks

Frontend:

- the '/js' folder is where the 'magic' happens: '/main.js' is the starting point 
  (stores RequireJS configuration), which calls '/app' (that deals with the initialization 
  for the application), the rest of the foldes are self-explanatory
- '/css' and '/img' stores the static stylesheets and images needed
- '/test' has the logic for the test runner (with Mocha), and specs

## Dev gotchas with Jake (in the terminal)

Empty the database:

    jake db:empty

Populate database with data:
    
    jake db:populate[20]

That will empty db and insert 20 new records).

Compress & concatenate assets (one file for JS & one file for CSS):

    jake app:assets

## Testing

I've chosen Mocha for all tests in this project. To run test suite in the command line use the following command in the application root (make sure things are setup properly -> the app can connect to MongoDB, can bind to the specified port):

    npm test

If you're testing on Windows, run the following commands in the terminal: 

    npm install mocha@1.1.0 -g
    mocha --ui bdd --recursive --reporter spec --timeout 10000 --slow 300

The first command installs mocha globally and the second one runs the test suite.

For client side tests, open the browser 

    http://<server>:<port>/test

## Small JS styleguide for the project

- 2 spaces for indentation
- Semicolons should be used
- Line length should be 80 (that's a soft limit, 82-83 for example is ok provided these are just a few exceptions)
- Braces go on the same line as the statement
- Vars should always be declared at the top
- Variables and properties should use lower camel case capitalization

## Browser compatibility

I haven't had time to properly test the app, but it *should* work fine in modern browsers.

## TODO / Improvements:

Client-side:

- More tests

Server-side:

- Bug in IE => should send Dates using miliseconds instead of the toString() stuff
- Split contents of utils.js into multiple files (more specific categories)
- Implement content-negotiation (return 406 Not Acceptable where needed)
[this is present by default in Express 3.x, upgrade when it is stable enough]
- Implement authentication and check authorization when modifying resources (OAuth maybe?)
- Implement ETags properly for the /clients and /clients/:id GET routes

## Useful links that helped me while developing this app

- https://github.com/alessioalex/ClientManager
- http://backbonetutorials.com
- http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
- https://github.com/jrburke/requirejs/wiki/Upgrading-to-RequireJS-2.0
- http://addyosmani.github.com/backbone-fundamentals/
- http://addyosmani.github.com/backbone-aura/
- http://coenraets.org/directory/
- http://http://howtonode.org

