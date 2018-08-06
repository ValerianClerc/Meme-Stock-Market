var express = require('express');
var router = express.Router();
var User = require('../models/user'),
    Post = require('../models/post');

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

router.get('/profile/:id', function (req, res) {
    console.log(req.params);
    User.findOne({username : req.params.id}, function (err, user) {
        if (err) {
            console.log(err);
        } else {
            console.log(user.posts);

            Post.find({'_id' : { $in: user.posts}}, function (err, foundPosts) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(foundPosts);
                    return res.render('profile', {user: user, posts : foundPosts});

                }

            });

        }
    });
});

router.put('/profile/changeOrder', isLoggedIn, function(req, res){
    User.findById(req.user._id, function(err, user) {
        if (err) {
            console.log(err);
        } else {
            user.sortBy = req.body.filter;
            user.save();
            res.redirect('back');
        }
    });
});


module.exports = router;
