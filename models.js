var mongoose = require('mongoose');
var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;
mongoose.connect('mongodb://localhost/errorlogger');

var ErrorPost = new Schema({
    pk    : ObjectId
    , prefeitura     : String
    , erro      : String
    , date      : { type: Date, default: Date.now }
});

var User = new Schema({
    pk    : ObjectId
    , username     : String
    , password      : String
});

exports.ErrorModel = mongoose.model('Error', ErrorPost);
exports.UserModel = mongoose.model('User', User);
