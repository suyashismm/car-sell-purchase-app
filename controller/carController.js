const mongoose = require('mongoose')
const carDetails = require('../models/carModel');
const Company = require('../models/carCompanyModel')
const CarName = require('../models/carNamesModel')
const upload = require('../config/multer');
const fs = require('fs');
const path = require('path');

module.exports.submitCarDetails = async (req, res) => {
    try {
        // Process uploads first
        await new Promise((resolve, reject) => {
            upload(req, res, (err) => {
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
            file: `/uploads/${path.basename(file.path)}`, // Public URL path
            imageType: JSON.parse(imageTypes)[index]
        }));

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














