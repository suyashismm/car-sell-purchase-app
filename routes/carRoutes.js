const express = require('express')
const router = express.Router()
const carDetails = require('../models/carModel')
const carController = require('../controller/carController')




  
router.post('/submitCarDetails', carController.submitCarDetails)
router.get('/getCompanies',carController.getAllCarCompanies)
router.get('/getCarsByCompany/companyId=:companyId',carController.getCarsByCompany)

module.exports = router;