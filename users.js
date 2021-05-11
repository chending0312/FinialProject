const express = require('express');
const router = express.Router();
const passport = require('passport');
const address = require('address'); 
const phone = require('phone');
const crypto = require('crypto');
const async = require('async');
const nodemailer = require('nodemailer');

//Requiring user model
const User = require('../models/usermodel');


// Checks if user is authenticated
function isAuthenticatedUser(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Please Login first to access this page.')
    res.redirect('/login');
}


//Get routes
router.get('/login', (req,res)=> {
    res.render('login');
});

router.get('/changeinf', isAuthenticatedUser, (req,res)=> {
    res.render('changeinf');
});

router.get('/signup', (req,res)=> {
    res.render('signup');
});

router.get('/homepage', isAuthenticatedUser,(req,res)=> {
    res.render('homepage');
});

router.get('/changepassword', isAuthenticatedUser, (req, res) =>{
    res.render('changepassword');
})

router.get('/forgot', (req, res) =>{
    res.render('forgot');
})

// router.get('/orders', isAuthenticatedUser, (req, res) =>{
//     res.render('orders');
// })

// router.get('/search',isAuthenticatedUser, (req, res) =>{
//     res.render('search');
// })

// router.get('/cart',isAuthenticatedUser, (req, res) =>{
//     res.render('cart');
// })

// router.post('/search',  (req, res)=> {
//     if(!req.body.title) {
//         req.flash('error_msg', "cannot null, Type again!");
//         return res.redirect('/homepage');
//     }

    // User.findOne({email : req.user.email})
    //     .then(user => {
    //         user.update({$set: {"address": req.body.address, "phone": req.body.phone}}, err =>{
    //             user.save()
    //                 .then(user => {
    //                     res.redirect('/homepage');
    //                 })
    //                 .catch(err => {
    //                     req.flash('error_msg', 'ERROR: '+err);
    //                     res.redirect('/changeinf');
    //                 })
    //     })
    // });
// });



// router.get('/getfood',isAuthenticatedUser, (req, res) =>{
//     res.render('getfood');
// })

// router.get('/getbook',isAuthenticatedUser, (req, res) =>{
//     res.render('getbook');
// })












//POST routes
router.post('/login', passport.authenticate('local', {
    successRedirect : '/homepage',
    failureRedirect : '/login',
    failureFlash: 'Invalid email or password. Try Again!!!'
}));


router.post('/signup', (req, res)=> {
    let {name, email, password} = req.body;

    let userData = {
        name : name,
        email :email
    };

    User.register(userData, password, (err, user)=> {
        if(err) {
            req.flash('error_msg', 'ERROR: '+err);
            res.redirect('/signup');
        }
        passport.authenticate('local') (req, res, ()=> {
            req.flash('success_msg', 'Account created successfully');
            res.redirect('/login');
        });
    });

});

router.get('/logout', isAuthenticatedUser,(req, res)=> {
    req.logOut();
    req.flash('success_msg', 'You have been logged out.');
    res.redirect('/login');
});


router.get('/reset/:token', (req, res)=> {
    User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires : {$gt : Date.now() } })
        .then(user => {
            if(!user) {
                req.flash('error_msg', 'Password reset token in invalid or has been expired.');
                res.redirect('/forgot');
            }

            res.render('newpassword', {token : req.params.token});
        })
        .catch(err => {
            req.flash('error_msg', 'ERROR: '+err);
            res.redirect('/forgot');
        });
});

router.post('/password/change', (req, res)=> {
    if(req.body.password !== req.body.confirmpassword) {
        req.flash('error_msg', "Password don't match. Type again!");
        return res.redirect('/password/change');
    }

    User.findOne({email : req.user.email})
        .then(user => {
            user.setPassword(req.body.password, err=>{
                user.save()
                    .then(user => {
                        res.redirect('/homepage');
                    })
                    .catch(err => {
                        req.flash('error_msg', 'ERROR: '+err);
                        res.redirect('/password/change');
                    });
            });
        });
});


//to save information
router.post('/changeinf',  (req, res)=> {
    if(!req.body.address) {
        req.flash('error_msg', "cannot null, Type again!");
        return res.redirect('/changeinf');
    }

    User.findOne({email : req.user.email})
        .then(user => {
            user.update({$set: {"address": req.body.address, "phone": req.body.phone}}, err =>{
                user.save()
                    .then(user => {
                        res.redirect('/homepage');
                    })
                    .catch(err => {
                        req.flash('error_msg', 'ERROR: '+err);
                        res.redirect('/changeinf');
                    })
        })
    });
});

// Routes to handle forgot password
router.post('/forgot', (req, res, next)=> {
    let recoveryPassword = '';
    async.waterfall([
        (done) => {
            crypto.randomBytes(20, (err , buf) => {
                let token = buf.toString('hex');
                done(err, token);
            });
        },
        (token, done) => {
            User.findOne({email : req.body.email})
                .then(user => {
                    if(!user) {
                        req.flash('error_msg', 'User does not exist with this email.');
                        return res.redirect('/forgot');
                    }

                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 1800000; //   1/2 hours

                    user.save(err => {
                        done(err, token, user);
                    });
                })
                .catch(err => {
                    req.flash('error_msg', 'ERROR: '+err);
                    res.redirect('/forgot');
                })
        },
        (token, user) => {
            let smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user : process.env.GMAIL_EMAIL,
                    pass: process.env.GMAIL_PASSWORD
                }
            });

            let mailOptions = {
                to: user.email,
                from : 'chen@gmail,com',
                subject : 'Recovery Email from Auth Project',
                text : 'Please click the following link to recover your passoword: \n\n'+
                        'http://'+ req.headers.host +'/reset/'+token+'\n\n'+
                        'If you did not request this, please ignore this email.'
            };
            smtpTransport.sendMail(mailOptions, err=> {
                req.flash('success_msg', 'Email send with further instructions. Please check that.');
                res.redirect('/forgot');
            });
        }

    ], err => {
        if(err) res.redirect('/forgot');
    });
});

router.post('/reset/:token', (req, res)=>{
    async.waterfall([
        (done) => {
            User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires : {$gt : Date.now() } })
                .then(user => {
                    if(!user) {
                        req.flash('error_msg', 'Password reset token in invalid or has been expired.');
                        res.redirect('/forgot');
                    }

                    if(req.body.password !== req.body.confirmpassword) {
                        req.flash('error_msg', "Password don't match.");
                        return res.redirect('/forgot');
                    }

                    user.setPassword(req.body.password, err => {
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;

                        user.save(err => {
                            req.logIn(user, err => {
                                done(err, user);
                            })
                        });
                    });
                })
                .catch(err => {
                    req.flash('error_msg', 'ERROR: '+err);
                    res.redirect('/forgot');
                });
        },
        (user) => {
            let smtpTransport = nodemailer.createTransport({
                service : 'Gmail',
                auth:{
                    user : process.env.GMAIL_EMAIL,
                    pass : process.env.GMAIL_PASSWORD
                }
            });

            let mailOptions = {
                to : user.email,
                from : 'chen@gmail.com',
                subject : 'Your password is changed',
                text: 'Hello, '+user.name+'\n\n'+
                      'This is the confirmation that the password for your account '+ user.email+' has been changed.'
            };

            smtpTransport.sendMail(mailOptions, err=>{
                req.flash('success_msg', 'Your password has been changed successfully.');
                res.redirect('/login');
            });
        }

    ], err => {
        res.redirect('/login');
    });
});



module.exports = router;