const mongoose=require('mongoose');
const clientSchema = new mongoose.Schema({
    client_id: {
      type: String,
      unique: true
    },
    master_admin_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MasterAdmin',
      
    },
    client_code: {
      type: String,
      required: true,
      unique: true
    },
    budget: {
      type: Number,
      required: true
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
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
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

  }   ,{ timestamps: true } );
  module.exports=mongoose.model('Client',clientSchema)