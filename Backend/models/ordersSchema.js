const mongoose = require('mongoose');

// Schema for individual ordered items
const orderdItemSchema = new mongoose.Schema({
    product:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    quantity:{
        type: Number,
        required: true,
        min: 1
    }
});

// Schema for the entire order
const orderSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    orderItems:[
        {
            orderDate:{
                type:Date,
                default:Date.now
            },
            items:[orderdItemSchema]
        }
    ]

},{
    timestamps:true
});

const Orders = mongoose.model('Order', orderSchema);
module.exports = Orders;