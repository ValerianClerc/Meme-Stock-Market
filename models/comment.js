var mongoose = require('mongoose');
var multer = require('multer');
var User = require('./user');
var Post = require('./post');

// Comment schema

var commentSchema = new mongoose.Schema({
    timeStamp: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    post: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    },
    content: String
});

module.exports = mongoose.model("Comment", commentSchema);
