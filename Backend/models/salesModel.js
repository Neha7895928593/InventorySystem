const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const saleSchema = new Schema({
 
  brand: {
    type: String,
    required:true
    
  },
  category: {
    type: String,
   
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
},{ timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);
