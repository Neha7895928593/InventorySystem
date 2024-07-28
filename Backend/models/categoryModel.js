const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  modelNo: {
    type: String,
    required: true,
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Category', categorySchema);
