// const carDetails = require('../models/carModel');
// const upload = require('../config/multer');
// const fs = require('fs');

// module.exports.submitCarDetails = async (req, res) => {
//     try {
//         // Process uploads first
//         await new Promise((resolve, reject) => {
//             upload(req, res, (err) => {
//                 if (err) {
//                     if (err.code === 'LIMIT_FILE_SIZE') {
//                         return reject({ status: 400, error: 'File size too large (max 10MB)' });
//                     }
//                     if (err === 'Error: Images only!') {
//                         return reject({ status: 400, error: 'Only images are allowed' });
//                     }
//                     return reject({ status: 400, error: err.message || 'File upload error' });
//                 }
//                 resolve();
//             });
//         });

//         // Validate required fields
//         const { 
//             companyName, carType, modelNo, ownership, 
//             fuelType, kmDriven, insuranceValidity, 
//             carColor, price, tyrePercentage, otherDescription,
//             imageTypes // Now coming from frontend
//         } = req.body;

//         const requiredFields = { 
//             companyName, carType, modelNo, ownership, 
//             fuelType, kmDriven, insuranceValidity, 
//             carColor, price, tyrePercentage 
//         };

//         for (const [key, value] of Object.entries(requiredFields)) {
//             if (!value || value.toString().trim() === "") {
//                 // Cleanup uploaded files if validation fails
//                 if (req.files?.length) {
//                     req.files.forEach(file => fs.unlinkSync(file.path));
//                 }
//                 return res.status(400).json({ error: `${key} is required` });
//             }
//         }

//         // Match files with their types
//         const images = req.files.map((file, index) => ({
//             file: file.path,
//             imageType: JSON.parse(imageTypes)[index] // Parse array from string
//         }));

//         const car = await carDetails.create({
//             companyName, 
//             carType, 
//             modelNo, 
//             ownership, 
//             fuelType, 
//             kmDriven, 
//             insuranceValidity, 
//             carColor, 
//             price, 
//             tyrePercentage, 
//             otherDescription,
//             images // Now matches schema { file: String, imageType: String }
//         });

//         res.status(201).json({ success: true, data: car });

//     } catch (error) {
//         // Cleanup on error
//         if (req.files?.length) {
//             req.files.forEach(file => fs.unlinkSync(file.path));
//         }
//         res.status(error.status || 500).json({ 
//             error: error.error || 'Something went wrong',
//             details: error.message 
//         });
//     }
// };
const carDetails = require('../models/carModel');
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