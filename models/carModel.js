const mongoose = require('mongoose')


const carSchema = new mongoose.Schema({
    companyName:{
        type:String,
        required:true
    },
    carType:{
        type:String,
        required:true,
        unique:true
    },
    modelNo:{
        type:String,
        required:true
    },
    ownership:{
        type:String,
        required:true
    },
    fuelType:{
        type:String,
        required:true
    },
    kmDriven:{
        type:String,
        required:true
    },
    insuranceValidity:{
        type:String,
        required:true
    },
    carColor:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    tyrePercentage:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },

})

module.exports = mongoose.model('carDetails',carSchema)