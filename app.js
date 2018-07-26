var express               = require('express'),
    mongoose              = require('mongoose'),
    bodyParser            = require('body-parser'),
    Post                  = require('./models/post'),
    User                  = require('./models/user')
    passport              = require('passport'),
    LocalStrategy         = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    fs                    = require('fs'),
    multer                = require('multer'),
    path                  = require('path');

// ROUTES
var postRoutes = require('./routes/posts'),
    profileRoutes = require('./routes/profile'),
    indexRoutes = require('./routes/index');

    // var faker = require('faker');

var app = express();



// app set-up
app.set('view engine', 'ejs');
app.use(require('express-session')({
    secret: 'Climbing is life',
    resave: false,
    saveUninitialized: false
}));
app.use(express.static(__dirname + '/public'));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended : true}));


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware to pass user into each route
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

// requiring routes
app.use(indexRoutes);
app.use('/posts', postRoutes);
app.use(profileRoutes);


// MongoDB set-up
mongoose.connect('mongodb://localhost:27017/beta-buddy', {useNewUrlParser:true});

app.listen(3000, function () {
    console.log('Server started on port 3000');
});
