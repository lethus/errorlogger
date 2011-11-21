var models = require('../models');
var utils = require('../utils');
var UserModel = models.UserModel;

module.exports = function (app) {
    app.get('/users/', utils.restrict, function(req, res){
        UserModel.find({}, ['username'], function (err, users) {
            res.render('users/index', {title: "Usuários", users: users});
        });
    });
    app.get('/users/new/', utils.restrict, function(req, res){
        res.render('users/add', {title: "Adicionar Usuário"});
    });;

    app.post('/users/new/', utils.restrict, function(req, res){
        UserModel.newUser(req.body.username,
                                 req.body.password, function (err, user) {
                                     res.redirect('/users/');
                                 });
    });

    app.get('/users/delete/:id/', utils.restrict, function(req, res){
        UserModel.remove({_id: req.params.id}, function (err) {
            res.redirect('/users/');
        });
    });

     app.get('/login/', function(req, res){
        res.render('login', {title: "Login"});
    });

    app.get('/logout/', function(req, res){
        req.session.destroy(function(){
            res.redirect('/');
        });
    });

   
    app.post('/login/', function(req, res) {
        UserModel.authenticate(
            req.body.username,
            req.body.password,
            function (err, user) {
                if (user) {
                    req.session.regenerate(function(){
                        req.session.user = user;
                        res.redirect('/');
                    });
                } else {
                    if (!req.session.messages)
                        req.session.messages = [];
                    
                    req.session.messages.push('Authentication failed, please check your '
                                              + ' username and password.');
                    res.redirect('back');
                }
                console.info(err, user);
            });
    });

};