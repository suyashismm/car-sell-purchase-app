const mongoose = require('mongoose')


const carSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    carType: {
        type: String,
        required: true,
    },
    modelNo: {
        type: String,
        required: true
    },
    ownership: {
        type: String,
        required: true
    },
    fuelType: {
        type: String,
        required: true
    },
    kmDriven: {
        type: String,
        required: true
    },
    insuranceValidity: {
        type: String,
        required: true
    },
    carColor: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    tyrePercentage: {
        type: String,
        required: true
    },
    otherDescription: {
        type: String,
        // required: true
    },
    // images: [{
    //     type: String,
    //     required: true
    // }],
    images: [{
        file: { type: String, required: true }, // stores the file path/URL
        imageType: { type: String, required: true } // e.g., "front-view", "rear-view", "interior", "side-view"
      }],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('carDetails', carSchema)