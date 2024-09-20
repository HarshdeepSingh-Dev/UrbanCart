require('dotenv').config();
const User = require('../models/userSchema');
const Cart = require('../models/cartSchema');
const Product = require('../models/productSchema');
const Orders = require('../models/ordersSchema');

// controller for add to cart
module.exports.addToCart = async function(req,res){
    try {
        // Check if the product already exists in the database
        let product = await Product.findOne({ id: req.body.id });

        // If not, create a new product
        if (!product) {
            product = await Product.create({
                id: req.body.id,
                name: req.body.name,
                price: req.body.price,
                description: req.body.description,
                image: req.body.image
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
    try {
       
        const userId = req.user._id;
        const cartProducts = req.body;

        let userOrders = await Orders.findOne({user:userId});
        
        if(!userOrders){
            userOrders = new Orders({
                user:userId,
                orderItems:[
                    {
                        orderDate:Date.now(),
                        items: cartProducts.map(item=>(
                                    {
                                        product:item.product._id,
                                        quantity:item.quantity
                                    }
                                ))
                    }
                ]
            });
        }
        else{
            userOrders.orderItems.push({
                orderDate:Date.now(),
                items:cartProducts.map(item=>(
                        {product:item.product._id, quantity:item.quantity}
                    ))
            })
         
        };

        await userOrders.save();

        // after items purchased clear that user's cart
        await Cart.findOneAndUpdate(
            {user:userId},
            {products:[]}
        );

        return res.status(200).json({message:'Order successfull',orderdItems:cartProducts});
    } catch (error) {
        console.log(error);
    }
}