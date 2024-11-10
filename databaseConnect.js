// importing mongoose
const mongoose = require('mongoose')

// mongoDB link
const mongoURL = "mongodb://localhost:27017/notebook_DB"
//function to connect mongoDB
const connectToMongoose = ()=>{
    //mongoose.connect is used to build connection
    mongoose.connect(mongoURL)
}


//exporting function
module.exports = connectToMongoose;