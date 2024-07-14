const Trade = require('../models/tradeSchema');
const Client = require('../models/client');
const mongoose = require('mongoose');

const addTrade = async (req, res) => {
  try {
    const { userId } = req.params;
    const { symbol, tradeType, tradePrice, quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID format' });
    }

    const user = await Client.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const newTrade = new Trade({
      user: userId,
      symbol,
      tradeType,
      tradePrice,
      quantity,
    });

    await newTrade.save();
    return res.status(201).json({ success: true, trade: newTrade });
  } catch (error) {
    console.error('Error adding trade:', error);
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
};

const getTradesByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID format' });
    }

    const trades = await Trade.find({ user: userId });

    if (!trades.length) {
      return res.status(404).json({ success: false, message: 'No trades found for this user' });
    }

    return res.status(200).json({ success: true, trades });
  } catch (error) {
    console.error('Error fetching trades:', error);
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
};

module.exports = {
  addTrade,
  getTradesByUser,
};
