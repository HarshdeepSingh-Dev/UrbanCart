const express = require('express');
const router = express.Router();
const cartRoutes = require('./CartRoutes');
const userRoutes = require('./userRoutes');

router.get('/',(req,res)=>{
    res.send("Backend for E-commerce App");
})

// redirect request to cart routes
router.use('/cart',cartRoutes);

// redirect request to user routes
router.use('/user',userRoutes);

module.exports = router;