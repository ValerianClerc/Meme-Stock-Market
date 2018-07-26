var express = require('express');
var router = express.Router();
var User = require('../models/user'),
    Post = require('../models/post'),
    multer = require('multer'),
    methodOverride = require('method-override'),
    fs                    = require('fs'),
    bodyParser =     require('body-parser');

//MIDDLEWARE

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// img upload storage engine
var storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});


// img init upload
var upload = multer({
    storage: storage,
    limits: {fileSize: 1000000},
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('newPost');


function checkFileType (file, cb) {
    // Allowed extensions
    var filetypes = /jpeg|jpg|png|gif/;
    // check extensions
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // check mime type
    var mimetype = filetypes.test(file.mimetype);
    if (extname && extname) {
        return cb(null, true);
    }
    cb('Error: Images only');
}

// Posts view
router.get('/', function (req, res) {
    Post.find({}, function (err, posts) {
        if (err) {
            console.log(err);
        } else {
            res.render('posts', {posts: posts});
        }
    });
});

// route to get to 'new post' form
router.get('/new', isLoggedIn, function (req, res) {
    res.render('newPost');
});

// route to post 'new post' form
router.post('/', isLoggedIn, function (req, res) {
    upload(req, res, (err) => {
        if (err) {
            res.render('newPost', {msg : err});
        } else {
            if(req.file == undefined) {
                return res.render('newPost', {msg: 'Error: No file selected'});
            }
            Post.create({
                title: req.body.title,
                timeStamp: Date.now(),
                author: {
                    id: req.user._id,
                    username: req.user.username
                },
                imgPath: '/uploads' + '/' + req.file.filename,
                description: req.body.description
            }, function (err, post) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(post);
                    User.findOne({username : req.user.username}, function (err, foundUser) {
                        if (err) {
                            console.log(err);
                        } else {
                            foundUser.posts.push(post._id);
                            foundUser.save();
                            res.redirect('/posts/' + post._id);
                        }
                    });
                }
            });
        }
    });
});

// Accessing specific post
router.get('/:id', function (req, res) {
    Post.findOne({_id : req.params.id}, function (err, post) {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.render('specificPost', {post : post, currentUser : req.user});
        }
    });
});

// Accessing edit form
router.get('/:id/edit', isLoggedIn, function (req, res) {
    Post.findOne({_id : req.params.id}, function (err, post) {
        if (err) {
            console.log(err);
        } else {
            User.findOne({_id : post.author.id}, function (err, user) {
                if (err) {
                    console.log(err);
                } else {
                    if (req.user.username == user.username){
                        res.render('editPost', {post : post, user : user});
                    } else {
                        res.render('specificPost', {post : post, user : user, msg : 'SORRY, YOU CAN\'T EDIT A POST THAT ISN\'T YOURS'})
                    }
                }
            });
        }
    });
});

// Put request for editing post
router.put('/:id', isLoggedIn, function (req, res) {
    Post.findByIdAndUpdate(req.params.id, req.body.post, function (err, post) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/posts/' + req.params.id);
        }
    })
});

// Delete request for post
router.delete('/:id', isLoggedIn, function (req, res) {
    Post.findOne({'_id' : req.params.id}, function (err, post) {
        if (post.author.username == req.user.username) {
            // removing image from storage
            var delPath = __dirname + post.imgPath;
            delPath = delPath.replace('routes', 'public');
            fs.unlink(delPath, function (err) {
                if (err) {
                    console.log(err);
                    throw err;
                } else {
                    console.log('WORKED!');
                    // removing post from DB
                    post.remove();
                    res.redirect('/posts');
                }
            })

        } else {
            return res.redirect('/posts');
        }
    });
});


module.exports = router;
