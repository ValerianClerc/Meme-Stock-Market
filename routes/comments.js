var express = require('express');
var router = express.Router({mergeParams: true});
var User = require('../models/user'),
    Post = require('../models/post'),
    Comment = require('../models/comment'),
    methodOverride = require('method-override'),
    bodyParser =     require('body-parser');

//MIDDLEWARE

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// route to post 'new comment' form
router.post('/', isLoggedIn, function (req, res) {
    var comment = new Comment({
        timeStamp: new Date().toISOString(),
        author: {
            id: req.user._id,
            username: req.user.username
        },
        content: req.body.content
    });
    Post.findOne({_id: req.params.id}, function (err, post) {
        if (err) {
            console.log(err);
        } else {
            console.log(post.comments);
            console.log(comment._id);
            comment.post.id = post._id;
            post.comments.push(comment._id);
            console.log(post.comments);
            User.findOne({_id: post.author.id}, function (err, user) {
                if(err) {
                    console.log(err);
                } else {
                    user.comments.push(comment._id);
                    comment.save();
                    post.save();
                    user.save();
                    res.redirect('/');
                }
            });
        }
    });
});

// Delete request for comment
router.delete('/:id', isLoggedIn, function (req, res) {

});


module.exports = router;
