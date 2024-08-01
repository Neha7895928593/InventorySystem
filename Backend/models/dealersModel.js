const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dealerSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  
  totalStockQuantity: {
    type: Number,
    default: 0,
  },
  totalStockAmount: {
    type: Number,
    default: 0.0,
  },
  sales: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sale',
    default: [],
  }],
  purchases: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Purchase',
    default: [],
  }],
},{ timestamps: true });

module.exports = mongoose.model('Dealer', dealerSchema);
