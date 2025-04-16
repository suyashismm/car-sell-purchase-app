const carDetails = require('../models/carModel')



module.exports.submitCarDetails = async (req,res) => {
    try{
        const {companyName, carType, modelNo, ownership, fuelType, kmDriven, insuranceValidity, carColor, price, tyrePercentage, description} = req.body;

        const photoPaths = req.files.map(file => file.filename); // or file.path

    const car = new carDetails({
      carname,
      carcompany,
      photos: photoPaths
    });

    await car.save();
    res.status(201).json({ message: 'Car added successfully', car });
    }
    catch(error){
        res.status(500).json({ error: 'Something went wrong', details: err.message });
    }
}
