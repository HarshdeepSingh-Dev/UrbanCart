const cartController = require('../controllers/cartController');
const express = require('express');
const passport = require('passport');
const jwt = require('../config/passport-jwt-strategy');

const router = express.Router();

// add to cart
router.post('/add',passport.authenticate('jwt', {session:false}),
    cartController.addToCart
);

// get products from cart
router.get('/allproducts', passport.authenticate('jwt', {session:false}),
    cartController.getProducts
);

// remove product from cart
router.post('/remove', passport.authenticate('jwt', {session:false}),
    cartController.removeProduct
);

// increase product quantity in cart
router.put('/increaseQuantity', passport.authenticate('jwt',{session:false}),
    cartController.increaseQty
);

// decrease product quantity in cart
router.put('/decreaseQuantity', passport.authenticate('jwt',{session:false}),
    cartController.decreaseQty
);

// purchase cart items
router.post('/purchase', passport.authenticate('jwt',{session:false}),
    cartController.purchase
);


module.exports = router;