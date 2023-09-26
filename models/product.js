const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    // for 'name' 
    // set type
    // and the following validators:
    // required, trim, minlength, maxlength 
    name: {
      type: String,
      required: true,
      unique: true,
      maxLength: 250,
      minLength: 1
    },
    
    // Price, 
    //       
    price: {
        type     : Number,
        required : true,
        unique   : false,
        
    },
    
    // Image
    image: {
      type: String,
      required: true
      
    },

    // Description
    description: {
      type: String,
      required: true
      
    }
  });

productSchema.set('toJSON', { virtuals: false, versionKey: false });

const Product = new mongoose.model('Product', productSchema);
module.exports = Product;