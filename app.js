var express               = require('express'),
    mongoose              = require('mongoose'),
    bodyParser            = require('body-parser'),
    Meme                  = require('./models/meme'),
    User                  = require('./models/user')
    passport              = require('passport'),
    LocalStrategy         = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    fs                    = require('fs'),
    multer                = require('multer'),
    path                  = require('path');

    // var faker = require('faker');

var app = express();

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
}).single('newMeme');

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

// app set-up
app.set('view engine', 'ejs');
app.use(require('express-session')({
    secret: 'Memes are better than money',
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

// MongoDB set-up
mongoose.connect('mongodb://localhost:27017/meme-stock-market', {useNewUrlParser:true});


// Meme.create({
//     title: faker.commerce.productName(),
//     imgURL: faker.image.avatar(),
//     timeStamp: faker.date.past(),
//     author: faker.internet.userName()
// }, function (err, meme){
//     console.log(meme);
// });

//MIDDLEWARE

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// ROUTES

app.get('/', function (req, res) {
    res.render('index');
});

app.get('/about', function (req, res) {
    res.render('about');
});

app.get('/FAQ', function (req, res) {
    res.render('FAQ');
});

app.get('/guide', function (req, res) {
    res.render('guide');
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}), function (req, res) {
});

app.get('/signup', function (req, res) {
    res.render('signup', {err : undefined});
});

app.post('/signup', function (req, res) {
    User.register(new User({username: req.body.username, email: req.body.email}), req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render('signup', {err : err});
        }
        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
})

app.get('/secret', isLoggedIn, function (req, res) {
    res.send('SECRET');
});

app.get('/memes', function (req, res) {
    Meme.find({}, function (err, memes) {
        if (err) {
            console.log(err);
        } else {
            res.render('memes', {memes: memes});
        }
    });
});

app.get('/memes/new', isLoggedIn, function (req, res) {
    res.render('newMeme');
});

app.post('/memes', function (req, res) {
    upload(req, res, (err) => {
        if (err) {
            res.render('newMeme', {msg : err});
        } else {
            if(req.file == undefined) {
                res.render('newMeme', {msg: 'Error: No file selected'});
            }
            Meme.create({
                title: req.body.title,
                timeStamp: Date.now(),
                // author: ,
                imgPath: '/uploads' + '/' + req.file.filename
            }, function (err, meme) {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect('/memes');
                }
            });
        }
    });
});

app.listen(3000, function () {
    console.log('Server started on port 3000');
});
