var mongoose = require('mongoose');
    passportLocalMongoose = require('passport-local-mongoose')
    Meme = require('./meme')

var userSchema = new mongoose.Schema({
    email: String,
    password: String,
    memes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meme'
    }]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
