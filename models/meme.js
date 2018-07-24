var mongoose = require('mongoose');

// Meme schema

var memeSchema = new mongoose.Schema({
    title: String,
    imgURL: String,
    timeStamp: String,
    author: String
});

module.exports = mongoose.model("Meme", memeSchema);
