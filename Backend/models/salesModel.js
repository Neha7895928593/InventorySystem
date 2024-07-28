const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const saleSchema = new Schema({
  dealer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dealer',
    required: true,
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
},{ timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);
