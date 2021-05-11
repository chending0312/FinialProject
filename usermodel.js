const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

let userScheme = new mongoose.Schema({
    name : {type: String},
    email : {type: String, unique: true},
    password : {
        type : String,
        select : false
    },
    address:{type: String},
    phone:{type: String},
    resetPasswordToken : {type: String},
    resetPasswordExpires : {type: Date}
});

userScheme.plugin(passportLocalMongoose, {usernameField : 'email'});
module.exports = mongoose.model('User', userScheme);