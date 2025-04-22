// models/Company.js
const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  logo: {
    type: String, // URL or path to logo image
    required: true
  },
});

module.exports = mongoose.model('Company', companySchema, 'Company');