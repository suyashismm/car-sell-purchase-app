const mongoose = require('mongoose')
const adminUploads = require('../models/carModel');
const CompanyModel = require('../models/carCompanyModel')
const CarModel = require('../models/carNamesModel')
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
        const companies = await CompanyModel.find(); // Fetches all companies from DB

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

        const company = await CompanyModel.findById(companyId);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }

        const cars = await CarModel.find({ companyId: company._id });
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



// module.exports.addCarAndCompnay = async (req, res) => {

//     const session = await mongoose.startSession();
//     session.startTransaction();
//     try {

//         await new Promise((resolve, reject) => {
//             uploadCompanyCar(req, res, (err) => {
//                 if (err) {
//                     if (err.code === 'LIMIT_FILE_SIZE') {
//                         return reject({ status: 400, error: 'File size too large (max 10MB)' });
//                     }
//                     if (err.message.includes('Only images are allowed')) {
//                         return reject({ status: 400, error: 'Only images are allowed (JPEG, PNG, GIF)' });
//                     }
//                     return reject({ status: 400, error: err.message || 'File upload error' });
//                 }
//                 resolve();
//             });
//         });
//         // 1. Extract data from request
//         const { companyName, carName, fuelType, description, vehicleType } = req.body;
//         const companyLogo = req.files['companyLogo'][0];
//         const carImage = req.files['carImage'][0];

//         // 2. Validate required fields
//         if (!companyName || !carName || !fuelType || !description) {
//             return res.status(400).json({ error: 'All fields are required' });
//         }

//         let company = await CompanyModel.findOne({ name: companyName }).session(session);

//         if (!company) {
//             // Create new company if it doesn't exist
//             company = await CompanyModel.create([{
//                 name: companyName,
//                 logo: companyLogo.filename,
//                 createdAt: new Date()
//             }], { session });
//             company = company[0];
//         } else if (company) {
//             // Update company logo if company exists
//             if (companyLogo) {
//                 company.logo = companyLogo.filename;
//                 await company.save({ session });
//             }
//         }

//         // 3. Create data objects for each collection
//         // const companyData = {
//         //     name: companyName,
//         //     logo: companyLogo.filename, // or the full path if needed
//         //     createdAt: new Date()
//         // };

//         const carData = {
//             name: carName,
//             image: carImage.filename,
//             fuelType,
//             vehicleType,
//             description,
//             companyId: company._id, // reference to company
//             createdAt: new Date()
//         };

//         const newCar = await CarModel.create([carData], { session });

//         await session.commitTransaction();
//         session.endSession();

//         // 5. Send success response
//         res.status(201).json({
//             success: true,
//             company: newCompany[0],
//             car: newCar[0],
//             message: 'Data saved successfully to both collections'
//         });

//     } catch (error) {
//         await session.abortTransaction();
//         session.endSession();

//         console.error('Error:', error);
//         res.status(500).json({
//             success: false,
//             error: 'Server error processing request',
//             details: process.env.NODE_ENV === 'development' ? error.message : undefined
//         });
//     }
// }



module.exports.addCarAndCompany = async (req, res) => {
    const session = await mongoose.startSession();
    
    try {
        await session.startTransaction();

        // await new Promise((resolve, reject) => {
        //     uploadCompanyCar(req, res, (err) => {
        //         if (err) {
        //             if (err.code === 'LIMIT_FILE_SIZE') {
        //                 return reject({ status: 400, error: 'File size too large (max 10MB)' });
        //             }
        //             if (err.message.includes('Only images are allowed')) {
        //                 return reject({ status: 400, error: 'Only images are allowed (JPEG, PNG, GIF)' });
        //             }
        //             return reject({ status: 400, error: err.message || 'File upload error' });
        //         }
        //         resolve();
        //     });
        // });

        const { companyName, carName, fuelType, description, vehicleType } = req.body;
        const companyLogo = req.files['companyLogo'][0];
        const carImage = req.files['carImage'][0];

        if (!companyName || !carName || !fuelType || !description) {
            // Cleanup files before returning
            if (req.files) {
                if (req.files['companyLogo']) fs.unlinkSync(req.files['companyLogo'][0].path);
                if (req.files['carImage']) fs.unlinkSync(req.files['carImage'][0].path);
            }
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ error: 'All fields are required' });
        }

        let company = await CompanyModel.findOne({ name: companyName }).session(session);

        if (!company) {
            company = await CompanyModel.create([{
                name: companyName,
                logo: companyLogo.filename,
                createdAt: new Date()
            }], { session });
            company = company[0];
        } else {
            company.logo = companyLogo.filename;
            await company.save({ session });
        }

        const carData = {
            name: carName,
            image: carImage.filename,
            fuelType,
            vehicleType,
            description,
            companyId: company._id,
            createdAt: new Date()
        };

        const newCar = await CarModel.create([carData], { session });

        await session.commitTransaction();
        
        res.status(201).json({
            success: true,
            company: company,  // Fixed: using the correct variable
            car: newCar[0],
            message: 'Data saved successfully to both collections'
        });

    } catch (error) {
        // Only abort if transaction hasn't been committed
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        
        // Cleanup files on error
        if (req.files) {
            if (req.files['companyLogo']) fs.unlinkSync(req.files['companyLogo'][0].path);
            if (req.files['carImage']) fs.unlinkSync(req.files['carImage'][0].path);
        }

        console.error('Error:', error);
        res.status(error.status || 500).json({
            success: false,
            error: error.error || 'Server error processing request',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    } finally {
        // Always end the session
        session.endSession();
    }
};