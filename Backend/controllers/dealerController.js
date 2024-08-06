const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Dealer = require('../models/dealersModel'); 
const Brand = require('../models/brandModel');
const Sale = require('../models/salesModel');
const Purchase = require('../models/purchaseModel');
const Category = require('../models/categoryModel');
const mongoose=require('mongoose')


const dotenv=require('dotenv')
dotenv.config();
const dealerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the dealer by email
    const dealer = await Dealer.findOne({ email });
    if (!dealer) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, dealer.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: dealer._id }, process.env.SECRET_KEY, { expiresIn: '7d' });

    // Exclude sensitive information before sending the dealer object
    const { password: _, ...dealerWithoutPassword } = dealer.toObject();

    return res.json({ success: true, message: 'Dealer logged in successfully', token, dealer: dealerWithoutPassword });
  } catch (error) {
    console.error('Error in dealer login:', error);
    return res.status(500).json({ success: false, message: 'An error occurred during login. Please try again later.' });
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
    const brands = await Brand.find()

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
    await Category.deleteMany({ brand: brand.name});

    res.status(200).json({ success: true, message: 'Brand and associated categories deleted successfully' });
  } catch (error) {
    console.error('Error deleting brand:', error);
    res.status(500).json({ success: false, message: 'An error occurred' });
  }
};

const updateBrandName = async (req, res) => {
  try {
      const { brandId } = req.params;
      const { newName } = req.body;

      // Find the brand by ID
      const brand = await Brand.findById(brandId);
      if (!brand) {
          return res.status(404).json({ success: false, message: 'Brand not found' });
      }

      // Store the old brand name for updating categories
      const oldName = brand.name;

      // Update the brand name
      brand.name = newName;
      await brand.save();

      // Update all categories associated with this brand
      await Category.updateMany({ brand: oldName }, { brand: newName });

      res.status(200).json({ success: true, message: 'Brand name updated successfully' });
  } catch (error) {
      console.error('Error updating brand name:', error);
      res.status(500).json({ success: false, message: 'An error occurred' });
  }
};


const addCategory = async (req, res) => {
  try {
    const { modelNo, brand: brandName, amount } = req.body;
    const dealerId = req.user._id;

    // Find the brand by name
    const brand = await Brand.findOne({ name: brandName });
    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }

    // Create and save the new category
    const newCategory = new Category({
      modelNo,
      brand: brandName,  // Use the brand name as it's stored in your Category schema
      amount
    });

    await newCategory.save();

    // Add the new category to the brand's models array
    

    res.status(201).json({ success: true, message: 'Category added successfully', newCategory });
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ success: false, message: 'An error occurred' });
  }
};





const getCategoriesForBrand =  async (req, res) => {
    const { brandName } = req.params;
  
    try {
      const categories = await Category.find({ brand: brandName });
      res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ message: 'Server error' });
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
  
      // Ensure categoryId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({ success: false, message: 'Invalid category ID' });
      }
  
      // Find and delete the category by ID
      const category = await Category.findByIdAndDelete(categoryId);
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
  
      // Find the associated brand by brand name
      const brandName = category.brand;
      const remainingCategories = await Category.find({ brand: brandName });
  
      if (remainingCategories.length === 0) {
        // If no remaining categories for the brand, delete the brand
        await Brand.findOneAndDelete({ name: brandName });
      }
  
      res.status(200).json({ success: true, message: 'Category and possibly associated brand deleted successfully' });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ success: false, message: 'An error occurred' });
    }
  };
  
  

 
  const addSale = async (req, res) => {
    try {
      const { brand, category: modelNo, quantity, date } = req.body;
      const dealerId = req.user._id;
  
      // Fetch the dealer to update stock quantity and amount
      const dealer = await Dealer.findById(dealerId);
      if (!dealer) {
        return res.status(404).json({ success: false, message: 'Dealer not found' });
      }
  
      // Find the category based on brand and modelNo
      const categoryData = await Category.findOne({ brand, modelNo });
      if (!categoryData) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
  
      const amount = categoryData.amount; // Ensure categoryData has the amount field
      if (isNaN(amount)) {
        return res.status(400).json({ success: false, message: 'Invalid category amount' });
      }
  
      // Check if the dealer has enough stock quantity
      if (dealer.totalStockQuantity < quantity) {
        return res.status(400).json({ success: false, message: 'Insufficient stock quantity' });
      }
  
      // Create a new sale
      const newSale = new Sale({
        brand,
        category: modelNo, // Use modelNo here
        quantity,
        date
      });
  
      await newSale.save();
  
      // Update dealer's stock quantity and amount
      dealer.totalStockQuantity -= quantity;
      dealer.totalStockAmount -= amount * quantity;
  
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
      const sales = await Sale.find({ dealer: dealerId })
      res.status(200).json({ success: true, sales });
    } catch (error) {
      console.error('Error fetching sales:', error);
      res.status(500).json({ success: false, message: 'An error occurred' });
    }
  };




  const addPurchase = async (req, res) => {
    try {
      const { brand, category: modelNo, quantity, date } = req.body;
      const dealerId = req.user._id;
  
      // Input validation
      if (!brand || !modelNo || !quantity || !date) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
      }
  
      if (isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid quantity' });
      }
  
      // Fetch the dealer
      const dealer = await Dealer.findById(dealerId);
      if (!dealer) {
        return res.status(404).json({ success: false, message: 'Dealer not found' });
      }
  
      // Fetch the category based on brand and modelNo
      const categoryData = await Category.findOne({ brand, modelNo });
      if (!categoryData) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
  
      const amount = categoryData.amount;
      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid category amount' });
      }
  
      // Create a new purchase
      const newPurchase = new Purchase({
        brand,
        category: modelNo,
        quantity,
        date
      });
  
      await newPurchase.save();
  
      // Update dealer's stock quantity and amount
      dealer.totalStockQuantity += quantity;
      dealer.totalStockAmount += amount * quantity;
  
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
      const purchases = await Purchase.find({ dealer: dealerId })
      res.status(200).json({ success: true, purchases });
    } catch (error) {
      console.error('Error fetching purchases:', error);
      res.status(500).json({ success: false, message: 'An error occurred' });
    }
  };



