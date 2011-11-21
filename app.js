
/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express.createServer(
    express.bodyParser()
  , express.cookieParser()
  , express.session({ secret: 'lethus123' })
);

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.dynamicHelpers({
  messages: function(req){
      return req.session.messages;
  }
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
require('./routes.js')(app);

if (!module.parent) {
    app.listen(3000);
    console.log('Express started on port 3000');
}

