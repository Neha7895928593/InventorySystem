const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  items: [
    {
      itemType: {
        type: String,
        enum: ['MCX', 'Stock'],
        required: true,
      },
      symbol: {
        type: String,
        required: true,
      },
      company_name: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);
