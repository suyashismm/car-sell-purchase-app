// models/CarDetail.js
const mongoose = require('mongoose');

const carDetailSchema = new mongoose.Schema({
  carModel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CarNames',
    required: true
  },
  views: {
    front: [
      {
        price: Number,
        image: String,
        details: [String],
      },
    ],
    rear: [
      {
        price: Number,
        image: String,
        details: [String],
      },
    ],
    left: [
      {
        price: Number,
        image: String,
        details: [String],
      },
    ],
    right: [
      {
        price: Number,
        image: String,
        details: [String],
      },
    ],
    whole: [
      {
        price: Number,
        image: String,
        details: [String],
      },
    ],
}
});

module.exports = mongoose.model('CarDetail', carDetailSchema);