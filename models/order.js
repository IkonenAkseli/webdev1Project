const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    // for 'name' 
    // set type
    // and the following validators:
    // required, trim, minlength, maxlength 
    customerId: {
      type: String,
      required: true,
      
    },
    items : [
        {
            product : {
                _id: String,
                name: String,
                price: Number,
                description: String
            },
            quantity: Number
        }
    ]
  });

orderSchema.set('toJSON', { virtuals: false, versionKey: false });

const Order = new mongoose.model('Order', orderSchema);
module.exports = Order;