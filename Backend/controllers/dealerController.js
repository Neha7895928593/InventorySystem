const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Dealer = require('../models/dealersModel'); 
const Brand = require('../models/brandModel');
const Sale = require('../models/salesModel');
const Purchase = require('../models/purchaseModel');
const Category = require('../models/categoryModel');


const dotenv=require('dotenv')
dotenv.config();
const dealerLogin = async (req, res) => {
  try {
    const { dealerId, password } = req.body;

    // Find the dealer by dealerId
    const dealer = await Dealer.findOne({ dealerId });
    if (!dealer) {
      return res.status(401).json({ success: false, message: 'Invalid dealer ID or password' });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, dealer.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid dealer ID or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: dealer._id }, process.env.SECRET_KEY, { expiresIn: '7d' });

    return res.json({ success: true, message: 'Dealer logged in successfully', token });
  } catch (error) {
    console.error('Error in dealer login:', error);
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
};


const changeDealerPassword = async (req, res) => {
  try {
    const { dealerId } = req.params;
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    // Check if all required fields are provided
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Check if the new password and re-entered new password match
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ success: false, message: 'New passwords do not match' });
    }

    // Find the dealer by ID
    const dealer = await Dealer.findById(dealerId);
    if (!dealer) {
      return res.status(404).json({ success: false, message: 'Dealer not found' });
    }

    // Verify the old password
    const isPasswordValid = await bcrypt.compare(oldPassword, dealer.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Old password is incorrect' });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    dealer.password = hashedNewPassword;

    // Save the updated dealer
    await dealer.save();

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ success: false, message: 'An error occurred' });
  }
};










const addBrand = async (req, res) => {
  try {
    const { name } = req.body;
    const existingBrand = await Brand.findOne({ name });

    if (existingBrand) {
      return res.status(400).json({ success: false, message: 'Brand already exists' });
    }

    const newBrand = new Brand({ name });
    await newBrand.save();

    return res.status(201).json({ success: true, message: 'Brand added successfully', brand: newBrand });
  } catch (error) {
    console.error('Error adding brand:', error);
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
};



const getBrandsWithCategories = async (req, res) => {
  try {
    const brands = await Brand.find().populate('models');

    res.json(brands);
  } catch (error) {
    console.error('Error fetching brands with categories:', error);
    res.status(500).json({ success: false, message: 'An error occurred' });
  }
};


const deleteBrand = async (req, res) => {
  try {
    const { brandId } = req.params;

    const brand = await Brand.findByIdAndDelete(brandId);
    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }

    // Delete all categories associated with this brand
    await Category.deleteMany({ brand: brand._id });

    res.status(200).json({ success: true, message: 'Brand and associated categories deleted successfully' });
  } catch (error) {
    console.error('Error deleting brand:', error);
    res.status(500).json({ success: false, message: 'An error occurred' });
  }
};



const addCategory = async (req, res) => {
  try {
    const { modelNo, brand, amount} = req.body;
    const dealerId = req.user._id; 

    // Check if the brand exists
    // const brand= await Brand.findById(brandId);
    // if (!brand) {
    //   return res.status(404).json({ success: false, message: 'Brand not found' });
    // }

    const newCategory = new Category({
      modelNo,
      brand,
      amount
    });

    await newCategory.save();

    // Add the category to the brand's models array
    brand.models.push(newCategory._id);
    await brand.save();


    res.status(201).json({ success: true, message: 'Category added successfully', newCategory });
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ success: false, message: 'An error occurred' });
  }
};




const getCategoriesForBrand = async (req, res) => {
  try {
    const { brandId } = req.params;

    const categories = await Category.find({ sbrand: brandId }).populate('brand');
    if (!categories.length) {
      return res.status(404).json({ success: false, message: 'No categories found for this brand' });
    }

    res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'An error occurred' });
  }
};


const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate('brand', 'name');
    res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'An error occurred' });
  }
};


