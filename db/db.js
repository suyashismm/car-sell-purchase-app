const mongoose = require('mongoose')
require('dotenv').config()

function connect () {
    mongoose.connect(process.env.MONGODB_URL,{
        dbName: "car-website"
    }).then(() => {
        console.log(`Database connected successfully ${mongoose.connection.name}`)
    }).catch(error => console.log("Error connecting database",error))
}


module.exports = connect;