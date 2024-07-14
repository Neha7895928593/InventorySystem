const Client=require('../models/client.js')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
  
  // Function for client login
  const clientLogin = async (req, res) => {
    try {
      const { client_id, password } = req.body;
      
      const client = await Client.findOne({ client_id });
      if (!client) {
        return res.status(401).json({ success: false, message: 'Invalid username or password' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, client.password);
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: 'Invalid username or password' });
      }
  
      const token = jwt.sign({ id: client._id }, process.env.SECRET_KEY, { expiresIn: '2d' });
      return res.status(200).json({ success: true, message: 'Client logged in successfully', token });
    } catch (error) {
      console.error('Error in client login:', error);
      return res.status(500).json({ success: false, message: 'An error occurred' });
    }
  };
 


//changeclientpassword



const changeClientPassword = async (req, res) => {
  try {
    const  id = req.params.id;
    const { oldPassword, newPassword } = req.body;

    if (!id|| !oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Client ID, old password, and new password are required' });
    }

    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, client.password);
    if (!isOldPasswordValid) {
      return res.status(400).json({ success: false, message: 'Invalid old password' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    client.password = hashedNewPassword;
    await client.save();

    return res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error in changing password:', error);
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
};

  module.exports = { clientLogin,changeClientPassword};
  