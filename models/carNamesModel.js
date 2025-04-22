// models/CarModel.js
const mongoose = require('mongoose');

const carNamesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  image: {
    type: String 
  },
  vehicleType: {
    type: String,
    enum: ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Truck']
  },
});

module.exports = mongoose.model('car_names', carNamesSchema);