const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    const filetypes = /jpe?g|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Only images are allowed (JPEG, PNG, GIF)'));
};

module.exports = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter
}).array('images', 4); // Field name must match frontend