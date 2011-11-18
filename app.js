
/**
 * Module dependencies.
 */

var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;
var app = module.exports = express.createServer();

// Configuration

mongoose.connect('mongodb://localhost/errorlogger');

var ErrorPost = new Schema({
    pk    : ObjectId
    , prefeitura     : String
    , erro      : String
    , date      : { type: Date, default: Date.now }
});

var ErrorModel = mongoose.model('Error', ErrorPost);

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.post('/post/', function(req, res){
    var instance = new ErrorModel()
    instance.prefeitura = req.body.prefeitura;
    instance.erro = req.body.erro;
    instance.save(function (err) {
        console.info(err);
    });
    res.render('index', {
        title: 'Express'
    });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
