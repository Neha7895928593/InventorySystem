const StopLoss = require('../models/stopLoss');
const Client = require('../models/client');
const mongoose = require('mongoose');

const addStopLoss = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId)
    const { symbol, stopLossPrice, quantity } = req.body;
    console.log(req.body)

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID format' });
    }

    const user = await Client.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const newStopLoss = new StopLoss({
      user: userId,
      symbol,
      stopLossPrice,
      quantity,
    });

    await newStopLoss.save();
    return res.status(201).json({ success: true, stopLoss: newStopLoss });
  } catch (error) {
    console.error('Error adding stop-loss:', error);
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
};

const getStopLossesByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID format' });
    }

    const stopLosses = await StopLoss.find({ user: userId });

    if (!stopLosses.length) {
      return res.status(404).json({ success: false, message: 'No stop-losses found for this user' });
    }

    return res.status(200).json({ success: true, stopLosses });
  } catch (error) {
    console.error('Error fetching stop-losses:', error);
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
};

module.exports = {
  addStopLoss,
  getStopLossesByUser,
};
