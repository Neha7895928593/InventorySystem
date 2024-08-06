// routes/dealerRoutes.js

const express = require('express');
const router = express.Router();
const {
  dealerLogin,
  addBrand,
  addCategory,
  editCategoryPrice,
  deleteBrand,
  deleteCategory,
  getBrandsWithCategories,
  getCategoriesForBrand,
  addSale,
  addPurchase,
  getSales,
  getPurchases,
  changeDealerPassword,
  getAllCategories,
  getBrandWisePerformance,
  updateBrandName,
  // getBrandwiseData, 
  // getCategorywiseData, 
  // getBrandwiseModelData 
} = require('../controllers/dealerController');
const checkLogin = require('../middleware/checkLogin');

// Dealer Authentication
router.post('/login', dealerLogin);

// Brand Routes
router.post('/brands', checkLogin, addBrand);
router.delete('/brands/:brandId', checkLogin, deleteBrand);

router.put('/brands/:brandId',checkLogin,updateBrandName)
router.get('/brands', getBrandsWithCategories);

// Category Routes
router.post('/categories', checkLogin, addCategory);
router.put('/categories/:categoryId/price', checkLogin, editCategoryPrice);
router.delete('/categories/:categoryId', checkLogin, deleteCategory);
router.get('/brands/:brandName/categories', getCategoriesForBrand);
router.get('/categories', getAllCategories);

// Sales and Purchases Routes
router.post('/sales', checkLogin, addSale);
router.post('/purchases', checkLogin, addPurchase);
router.get('/sales', checkLogin, getSales);
router.get('/purchases', checkLogin, getPurchases);

// Change Dealer Password
router.put('/change-password/:dealerId', checkLogin, changeDealerPassword);

// // Performance Data Routes
 router.post('/performance/brandwise', checkLogin, getBrandWisePerformance);
// router.get('/performance/categorywise', checkLogin, getCategorywiseData);
// router.get('/performance/brandwise/:brand/models', checkLogin, getBrandwiseModelData);

module.exports = router;
