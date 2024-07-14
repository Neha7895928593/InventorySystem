const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  bidPrice: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
 
  
}, { timestamps: true });

module.exports = mongoose.model('Bid', bidSchema);
