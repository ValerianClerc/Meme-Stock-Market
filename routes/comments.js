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

function checkCommentOwnership(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.commentId, function (err, foundComment) {
            if(err) {
                console.log(err);
            } else {
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect('/posts/' + foundComment.post._id);
                }
            }
        });
    } else {
        res.redirect('/login');
    }
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
            comment.post.id = post._id;
            post.comments.push(comment._id);
            User.findOne({_id: comment.author.id}, function (err, user) {
                if(err) {
                    console.log(err);
                } else {
                    user.comments.push(comment._id);
                    comment.save();
                    post.save();
                    user.save();
                    res.redirect('/posts/' + req.params.id);
                }
            });
        }
    });
});

router.get('/:commentId/edit', checkCommentOwnership, function (req, res) {
    Comment.findOne({_id : req.params.commentId}, function (err, comment) {
        Post.findOne({_id : comment.post.id}, function (err, post) {
            res.render('editComment', {comment : comment, post: post});
        });
    });
});

router.put('/:commentId', checkCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function (err, comment) {
        res.redirect('/posts/' + req.params.id);
    });
});

// Delete request for comment
router.delete('/:commentId', checkCommentOwnership, function (req, res) {
    // insert error handling
    Post.findOne({'_id' : req.params.id}, function (err, post) {
        if (err) {
            console.log(err);
        } else {
            Comment.findOne({'_id' : req.params.commentId}, function (err, comment) {
                User.findOne({'_id': comment.author.id}, function (err, user) {
                    if (err) {
                        console.log(err);
                    } else {
                        var index = user.comments.indexOf(comment._id);
                        if (index > -1) {
                            user.comments.splice(index, 1);
                        }
                        index = post.comments.indexOf(comment._id);
                        if (index > -1) {
                            post.comments.splice(index, 1);
                        }
                        user.save();
                        post.save();
                        // removing post from DB
                        comment.remove();
                        res.redirect('/posts/'+ post._id);
                    }
                });
            });
        }
    });
});


module.exports = router;
