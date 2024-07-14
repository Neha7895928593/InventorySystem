const mongoose = require('mongoose');

const masterAdminSchema = new mongoose.Schema({
  master_admin_id: {
    type: String,
    unique: true
  },
  super_admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SuperAdmin',
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  budget: {
    type: Number,
    required: true
  },
  master_code: {
    type: String,
    required: true,
    unique: true
  },
  brokerage_type: {
    type: String,
    enum: ['per_crore', 'per_sauda'],
    required: true
  },
  brokerage: {
    type: Number,
    required: true
  },
  client_limit: {
    type: Number,
    required: true
  },
  allotedBudget: {
    type: Number,
    required: true
  },
  availableBudget: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive', 'suspended'], 
    default: 'active'
  },
  clients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    default:[]
  }]
});

module.exports = mongoose.model('MasterAdmin', masterAdminSchema);
