const express = require('express');
const { addStopLoss, getStopLossesByUser } = require('../controllers/stoploosController');
const checkLogin = require('../middleware/checkLogin');
const router = express.Router();

router.post('/add-stopLoss/:userId', checkLogin, addStopLoss);
router.get('/get-stopLosses/:userId', checkLogin, getStopLossesByUser);

module.exports = router;
