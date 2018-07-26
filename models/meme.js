var mongoose = require('mongoose');
var multer = require('multer');
var User = require('./user');

// Meme schema

var memeSchema = new mongoose.Schema({
    title: String,
    timeStamp: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    imgPath: String
});

module.exports = mongoose.model("Meme", memeSchema);
