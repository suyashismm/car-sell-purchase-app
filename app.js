const express = require('express')
const dotenv = require('dotenv')
const connect = require('./db/db')
const carRoutes = require('./routes/carRoutes')
const app = express();

dotenv.config()

connect()

app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use('/', carRoutes)

module.exports = app;