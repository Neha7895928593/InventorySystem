const express=require('express');
const { addClient, masterAdminLogin, updateClient, deleteClient, changeMasterAdminPassword,  getAllClients, getClientById } = require('../controllers/masterAdminController');
const checkLogin = require('../middleware/checkLogin');
const router=express.Router();
router.post('/masterAdminLogin',  masterAdminLogin)
router.post('/add-client', checkLogin, addClient);
router.get('/getAllClients', getAllClients)

router.put('/update-client/:id' , checkLogin, updateClient);
router.delete('/delete-client/:id',   checkLogin, deleteClient);
router.put('/change-Password/:id',checkLogin, changeMasterAdminPassword);

router.get('/getClient/:id', getClientById);


module.exports=router