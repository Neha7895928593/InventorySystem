const express=require('express');
const { addItemToWishlist, getWishlist, removeItemFromWishlist } = require('../controllers/wishlistController');
const checkLogin = require('../middleware/checkLogin');
const router = express.Router();

router.post('/add-item/:userId',  checkLogin, addItemToWishlist);
router.get('/get-wishlist/:userId', getWishlist);
router.delete('/remove-item/:userId/:itemId', removeItemFromWishlist);




module.exports=router