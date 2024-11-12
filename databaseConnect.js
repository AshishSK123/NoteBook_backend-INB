// importing mongoose
const mongoose = require('mongoose')

// mongoDB link
const mongoURL = "mongodb+srv://ashishskharat18:Ashishsk%4018@notebookapp.h9yir.mongodb.net/Notebook_DB"
//function to connect mongoDB
const connectToMongoose = ()=>{
    //mongoose.connect is used to build connection
    mongoose.connect(mongoURL)
}


//exporting function
module.exports = connectToMongoose;