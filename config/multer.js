const multer = require('multer');
const path = require('path');

// const storage = multer.diskStorage({
//     destination: './uploads/',
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}${path.extname(file.originalname)}`);
//     }
// });

const imageFileFilter = (req, file, cb) => {
    const filetypes = /jpe?g|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Only images are allowed (JPEG, PNG, GIF)'));
};

// module.exports = multer({
//     storage,
//     limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
//     fileFilter
// }).array('images', 4); // Field name must match frontend


// const multiImageUpload = multer({
//     storage: multer.diskStorage({
//         destination: './uploads/adminUploads',
//         filename: (req, file, cb) => {
//             cb(null, `${Date.now()}${path.extname(file.originalname)}`);
//         }
//     }),
//     limits: { fileSize: 10 * 1024 * 1024 },
//     fileFilter: imageFileFilter
// }).array('images', 4);

// const companyCarUpload = multer({
//     storage: multer.diskStorage({
//         destination: './uploads/companyCars/',
//         filename: (req, file, cb) => {
//             cb(null, `${Date.now()}${path.extname(file.originalname)}`);
//         }
//     }),
//     limits: { fileSize: 10 * 1024 * 1024 },
//     fileFilter: imageFileFilter
// }).fields([
//     { name: 'companyLogo', maxCount: 1 },
//     { name: 'carImage', maxCount: 1 }
// ]);

module.exports = {
    adminImagesUploads: multer({  // renamed to be more descriptive
        storage: multer.diskStorage({
            destination: './uploads/adminUploads',
            filename: (req, file, cb) => {
                cb(null, `${Date.now()}${path.extname(file.originalname)}`);
            }
        }),
        limits: { fileSize: 10 * 1024 * 1024 },
        fileFilter: imageFileFilter
    }).array('images', 4),
    
    uploadCompanyCar: multer({  // new configuration
        storage: multer.diskStorage({
            destination: './uploads/company_cars/',
            filename: (req, file, cb) => {
                cb(null, `${Date.now()}${path.extname(file.originalname)}`);
            }
        }),
        limits: { fileSize: 10 * 1024 * 1024 },
        fileFilter: imageFileFilter
    }).fields([
        { name: 'companyLogo', maxCount: 1 },
        { name: 'carImage', maxCount: 1 }
    ])
};