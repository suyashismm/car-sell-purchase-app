const mongoose = require('mongoose')
require('dotenv').config()

function connect () {
    mongoose.connect(process.env.MONGODB_URL).then(() => {
        console.log("Database connected successfully")
    }).catch(error => console.log("Error connecting database",error))
}


module.exports = connect;