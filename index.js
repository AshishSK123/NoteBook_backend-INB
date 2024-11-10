const connectToMongoose = require('./databaseConnect')
const express = require('express')
const cors = require('cors')

connectToMongoose();

const app = express()
const port = 5000

// to use request.body 
app.use(express.json())
app.use(cors())


//sends response to the site to display at given endpoint eg:'/api/login'
app.use('/api/login', require('./routes/login'))
app.use('/api/Notes', require('./routes/notes'))


// list the app on localhost
app.listen(port, () => {
  console.log(`Example app listening on port  http://localhost:${port}`)
})