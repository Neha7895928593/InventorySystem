const express=require('express');
const { superAdminLogin, addDealer, deleteDealer} = require('../controllers/superAdminController');
const checkLogin = require('../middleware/checkLogin');

const router=express.Router();
router.post('/superAdminLogin',superAdminLogin)
router.post('/add-dealer',   checkLogin  , addDealer );
router.delete('/delete/:dealerId', checkLogin, deleteDealer);


module.exports=router