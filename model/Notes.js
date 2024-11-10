const mongoose = require('mongoose')

const NotesSchema = new mongoose.Schema({
    // user is a foregin key used to link notes data with user data using user_id
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    tag: {
        type: String,
        required: true
    },
    date: {
        type: Date  ,
        default: Date.now
    }
});

module.exports = mongoose.model('notes', NotesSchema);