const mongoose = require('mongoose');

const stopLossSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  stopLossPrice: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'triggered', 'cancelled'],
    default: 'active',
  },
}, { timestamps: true });

module.exports = mongoose.model('StopLoss', stopLossSchema);
