var express = require('express');
var router = express.Router();
var User = require('../models/user'),
    Post = require('../models/post'),
    multer = require('multer');
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

// Posts new
router.get('/new', isLoggedIn, function (req, res) {
    res.render('newPost');
});

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
                            console.log(foundUser);
                            console.log(foundUser.posts);
                            console.log('Post ID: ' + post._id)
                            foundUser.posts.push(post._id);
                            console.log(foundUser.posts);
                            foundUser.save();
                            res.redirect('/posts');
                        }
                    });
                }
            });
        }
    });
});

router.get('/:id', function (req, res) {
    Post.findOne({_id : req.params.id}, function (err, post) {
        if (err) {
            console.log(err);
        } else {
            console.log(post);
            res.render('specificPost', {post : post});
        }
    });
});


module.exports = router;
