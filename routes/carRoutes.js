const express = require('express')
const router = express.Router()
const carDetails = require('../models/carModel')
const carController = require('../controller/carController')
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Save images in uploads/ folder
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname)); // e.g. 16832423423.jpg
    }
  });
  
  const upload = multer({ storage: storage });
  
  // Create uploads folder if not exists
  const fs = require('fs');
  if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
  }


  
router.post('/submitCarDetails', upload.array('photos', 2), carController.submitCarDetails)


module.exports = router;