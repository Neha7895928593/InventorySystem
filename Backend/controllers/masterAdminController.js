const MasterAdmin = require('../models/masterAdmin');
const Client = require('../models/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const generateId = (prefix) => {
  const randomDigits = Math.floor(1000 + Math.random() * 9000); 
  return `${prefix}-${randomDigits}`;
};

const masterAdminLogin = async (req, res) => {
  try {
    const { master_admin_id, password } = req.body;
    const masterAdmin = await MasterAdmin.findOne({ master_admin_id });
    if (!masterAdmin) {
      return res.status(400).json({ success: false, message: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, masterAdmin.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: masterAdmin._id }, process.env.SECRET_KEY, { expiresIn: '2d' });

    return res.status(200).json({ success: true, message: 'Master admin logged in successfully', token });
  } catch (error) {
    console.error('Error in master admin login:', error);
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
};

// Function for adding client
const addClient = async (req, res) => {
  try {
    const { clientCode, budget, availableBudget, allotedBudget, status, brokerageType, brokerage, username, password } = req.body;

    // Check if client code already exists
    const existingClient = await Client.findOne({ client_code: clientCode });
    if (existingClient) {
      return res.status(400).json({ success: false, message: 'Client code already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate client ID
    const client_id = generateId(username);

    // Get the master admin ID from the authenticated user
    const master_admin_id = req.user._id;

    // Create a new client
    const newClient = new Client({
      client_id,
      master_admin_id,
      client_code: clientCode,
      budget,
      availableBudget,
      allotedBudget,
      status,
      brokerage_type: brokerageType,
      brokerage,
      username,
      password: hashedPassword,
    });

    
    await newClient.save();

    // Update MasterAdmin's clients array
    const updatedMasterAdmin = await MasterAdmin.findByIdAndUpdate(
      master_admin_id,
      { $push: { clients: newClient._id } },
      { new: true }
    );

    if (!updatedMasterAdmin) {
      return res.status(404).json({ success: false, message: 'MasterAdmin not found' });
    }

    return res.status(201).json({ success: true, message: 'Client created successfully', newClient });
  } catch (error) {
    console.error('Error in client creation:', error);
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
};

// Function for updating client
const updateClient = async (req, res) => {
  try {
    const clientId = req.params.id.trim(); 
    const updateData = req.body;
   


    const updatedClient = await Client.findByIdAndUpdate(clientId, updateData, { new: true });
    if (!updatedClient) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    return res.status(200).json({ success: true, message: 'Client updated successfully', updatedClient });
  } catch (error) {
    console.error('Error in updating client:', error);
    return res.status(500).json({ success: false, message: 'An error occurred', error: error.message });
  }
};



// Function for deleting client
const deleteClient = async (req, res) => {
  try {
    const clientId  = req.params.id.trim();

    const deletedClient = await Client.findByIdAndDelete(clientId);
    if (!deletedClient) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    return res.status(200).json({ success: true, message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error in deleting client:', error);
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
};



//changemasteradmin password

const changeMasterAdminPassword = async (req, res) => {
  try {
    const  masterAdminId  = req.params.id; 
  
    const { oldPassword, newPassword } = req.body;
    

    const masterAdmin = await MasterAdmin.findById(masterAdminId);
    if (!masterAdmin) {
      return res.status(404).json({ success: false, message: 'MasterAdmin not found' });
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, masterAdmin.password);
    if (!isOldPasswordValid) {
      return res.status(400).json({ success: false, message: 'Invalid old password' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    masterAdmin.password = hashedNewPassword;
    await masterAdmin.save();

    return res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error in changing password:', error);
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
};



const getClientById = async (req, res) => {
  try {
    const  id = req.params.id.trim();
    const client = await Client.findById(id);

    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    return res.status(200).json({ success: true, client });
  } catch (error) {
    console.error('Error fetching client:', error);
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
};

const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find();

    if (clients.length === 0) {
      return res.status(404).json({ success: false, message: 'No clients found' });
    }

    return res.status(200).json({ success: true, clients });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
};








module.exports = { masterAdminLogin, addClient, getAllClients,
  updateClient, deleteClient , getClientById, changeMasterAdminPassword};
