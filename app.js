const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
// const address = require('address'); 
// const phone = require('phone');
const LocalStrategy = require('passport-local').Strategy;

//***************
// const order = require('ordermodel'); 
//****************** 
// const product = require('productmodel');


//Requiring user route
const userRoutes = require('./routes/users');
const searchRoutes = require('./routes/search');
const orderRoutes = require('./routes/orders');
const cartRoutes = require('./routes/cart');

//Requiring user model
const User = require('./models/usermodel');
//product model*************
const Product = require('./models/productmodel');
//order model**************
const Order = require('./models/ordermodel');





dotenv.config({path: './config.env'});

//connect to mongoDB
mongoose.connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true
});

//middleware for session
app.use(session({
    secret : 'login/sign up application.',
    resave : true,
    saveUninitialized : true
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({usernameField : 'email'}, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//middleware flash messages
app.use(flash());

//setting middlware globally
app.use((req, res, next)=> {
    res.locals.success_msg = req.flash(('success_msg'));
    res.locals.error_msg = req.flash(('error_msg'));
    res.locals.error = req.flash(('error'));
    res.locals.currentUser = req.user;
    res.locals.currentOrder = req.order;
    res.locals.currentProduct = req.product;
    next();
});

app.use(bodyParser.urlencoded({extended:true}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(express.json())
app.use(userRoutes);
app.use(searchRoutes);
app.use(orderRoutes);
app.use(cartRoutes);


app.listen(process.env.PORT, ()=> {
    console.log('Server is started');
});