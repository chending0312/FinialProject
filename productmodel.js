const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

let productScheme = new mongoose.Schema({
    id:{type: String},
    image:{type: String},
    name:{type: String},
    price:{type: String},
    detail:{type: String},
    local:{type: String}
});

// productScheme.plugin(passportLocalMongoose, {usernameField : 'email'})
module.exports = mongoose.model('Product', productScheme);