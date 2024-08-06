const dealersModel = require('../models/dealersModel');
const SuperAdmin = require('../models/superAdmin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const superAdminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const superAdmin = await SuperAdmin.findOne({ username });
    if (!superAdmin) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, superAdmin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: superAdmin._id }, process.env.SECRET_KEY, { expiresIn: '7d' });

    return res.json({ success: true, message: 'Super admin logged in successfully', token });
  } catch (error) {
    console.error('Error in super admin login:', error);
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
};

const addDealer = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the dealer already exists
    const existingDealer = await dealersModel.findOne({ email });
    if (existingDealer) {
      return res.status(400).json({ success: false, message: 'Dealer already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new dealer
    const newDealer = new dealersModel({
      email,
      username,
      password: hashedPassword,
      brands: [],
      categories: []
    });

    // Save the new dealer to the database
    await newDealer.save();

    return res.status(201).json({ success: true, message: 'Dealer created successfully', newDealer });
  } catch (error) {
    console.error('Error in dealer creation:', error);
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
};


const getDealerById = async (req, res) => {
  try {
    
    const dealer = await dealersModel.find()

    if (!dealer) {
      return res.status(404).json({ message: 'Dealer not found' });
    }

    res.status(200).json(dealer);
  } catch (error) {
    console.error('Error fetching dealer:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteDealer = async (req, res) => {
  try {
    const { dealerId } = req.params;
    const superAdminId = req.user._id;

    // Find and delete the dealer
    const deletedDealer = await dealersModel.findByIdAndDelete(dealerId);
    if (!deletedDealer) {
      return res.status(404).json({ success: false, message: 'Dealer not found' });
    }

    // Find the superadmin and update their dealers array
    const superAdmin = await SuperAdmin.findById(superAdminId);
    if (!superAdmin) {
      return res.status(404).json({ success: false, message: 'SuperAdmin not found' });
    }

    superAdmin.dealers = superAdmin.dealers.filter(dealer => dealer.toString() !== deletedDealer._id.toString());
    await superAdmin.save();

    return res.json({ success: true, message: 'Dealer deleted successfully' });
  } catch (error) {
    console.error('Error in dealer deletion:', error);
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
};

module.exports = { superAdminLogin, addDealer, deleteDealer, getDealerById };
