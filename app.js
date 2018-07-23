var express     = require('express'),
    mongoose    = require('mongoose'),
    bodyParser  = require('body-parser')

var app = express();

// app set-up
app.use(express.static('public/css'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));

// MongoDB set-up
mongoose.connect('mongodb://localhost:27017/blog-app', {useNewUrlParser:true});
