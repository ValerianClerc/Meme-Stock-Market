var mongoose = require('mongoose');
var multer = require('multer');
var User = require('./user');
var Comment = require('./comment');


// Post schema

var postSchema = new mongoose.Schema({
    title: String,
    timeStamp: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    imgPath: String,
    description: String
});

module.exports = mongoose.model("Post", postSchema);