const getBrandWisePerformance = async (req, res) => {
  try {
    const { filter, customStartDate, customEndDate } = req.body;
    
    // Define date range based on filter
    let startDate, endDate;
    const now = new Date();
    
    switch (filter) {
      case 'lastWeek':
        startDate = new Date();
        startDate.setDate(now.getDate() - 7);
        endDate = now;
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case 'quarterly':
        const quarter = Math.floor(now.getMonth() / 3) * 3;
        startDate = new Date(now.getFullYear(), quarter, 1);
        endDate = new Date(now.getFullYear(), quarter + 3, 0);
        break;
      case 'yearly':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear() + 1, 0, 0);
        break;
      case 'lifetime':
        startDate = new Date(0); // Epoch time
        endDate = now;
        break;
      case 'custom':
        if (!customStartDate || !customEndDate) {
          return res.status(400).json({ success: false, message: 'Custom date range requires both startDate and endDate.' });
        }
        startDate = new Date(customStartDate);
        endDate = new Date(customEndDate);
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid filter type' });
    }

    // Get sales and purchases within the date range
    const [sales, purchases] = await Promise.all([
      Sale.aggregate([
        { $match: { date: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: { brand: '$brand' }, totalQuantity: { $sum: '$quantity' } } }
      ]),
      Purchase.aggregate([
        { $match: { date: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: { brand: '$brand' }, totalQuantity: { $sum: '$quantity' } } }
      ])
    ]);

    // Initialize the performance data object
    const brandPerformance = {};

    // Process sales data
    for (const sale of sales) {
      const { _id: { brand }, totalQuantity } = sale;
      if (!brandPerformance[brand]) {
        brandPerformance[brand] = { totalQuantity: 0, totalAmount: 0 };
      }
      brandPerformance[brand].totalQuantity += totalQuantity;
    }

    // Process purchases data
    for (const purchase of purchases) {
      const { _id: { brand }, totalQuantity } = purchase;
      if (!brandPerformance[brand]) {
        brandPerformance[brand] = { totalQuantity: 0, totalAmount: 0 };
      }
      brandPerformance[brand].totalQuantity += totalQuantity;
    }

    // Add total amount based on category
    const categories = await Category.find({ brand: { $in: Object.keys(brandPerformance) } });
    categories.forEach(category => {
      const { brand, modelNo, amount } = category;
      if (brandPerformance[brand]) {
        brandPerformance[brand].totalAmount += brandPerformance[brand].totalQuantity * amount;
      }
    });

    res.status(200).json({ success: true, data: brandPerformance });
  } catch (error) {
    console.error('Error fetching brand-wise performance:', error);
    res.status(500).json({ success: false, message: 'An error occurred while fetching brand-wise performance' });
  }
};









module.exports = { dealerLogin , changeDealerPassword, addBrand, updateBrandName,
     deleteBrand, getBrandsWithCategories, addCategory,editCategoryPrice,deleteCategory,
     getCategoriesForBrand, getAllCategories,addSale,  getSales, addPurchase, getPurchases,getBrandWisePerformance };
