require('dotenv').config();
const Product = require('../models/productSchema');
const Orders = require('../models/ordersSchema');
const Cart = require('../models/cartSchema');
const crypto = require('crypto');

// verify the order payment is succeed or failed
module.exports.verifyPayment = async function(req, res) {
    try {
        const userId = req.user._id;
        const {orderId, paymentId, signature, cartProducts} = req.body;

        const sha = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
        sha.update(`${orderId}|${paymentId}`);

        const digest = sha.digest("hex");
        if(digest!==signature){
            return res.status(400).json({message:"Transaction is not legit!"});
        }

        // after successful payment clear cart and add orders to orders history

        // find if the user has list of orders
        let userOrders = await Orders.findOne({user:userId});

        // if it doesn't have create a new one
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
        }else{
                // if user has list of orders push new orders to it
                userOrders.orderItems.unshift({
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

        res.status(200).json({
            message: "success",
            orderdItems:cartProducts,
            orderId: orderId,
            paymentId: paymentId
        })

    } catch (error) {
        console.log(error);
        res.status(400).json({
            message:"Failed to verify payment",
            error:error
        });
    }   
}

// get orders of user
module.exports.getOrders = async function(req,res){
    try {
        const userId = req.user._id;

        // find user orders
        const userOrders = await Orders.findOne({user:userId});

        // if not found
        if(!userOrders){
            return res.status(404).json({message:"User orders not found"});
        }

        const orderdItems = userOrders.orderItems;

        if(!orderdItems){
            return res.status(404).json({message:"orderd Items not found"});
        }
        
        // map to the orderdItems array and wait for them to resolve
        const resolvedItems = await Promise.all(orderdItems.map(async (item) => {
            
            // map to the items array that we have in orderdItems array
            const products = await Promise.all(item.items.map(async (product) => {

                // find the product with id from product schema
                const myProduct = await Product.findById(product.product);

                // return the product and quantity
                return {
                    myProduct,
                    quantity: product.quantity
                };
            }));

            // return the product we got and order date 
            return {
                products,
                orderDate: item.orderDate.toDateString()
            };
        }));

        return res.status(200).json({orders:resolvedItems});

    } catch (error) {
        console.log(error);
        res.status(400).json({
            message:"Failed to get user orders!!",
            error:error
        });
    }
}