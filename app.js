var express     = require('express'),
    mongoose    = require('mongoose'),
    bodyParser  = require('body-parser'),
    Meme        = require('./models/meme')

    // var faker = require('faker');

var app = express();

// app set-up
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));

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

app.get('/signup', function (req, res) {
    res.render('signup');
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

app.listen(3000, function () {
    console.log('Server started on port 3000');
});
