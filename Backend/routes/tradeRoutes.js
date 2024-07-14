const express = require('express');

const checkLogin = require('../middleware/checkLogin');
const { addTrade, getTradesByUser } = require('../controllers/TradeController');
const router = express.Router();

router.post('/add-trade/:userId', checkLogin, addTrade);
router.get('/get-trades/:userId', checkLogin, getTradesByUser);

module.exports = router;
