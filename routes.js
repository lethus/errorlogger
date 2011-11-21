var models = require('./models.js');
var utils = require('./utils.js');
var email = require('mailer');

module.exports = function(app){
    app.get('/login/', function(req, res){
        res.render('login', {title: "Login"});
    });

    app.post('/login/', function(req, res) {
        utils.authenticate(
            models.UserModel,
            req.body.username,
            req.body.password,
            function(err, user){
                if (user) {
                    // Regenerate session when signing in
                    // to prevent fixation 
                    req.session.regenerate(function(){
                        // Store the user's primary key 
                        // in the session store to be retrieved,
                        // or in this case the entire user object
                        req.session.user = user;
                        res.redirect('back');
                    });
                } else {
                    req.session.error = 'Authentication failed, please check your '
                        + ' username and password.'
                        + ' (use "tj" and "foobar")';
                    res.redirect('back');
                }
            });
    });

    app.post('/post/', function(req, res){
        var instance = new models.ErrorModel()
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
};