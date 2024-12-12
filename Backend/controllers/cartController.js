require('dotenv').config();
const User = require('../models/userSchema');
const Cart = require('../models/cartSchema');
const Product = require('../models/productSchema');
const Orders = require('../models/ordersSchema');
const Razorpay = require('razorpay');

// controller for add to cart
module.exports.addToCart = async function(req,res){
    try {
        // Check if the product already exists in the database
        let product = await Product.findOne({ id: req.body.id });
        console.log(req.body);
        // If not, create a new product
        if (!product) {
            product = await Product.create({
                id: req.body.id,
                name: req.body.title,
                price: req.body.price,
                description: req.body.description,
                image: req.body.images[0]
            });
        };
        const userId = req.user._id;
        const user = await User.findById(userId);

        // if user not found send res
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ error: "User not found" });
        };
        let cart = await Cart.findOne({ user: user._id });

        // if cart not found create a new one
        if (!cart) {
            // Create a new cart if the user doesn't have one
            cart = await Cart.create({
                user: user._id,
                products: [{ product: product._id, quantity: 1 }]
            });
        }else{
            // Check if the product is already in the cart
            const cartItem = cart.products.find(item => item.product.equals(product._id));
            if (cartItem) {
                // If the product is found, increase the quantity
                cartItem.quantity += 1;
            } else {
                // If the product is not found, add it to the cart
                cart.products.push({ product: product._id, quantity: 1 });
            }
        }
         // Save the updated cart
         await cart.save();
        res.status(200).json({message: "Added to cart successfully!!",product});
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message:"Failed to add product to cart!!",
            error:error
        });
    }
};

// get products from carts
module.exports.getProducts = async function(req, res){
    try {
        const userId = req.user._id;
        // find the user's cart
        const userCart = await Cart.findOne({user:userId});
        if(!userCart||userCart.products.length===0){
            return res.status(200).json([]);
        }
        // get the products in the cart and their quantity
        const cartProducts = await Promise.all(
            userCart.products.map(async (item)=>{
            const product = await Product.findById(item.product);
            return {product,
                    quantity:item.quantity
                };
        }));
        return res.status(200).json(cartProducts);
        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message:"Failed to get products!!",
            error:error
        });
    }
};


// remove product from cart
module.exports.removeProduct = async function(req,res){
    try {
        const userId = req.user._id;
        const product = req.body;

        // find the user's cart
        const userCart = await Cart.findOne({user:userId});

        // if cart not found
        if(!userCart||userCart.products.length===0){
            return res.status(200).json([]);
        }

        // find index of that product
        const productIndex = userCart.products.findIndex(item=>item.product.toString()===product.product._id.toString());
        if (productIndex === -1) {
            return res.status(404).json({ message: "Product not found in the cart" });
        }

        // remove that product
        userCart.products.splice(productIndex, 1);
        await userCart.save();
        
        return res.status(200).json({ message: "Product removed successfully", product:product.product });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message:"Failed to remove product!!",
            error:error
        });
    }
};

// increase qty in cart
module.exports.increaseQty = async function(req,res) {
    try {
        const userId = req.user._id;
        const product = req.body;

        // get cart of user
        const userCart = await Cart.findOne({user:userId});

        // if cart not found
        if(!userCart||userCart.products.length===0){
            return res.status(200).json([]);
        }
        // get that product from products array
        const selectedProduct = userCart.products.find(item=>item.product.toString()===product.product._id.toString());
        selectedProduct.quantity+=1;

        await userCart.save();
        return res.status(200).json({ message: "Quantity increased", product:product.product});
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message:"Failed to increase quantity!!",
            error:error
        });
    }
};

// decrease qty in cart
module.exports.decreaseQty = async function(req,res){
    try{
        const userId = req.user._id;
        const product = req.body;

        // get cart of user
        const userCart = await Cart.findOne({user:userId});
        
        // if cart not found
        if(!userCart||userCart.products.length===0){
            return res.status(200).json([]);
        }
        // get that product from products array
        const selectedProduct = userCart.products.find(item=>item.product.toString()===product.product._id.toString());
        
        if(selectedProduct.quantity>1){
            selectedProduct.quantity-=1;
            await userCart.save();
            return res.status(200).json({ message: "Quantity decreased", product:product.product});
        }

        return res.status(400).json({message:"This is minimum quantity!!"});
       
    }catch(error){
        console.log(error);
        res.status(400).json({
            message:"Failed to decrease quantity!!",
            error:error
        });
    }
};

// purchase cart items
module.exports.purchase = async function(req,res) {
        // creating new razorpay instance
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        try{
            const userId = req.user._id;
            const cartProducts = req.body;

            const options = {
                 // amount will be calculated in smallest unit (paise INR)
                amount: Math.round(cartProducts.reduce((total, item) => total + item.product.price * item.quantity, 0) * 100),
                currency: "INR",
                // to create unique receipt with each order
                receipt: `receipt_${userId.toString().slice(0,10)}_${Date.now()}`
            };

            console.log(options.amount);

            const order = await razorpay.orders.create(options);

            res.status(200).json({
                message:'Order created',
                orderId:order.id,
                amount:options.amount
            });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred during the purchase process" });
    }

}