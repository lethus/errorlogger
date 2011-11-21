var models = require('../models');
var utils = require('../utils');
var ErrorModel = models.ErrorModel;
var email = require("mailer");

module.exports = function (app) {
    app.get('/errors/', utils.restrict, function(req, res){
        ErrorModel.find({}, ['prefeitura', 'date'], function (err, errors) {
            res.render('errors/index', {title: "Erros", errors: errors});
        });
    });
    app.get('/errors/:id/', utils.restrict, function(req, res){
        ErrorModel.findById(req.params.id, function (e, error) {
            res.render('errors/detail', {title: "Usuários",
                                         error: error});
        });
    });

    app.get('/errors/delete/:id/', utils.restrict, function(req, res){
        ErrorModel.remove({_id: req.params.id}, function (e, error) {
            res.redirect('/errors/');
        });
    });

    app.post('/errors/post/', function(req, res){
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
                body : "Detalhes em /errors/"+instance.id+'/'
            }, function(err, result){
                if(err){ console.log(err); }
            });

        });
        
        res.send({ok: true})
    });
};