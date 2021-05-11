const express = require('express');
const routero = express.Router();
const passport = require('passport');
const address = require('address'); 
const phone = require('phone');
const crypto = require('crypto');
const async = require('async');
const nodemailer = require('nodemailer');

//***********************
const Order = require('../models/ordermodel');


// Checks if user is authenticated
function isAuthenticatedUser(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Please Login first to access this page.')
    res.redirect('/login');
}

routero.get('/orders', isAuthenticatedUser, (req, res) =>{
    res.render('orders');
})


module.exports = routero;