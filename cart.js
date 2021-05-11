const express = require('express');
const routerc = express.Router();
const passport = require('passport');
const crypto = require('crypto');
const async = require('async');
const nodemailer = require('nodemailer');

//Requiring user model
const User = require('../models/usermodel');
//***********************
const Order = require('../models/ordermodel');
const Product = require('../models/productmodel');


// Checks if user is authenticated
function isAuthenticatedUser(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Please Login first to access this page.')
    res.redirect('/login');
}

routerc.get('/cart', isAuthenticatedUser, (req, res) =>{
    res.render('cart');
})

module.exports = routerc;

