
const MasterAdmin=require('../models/masterAdmin')
const SuperAdmin=require('../models/superAdmin')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const generateId = (username) => {
  const randomDigits = Math.floor(1000 + Math.random() * 9000); 
  return `${username}-${randomDigits}`;
};



const superAdminLogin = async (req, res) => {
  try {
    const { super_admin_id, password } = req.body;

    const superAdmin = await SuperAdmin.findOne({ super_admin_id });
    if (!superAdmin) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, superAdmin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: superAdmin._id }, process.env.SECRET_KEY, { expiresIn: '2d' });

    return res.json({ success: true, message: 'Super admin logged in successfully', token });
  } catch (error) {
    console.error('Error in super admin login:', error);
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
};




// Function for add master admin 
 

const addMasterAdmin = async (req, res) => {
  try {
    const {
      username, password, budget, availableBudget, allotedBudget ,
      status, masterCode, brokerageType, brokerage, clientLimit
    } = req.body;

    // Check if master admin code already exists
    const existingMasterAdmin = await MasterAdmin.findOne({ master_code: masterCode });
    if (existingMasterAdmin) {
      return res.status(400).json({ success: false, message: 'MasterAdmin code already exists' });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const masterAdminId = generateId(username);
    const super_admin_id =req.user._id;

    const superAdmin = await SuperAdmin.findOne({});
    if (!superAdmin) {
      return res.status(404).json({ success: false, message: 'SuperAdmin not found' });
    }

    // Ensure master_admins array is initialized
    if (!superAdmin.master_admins) {
      superAdmin.master_admins = [];
    }

    

  
    const newMasterAdmin = new MasterAdmin({
      master_admin_id: masterAdminId,
      super_admin_id:super_admin_id,
      username,
      password: hashedPassword,
      budget,
      availableBudget,
      allotedBudget,
      status,
      master_code: masterCode,
      brokerage_type: brokerageType,
      brokerage,
      client_limit: clientLimit
    });

    // Save the new master admin to the database
    await newMasterAdmin.save();
    
    // Update MasterAdmin's clients array
    superAdmin.master_admins.push(newMasterAdmin._id);
   
    await superAdmin.save();
    

    return res.status(201).json({ success: true, message: 'Master admin created successfully', newMasterAdmin });
  } catch (error) {
    console.error('Error in master admin creation:', error);
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
};

const updateMasterAdmin = async (req,res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;


    const updatedMasterAdmin = await MasterAdmin.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedMasterAdmin) {
      return  res.status(400).json({ success: false, message: 'MasterAdmin not found' });
    }
    return res.status(201).json({ success: true, message: 'MasterAdmin updated successfully', updatedMasterAdmin });
  } catch (error) {
    console.error('Error in updating MasterAdmin:', error);
    return  res.status(500).json( { success: false, message: 'An error occurred' });
  }
};

// Delete MasterAdmin
const deleteMasterAdmin = async (req,res) => {

  try {
    const id = req.params.id;

    const deletedMasterAdmin = await MasterAdmin.findByIdAndDelete(id);
    if (!deletedMasterAdmin) {
      return res.status(400).json({ success: false, message: 'MasterAdmin not found' });
    }
    return  res.status(201).json ({ success: true, message: 'MasterAdmin deleted successfully' });
  } catch (error) {
    console.error('Error in deleting MasterAdmin:', error);
    return   res.status(500).json({ success: false, message: 'An error occurred' });
  }
};




const getSuperAdminWithMasterAdmins = async (req, res) => {
  try {
    const superAdmin = await SuperAdmin.findOne({}).populate('master_admins');
    if (!superAdmin) {
      return res.status(404).json({ success: false, message: 'SuperAdmin not found' });
    }
    return res.status(200).json({ success: true, superAdmin });
  } catch (error) {
    console.error('Error fetching super admin:', error);
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
};


const getMasterAdminWithClients = async (req, res) => {
  try {
    const  id  = req.params.id; 
    console.log(id)

    // Find the MasterAdmin by ID and populate the clients array
    const masterAdmin = await MasterAdmin.findById(id).populate('clients');

    if (!masterAdmin) {
      return res.status(404).json({ success: false, message: 'MasterAdmin not found' });
    }

    return res.status(200).json({ success: true, masterAdmin });
  } catch (error) {
    console.error('Error fetching MasterAdmin with clients:', error);
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
};

const getAllMasterAdminsWithClients = async (req, res) => {
  try {
    const masterAdmins = await MasterAdmin.find().populate('clients');

    if (!masterAdmins) {
      return res.status(404).json({ success: false, message: 'No MasterAdmins found' });
    }

    return res.status(200).json({ success: true, masterAdmins });
  } catch (error) {
    console.error('Error fetching MasterAdmins with clients:', error);
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
}






module.exports = {superAdminLogin ,addMasterAdmin,updateMasterAdmin,getMasterAdminWithClients,
  getAllMasterAdminsWithClients,deleteMasterAdmin,getSuperAdminWithMasterAdmins};
