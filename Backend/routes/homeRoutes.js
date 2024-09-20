const express = require('express');
const cartRoutes = require('./CartRoutes');
const userRoutes = require('./userRoutes');
const orderRoutes = require('./orderRoutes');

const router = express.Router();


router.get('/',(req,res)=>{
    res.json({ message: "Backend for E-commerce App", status: "OK" });
})

// redirect request to cart routes
router.use('/cart',cartRoutes);

// redirect request to user routes
router.use('/user',userRoutes);

// redirect request to order routes
router.use('/orders', orderRoutes);


module.exports = router;