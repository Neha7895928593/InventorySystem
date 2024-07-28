const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const brandSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  models: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: [],
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Brand', brandSchema);
