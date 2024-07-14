// controllers/wishlistController.js
const Wishlist = require('../models/wishlist');
const Client = require('../models/client');
const mongoose=require('mongoose')

const addItemToWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    const { itemType, symbol, company_name } = req.body;

    const user = await Client.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let newItem = { itemType, symbol };

    if (itemType === 'Stock') {
      if (!company_name) {
        return res.status(400).json({ success: false, message: 'Company name is required for stock items' });
      }
      newItem.company_name = company_name;
    } else if (itemType === 'MCX') {
      newItem.company_name = undefined;
    }

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      const newWishlist = new Wishlist({
        user: userId,
        items: [newItem],
      });
      await newWishlist.save();
      return res.status(201).json({ success: true, wishlist: newWishlist });
    } else {
      wishlist.items.push(newItem);
      await wishlist.save();
      return res.status(200).json({ success: true, wishlist });
    }
  } catch (error) {
    console.error('Error adding item to wishlist:', error);
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
};


const getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID format' });
    }

    const wishlist = await Wishlist.findOne({ user: userId }).populate('user');
    if (!wishlist) {
      return res.status(404).json({ success: false, message: 'Wishlist not found' });
    }

    return res.status(200).json({ success: true, wishlist });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
};

const removeItemFromWishlist = async (req, res) => {
  try {
    const { userId, itemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({ success: false, message: 'Wishlist not found' });
    }

    const itemIndex = wishlist.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not found in wishlist' });
    }

    wishlist.items.splice(itemIndex, 1);
    await wishlist.save();

    return res.status(200).json({ success: true, message: 'Item removed from wishlist', wishlist });
  } catch (error) {
    console.error('Error removing item from wishlist:', error);
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
};



module.exports = { addItemToWishlist,getWishlist,removeItemFromWishlist };
