const express = require('express')
const router = express.Router()
const carDetails = require('../models/carModel')
const carController = require('../controller/carController')




  
router.post('/submitCarDetails', carController.submitCarDetails)


module.exports = router;