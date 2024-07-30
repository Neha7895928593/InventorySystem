const express=require('express');
const { superAdminLogin, addDealer, deleteDealer, getDealerById} = require('../controllers/superAdminController');
const checkLogin = require('../middleware/checkLogin');

const router=express.Router();
router.post('/superAdminLogin',superAdminLogin)
router.post('/add-dealer',   checkLogin  , addDealer );
router.delete('/delete/:dealerId', checkLogin, deleteDealer);
router.get('/dealers/:id',getDealerById)


module.exports=router