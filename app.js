
/**
 * Module dependencies.
 */

var express = require('express');
var mongoose = require('mongoose');
var email = require('mailer');

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
        if(err){ console.log(err); }
        
        console.info(this.pk);
        email.send({
            host: "smtp.gmail.com",
            port : "587",
            //ssl: true, 
            domain: "smtp.gmail.com",
            authentication: "login",
            username: "projetos@lethus.com.br",
            password: "Lethus725",
            to : "projetos@lethus.com.br",
            from : "projetos@lethus.com.br",
            subject : "Erro ocorrido em " + req.body.prefeitura,
            body : "Detalhes em /"+instance.pk
        }, function(err, result){
            if(err){ console.log(err); }
        });

    });

    res.render('index', {
        title: 'Express'
    });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
