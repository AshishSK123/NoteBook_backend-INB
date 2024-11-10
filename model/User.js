const mongoose = require('mongoose')
const { Schema } = mongoose;

//Schema is the systimatic way of presenting data to mongoDB
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
        // unique: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('user', UserSchema);