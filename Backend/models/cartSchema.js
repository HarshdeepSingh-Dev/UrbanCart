const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        // reference to the product model
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        // reference to the user model
        ref: 'User',
        required: true
    },
    products: [cartItemSchema]
},{
    timestamps: true
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;