const editCategoryPrice = async (req, res) => {
    try {
      const { categoryId } = req.params;
      const { newAmount } = req.body;
  
      const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        { amount: newAmount },
        { new: true }
      );
  
      if (!updatedCategory) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
  
      res.status(200).json({ success: true, message: 'Category price updated successfully', updatedCategory });
    } catch (error) {
      console.error('Error updating category price:', error);
      res.status(500).json({ success: false, message: 'An error occurred' });
    }
  };

  
  
  const deleteCategory = async (req, res) => {
    try {
      const { categoryId } = req.params;
  
      const category = await Category.findByIdAndDelete(categoryId);
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
  
      // Remove the category reference from the brand's models array
      await Brand.findByIdAndUpdate(category.brand, { $pull: { models: category._id } });
  
      res.status(200).json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ success: false, message: 'An error occurred' });
    }
  };
  

  
  const addSale = async (req, res) => {
    try {
      const { brandId, categoryId, quantity, date } = req.body;
      const dealerId = req.user._id;
  
      // Find the category based on categoryId
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
  
      // Check if the category belongs to the specified brand
      if (category.brand.toString() !== brandId) {
        return res.status(400).json({ success: false, message: 'Category does not belong to the specified brand' });
      }
  
      // Fetch the dealer to check stock quantity and amount
      const dealer = await Dealer.findById(dealerId);
      if (!dealer) {
        return res.status(404).json({ success: false, message: 'Dealer not found' });
      }
  
      // Check if the dealer has enough stock quantity
      if (dealer.totalStockQuantity < quantity) {
        return res.status(400).json({ success: false, message: 'Insufficient stock quantity' });
      }
  
      // Create a new sale
      const newSale = new Sale({
        dealer: dealerId,
        brand: brandId,
        category: category._id,
        quantity,
        date
      });
  
      await newSale.save();
  
      // Update dealer's stock quantity and amount
      dealer.totalStockQuantity -= quantity;
      dealer.totalStockAmount -= category.amount * quantity;
  
      // Add sale to dealer's sales array
      dealer.sales.push(newSale._id);
      
      await dealer.save();
  
      res.status(201).json({ success: true, message: 'Sale added successfully', newSale });
    } catch (error) {
      console.error('Error adding sale:', error);
      res.status(500).json({ success: false, message: 'An error occurred' });
    }
  };
  
  
  
  
  

  
  
 
  
  const getSales = async (req, res) => {
    try {
      const dealerId = req.user._id;
      const sales = await Sale.find({ dealer: dealerId }).populate('brand category');
      res.status(200).json({ success: true, sales });
    } catch (error) {
      console.error('Error fetching sales:', error);
      res.status(500).json({ success: false, message: 'An error occurred' });
    }
  };






  const addPurchase = async (req, res) => {
    try {
      const { brandId, categoryId, quantity, date } = req.body;
      const dealerId = req.user._id;
  
      // Find the category based on brandId and categoryId
      const category = await Category.findOne({ brand: brandId, _id: categoryId });
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
  
      const dealer = await Dealer.findById(dealerId);
      if (!dealer) {
        return res.status(404).json({ success: false, message: 'Dealer not found' });
      }
  
      // Create a new purchase
      const newPurchase = new Purchase({
        dealer: dealerId,
        brand: brandId,
        category: category._id,
        quantity,
        date
      });
  
      await newPurchase.save();
  
      // Update dealer's stock quantity and amount
      dealer.totalStockQuantity += quantity;
      dealer.totalStockAmount += category.amount * quantity;
  
      // Add purchase to dealer's purchases array
      dealer.purchases.push(newPurchase._id);
      
      await dealer.save();
  
      res.status(201).json({ success: true, message: 'Purchase added successfully', newPurchase });
    } catch (error) {
      console.error('Error adding purchase:', error);
      res.status(500).json({ success: false, message: 'An error occurred' });
    }
  };
  
 
  
    
  const getPurchases = async (req, res) => {
    try {
      const dealerId = req.user._id;
      const purchases = await Purchase.find({ dealer: dealerId }).populate('brand category');
      res.status(200).json({ success: true, purchases });
    } catch (error) {
      console.error('Error fetching purchases:', error);
      res.status(500).json({ success: false, message: 'An error occurred' });
    }
  };







module.exports = { dealerLogin , changeDealerPassword, addBrand,
     deleteBrand, getBrandsWithCategories, addCategory,editCategoryPrice,deleteCategory,
     getCategoriesForBrand, getAllCategories,addSale,  getSales, addPurchase, getPurchases };
