const express=require('express');
const { superAdminLogin, addMasterAdmin, updateMasterAdmin, deleteMasterAdmin, 
    getSuperAdminWithMasterAdmins, getAllMasterAdminsWithClients, 
    getMasterAdminWithClients} = require('../controllers/superAdminController');
const checkLogin = require('../middleware/checkLogin');

const router=express.Router();
router.post('/superAdminLogin',superAdminLogin)
router.post('/add-masterAdmin',   checkLogin, addMasterAdmin);
router.put('/update-masterAdmin/:id', checkLogin,updateMasterAdmin);
router.delete('/delete-masterAdmin/:id',checkLogin, deleteMasterAdmin);
router.get('/getSuperAdmin', getSuperAdminWithMasterAdmins);
router.get('/getMasterAdmin/:id', getMasterAdminWithClients);
router.get('/getAllMasterAdmin',getAllMasterAdminsWithClients)


module.exports=router