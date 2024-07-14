const Bid = require('../models/bidSchema');
const Client = require('../models/client');
const mongoose = require('mongoose');

const addBid = async (req, res) => {
  try {
    const { userId } = req.params;
    const { symbol, bidPrice, quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID format' });
    }

    const user = await Client.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const newBid = new Bid({
      user: userId,
      symbol,
      bidPrice,
      quantity,
    });

    await newBid.save();
    return res.status(201).json({ success: true, bid: newBid });
  } catch (error) {
    console.error('Error adding bid:', error);
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
};

const getBidsByUser = async (req, res) => {
    try {
      const { userId } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ success: false, message: 'Invalid user ID format' });
      }
  
      const bids = await Bid.find({ user: userId });
  
      if (!bids.length) {
        return res.status(404).json({ success: false, message: 'No bids found for this user' });
      }
  
      return res.status(200).json({ success: true, bids });
    } catch (error) {
      console.error('Error fetching bids:', error);
      return res.status(500).json({ success: false, message: 'An error occurred' });
    }
  };
  
  
  

module.exports = {
  addBid, getBidsByUser
};
