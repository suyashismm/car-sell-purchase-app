const carDetails = require('../models/carModel')
const upload = require('../config/multer');


module.exports.submitCarDetails = (req,res) => {

    console.log("incomming requesrt...........")
    try {
        upload(req, res, async (err) => {
          if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
              return res.status(400).json({ error: 'File size too large (max 10MB)' });
            }
            if (err === 'Error: Images only!') {
              return res.status(400).json({ error: 'Only images are allowed' });
            }
            return res.status(400).json({ error: err.message || 'File upload error' });
          }
    
          // Check if files were uploaded
          if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'Please upload at least one image' });
          }
    
          const { companyName, carType, modelNo, ownership, fuelType, kmDriven, insuranceValidity, carColor, price, tyrePercentage, description } = req.body;
          
          // Validate required fields
          const requiredFields = { companyName, carType, modelNo, ownership, fuelType, kmDriven, insuranceValidity, carColor, price, tyrePercentage, description };
          
          for (const [key, value] of Object.entries(requiredFields)) {
            if (!value || value.toString().trim() === "") {
              // Delete any uploaded files if validation fails
              if (req.files && req.files.length > 0) {
                req.files.forEach(file => {
                  fs.unlinkSync(file.path);
                });
              }
              return res.status(400).json({ error: `${key} is required` });
            }
          }
    
          const imagePaths = req.files.map(file => file.path);
    
          const car = await carDetails.create({
            companyName, 
            carType, 
            modelNo, 
            ownership, 
            fuelType, 
            kmDriven, 
            insuranceValidity, 
            carColor, 
            price, 
            tyrePercentage, 
            description,
            images: imagePaths
          });
    
          res.status(201).json({ success: true, data: car });
        });
    }
    catch(error){
        res.status(500).json({ error: 'Something went wrong', details: err.message });
    }
}
