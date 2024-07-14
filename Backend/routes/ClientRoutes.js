const express=require('express');
const { clientLogin, changeClientPassword, } = require('../controllers/clientController');
const checkLogin = require('../middleware/checkLogin');
const router=express.Router();
router.post('/clientLogin',clientLogin)
router.put('/change-Password/:id',checkLogin,changeClientPassword)




module.exports=router