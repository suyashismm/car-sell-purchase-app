const express = require('express')
const path = require('path');
const dotenv = require('dotenv')
const connect = require('./db/db')
const carRoutes = require('./routes/carRoutes')
const cors = require('cors');

const app = express();

dotenv.config()

connect()

// const corsOptions = {
//     origin: '*', // Allow all origins (for development)
//     // OR be more specific:
//      origin: ['http://192.168.29.21:3000'],
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
//   };
  
  app.use(cors());
// app.use(cors());


app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', carRoutes)

module.exports = app;


function getLocalIP() {
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}