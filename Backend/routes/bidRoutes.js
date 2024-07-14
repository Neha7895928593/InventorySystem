const express = require('express');
const { addBid, getBidsByUser } = require('../controllers/bidController');
const checkLogin = require('../middleware/checkLogin');
const router = express.Router();

router.post('/add-bid/:userId', checkLogin, addBid);
router.get('/get-bids/:userId', checkLogin, getBidsByUser);

module.exports = router;
