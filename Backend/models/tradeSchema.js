const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  tradeType: {
    type: String,
    enum: ['buy', 'sell'],
    required: true,
  },
  tradePrice: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
//   status: {
//     type: String,
//     enum: ['open', 'closed', 'cancelled'],
//     default: 'open',
//   },
}, { timestamps: true });

module.exports = mongoose.model('Trade', tradeSchema);
