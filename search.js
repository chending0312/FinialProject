const express = require('express');
const routers = express.Router();
const passport = require('passport');
const address = require('address'); 
const phone = require('phone');
const crypto = require('crypto');
const async = require('async');
const title = require('title');
const food = require('food');
const book = require('book');

const nodemailer = require('nodemailer');

//***********************
const Product = require('../models/productmodel');


// Checks if user is authenticated
function isAuthenticatedUser(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Please Login first to access this page.')
    res.redirect('/login');
}


routers.get('/search', (req, res) =>{
    res.render('search');
})

routers.post('/search',  (req, res)=> {
    if(!req.body.title) {
        req.flash('error_msg', "cannot null, Type again!");
        return res.redirect('/homepage');
    }

    //  Product.findOne({name: req.body.title})
    //     .then(product => {
    //         product.findOne({"title": req.body.title}, err =>{
    //             res.redirect('/search'); 
    //     })
    // });
    // console.log(req.body.title)
    // Product.find({title: req.body.title})
    //     .then(product =>{
    //         product.find({"title": req.body.title})
    //     })
});

module.exports = routers;