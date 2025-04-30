const express = require('express')
const router = express.Router()
const carDetails = require('../models/carModel')
const carController = require('../controller/carController')
const { uploadCompanyCar } = require('../config/multer');



const handleFileUpload = (req, res, next) => {
    uploadCompanyCar(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ error: 'File size too large (max 10MB)' });
            }
            if (err.message.includes('Only images are allowed')) {
                return res.status(400).json({ error: 'Only images are allowed (JPEG, PNG, GIF)' });
            }
            return res.status(400).json({ error: err.message || 'File upload error' });
        }
        next();
    });
};
  
router.post('/submitCarDetails', carController.submitCarDetails)
router.get('/getCompanies',carController.getAllCarCompanies)
router.get('/getCarsByCompany/companyId=:companyId',carController.getCarsByCompany)
router.post('/addCarAndCompany',handleFileUpload,carController.addCarAndCompany)

module.exports = router;