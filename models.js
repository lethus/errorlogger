var mongoose = require('mongoose')
  , crypto = require('crypto');

function hash(msg, key) {
  return crypto.createHmac('sha256', key).update(msg).digest('hex');
}

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

mongoose.connect('mongodb://localhost/errorlogger');

var ErrorPost = new Schema({
    prefeitura     : { type: String, required: true }
    , erro      : { type: String, required: true }
    , date      : { type: Date, default: Date.now }
});

var User = new Schema({
    pk    : ObjectId
    , username     : String
    , password      : String
});

User.statics.authenticate = function (username, password, fn) {
    this.findOne({username: username}, function (err, user) {
        if (!user) return fn(new Error('cannot find user'));
        if (user.password == hash(password, 'lethus123')) return fn(null, user);
        // Otherwise password is invalid
        fn(new Error('invalid password'));
    });
}

User.statics.newUser = function (username, password, fn) {
    var instance = new UserModel();
    instance.username = username;
    instance.password = hash(password, 'lethus123');

    instance.save(function (err) {
        fn(err, instance);
    });
};

UserModel = mongoose.model('User', User);

exports.ErrorModel = mongoose.model('Error', ErrorPost);
exports.UserModel = UserModel
