var mongoose = require('mongoose');
var multer = require('multer');

// Meme schema

var memeSchema = new mongoose.Schema({
    title: String,
    timeStamp: String,
    author: String,
    imgPath: String
});

module.exports = mongoose.model("Meme", memeSchema);
