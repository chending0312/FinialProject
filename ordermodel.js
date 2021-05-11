const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

let orderScheme = new mongoose.Schema({
    name : {type: String},
    orderDate : {type: Date},
    total : {type: String},
    orderNumber: {type: String},
});

orderScheme.plugin(passportLocalMongoose, {usernameField : 'email'});
module.exports = mongoose.model('order', orderScheme);

// module.exports = { getModel: function(type){
//     return _getModel(type);
// }}

// var _getModel = function(type){
//     return mongoose.model(type);
// };