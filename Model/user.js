const { types, required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
    // Username and password "Passport" will create automatically
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);