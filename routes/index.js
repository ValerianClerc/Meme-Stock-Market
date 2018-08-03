var express = require('express');
var router = express.Router();
var User = require('../models/user'),
    passport = require('passport');

//MIDDLEWARE

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}



// ROUTES

router.get('/', function (req, res) {
    res.render('index');
});

router.get('/about', function (req, res) {
    res.render('about');
});

router.get('/FAQ', function (req, res) {
    res.render('FAQ');
});

router.get('/guide', function (req, res) {
    res.render('guide');
});

// Login routes
router.get('/login', function (req, res) {
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}), function (req, res) {
});

// Sign-up routes
router.get('/signup', function (req, res) {
    res.render('signup', {err : undefined});
});

router.post('/signup', function (req, res) {
    User.register(new User({
        username: req.body.username,
        email: req.body.email,
        posts: [],
        sortBy: "top"
    }),
        req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render('signup', {err : err});
        }
        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

// Logout
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});


// just to check auth
router.get('/secret', isLoggedIn, function (req, res) {
    res.send('SECRET');
});



module.exports = router;
