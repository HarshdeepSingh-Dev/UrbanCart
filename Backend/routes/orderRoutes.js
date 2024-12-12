const orderController = require('../controllers/orderController');
const express = require('express');
const passport = require('passport');
const jwt = require('../config/passport-jwt-strategy');

const router = express.Router();

// if order payment successfully
router.post('/verifyPayment',passport.authenticate('jwt',{session:false}),
    orderController.verifyPayment
)

// get all orders of user
router.get('/getOrders',passport.authenticate('jwt', {session:false}),
    orderController.getOrders
);

module.exports = router;