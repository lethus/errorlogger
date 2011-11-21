var models = require('./models.js');
var utils = require('./utils.js');
var email = require('mailer');

module.exports = function(app){
    require('./controllers/users')(app);
    require('./controllers/errors')(app);
    app.get('/', utils.restrict,  function(req, res){
        res.render('index', {title:"Página inicial"});
    });

   
/*
    */
};