
  var mongoose = require('mongoose');
  
  var productSchema = new mongoose.Schema({
      name: String,
      features: Array,
      price: Number,
      isSoulbound: Boolean,
      image : String,
      createdAt: {
        type: Date,
        default: Date.now
    }
  });
    
    
  module.exports = new mongoose.model('Product', productSchema);