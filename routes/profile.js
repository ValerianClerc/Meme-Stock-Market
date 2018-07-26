var express = require('express');
var router = express.Router();
var User = require('../models/user'),
    Post = require('../models/post');


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


module.exports = router;
