const mongoose = require('mongoose')
const adminUploads = require('../models/carModel');
const Company = require('../models/carCompanyModel')
const CarName = require('../models/carNamesModel')
const { adminImagesUploads, uploadCompanyCar } = require('../config/multer');
const fs = require('fs');
const path = require('path');


module.exports.submitCarDetails = async (req, res) => {
    try {
        // Process uploads first
        await new Promise((resolve, reject) => {
            adminImagesUploads(req, res, (err) => {
                if (err) {
                    if (err.code === 'LIMIT_FILE_SIZE') {
                        return reject({ status: 400, error: 'File size too large (max 10MB)' });
                    }
                    if (err === 'Error: Images only!') {
                        return reject({ status: 400, error: 'Only images are allowed' });
                    }
                    return reject({ status: 400, error: err.message || 'File upload error' });
                }
                resolve();
            });
        });

        // Validate required fields
        const {
            companyName, carType, modelNo, ownership,
            fuelType, kmDriven, insuranceValidity,
            carColor, price, tyrePercentage, otherDescription,
            imageTypes
        } = req.body;

        const requiredFields = {
            companyName, carType, modelNo, ownership,
            fuelType, kmDriven, insuranceValidity,
            carColor, price, tyrePercentage
        };

        for (const [key, value] of Object.entries(requiredFields)) {
            if (!value || value.toString().trim() === "") {
                // Cleanup uploaded files if validation fails
                if (req.files?.length) {
                    req.files.forEach(file => fs.unlinkSync(file.path));
                }
                return res.status(400).json({ error: `${key} is required` });
            }
        }

        // Create image objects with public URLs
        const images = req.files.map((file, index) => ({
            file: `/uploads/adminUploads/${path.basename(file.path)}`, // Public URL path
            imageType: JSON.parse(imageTypes)[index]
        }));

        const car = await adminUploads.create({
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
            otherDescription,
            images
        });

        // Convert to object and add full URLs for response
        const carWithUrls = car.toObject();
        carWithUrls.images = carWithUrls.images.map(img => ({
            ...img,
            url: `${req.protocol}://${req.get('host')}${img.file}`
        }));

        res.status(201).json({
            success: true,
            data: carWithUrls
        });

    } catch (error) {
        // Cleanup on error
        if (req.files?.length) {
            req.files.forEach(file => fs.unlinkSync(file.path));
        }
        res.status(error.status || 500).json({
            error: error.error || 'Something went wrong',
            details: error.message
        });
    }
};


module.exports.getAllCarCompanies = async (req, res) => {
    try {
        const companies = await Company.find(); // Fetches all companies from DB

        // Transform _id to companyId in response only
        const transformedData = companies.map(company => {
            const { _id, ...rest } = company.toObject();
            return { companyId: _id, ...rest };
        });

        res.status(200).json({
            success: true,
            count: transformedData.length,
            data: transformedData
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err
        });
    }
};


module.exports.getCarsByCompany = async (req, res) => {
    try {
        const companyId = req.params.companyId;

        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid company ID format'
            });
        }

        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }

        const cars = await CarName.find({ companyId: company._id });
        console.log("cars", cars)

        res.status(200).json({
            success: true,
            company: {
                name: company.name,
                logo: company.logo
            },
            count: cars.length,
            data: cars
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};



module.exports.addCarAndCompnay = async (req,res) => {
        try {
            // 1. Extract data from request
            const { companyName, carName, fuelType, description,vehicleType } = req.body;
            const companyLogo = req.files['companyLogo'][0];
            const carImage = req.files['carImage'][0];
    
            // 2. Validate required fields
            if (!companyName || !carName || !fuelType || !description) {
                return res.status(400).json({ error: 'All fields are required' });
            }
    
            // 3. Create data objects for each collection
            const companyData = {
                name: companyName,
                logo: companyLogo.filename, // or the full path if needed
                createdAt: new Date()
            };
    
            const carData = {
                name: carName,
                image: carImage.filename,
                fuelType,
                vehicleType,
                description,
                companyName, // reference to company
                createdAt: new Date()
            };
    
            // 4. Save to databases - using Mongoose as example
            // Start a transaction if your DB supports it
            const session = await mongoose.startSession();
            session.startTransaction();
    
            try {
                // Save to Company collection
                const newCompany = await CompanyModel.create([companyData], { session });
                
                // Save to Car collection
                const newCar = await CarModel.create([carData], { session });
    
                // Commit the transaction
                await session.commitTransaction();
                session.endSession();
    
                // 5. Send success response
                res.status(201).json({
                    success: true,
                    company: newCompany[0],
                    car: newCar[0],
                    message: 'Data saved successfully to both collections'
                });
    
            } catch (dbError) {
                // If any error occurs, abort the transaction
                await session.abortTransaction();
                session.endSession();
                throw dbError; // this will be caught by the outer catch
            }
    
        } catch (error) {
            console.error('Error in company-car upload:', error);
            res.status(500).json({ 
                success: false,
                error: 'Server error during data processing',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
}









