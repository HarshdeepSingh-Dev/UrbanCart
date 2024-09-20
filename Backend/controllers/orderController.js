require('dotenv').config();
const User = require('../models/userSchema');
const Product = require('../models/productSchema');
const Orders = require('../models/ordersSchema');

module.exports.getOrders = async function(req,res){
    try {
        const userId = req.user._id;

        // find user orders
        const userOrders = await Orders.findOne({user:userId});
        console.log(">>>>>",userOrders);

        // if not found
        if(!userOrders){
            return res.status(404).json({message:"Not found"});
        }

        const orderdItems = userOrders.orderItems;
        console.log("orders>>>>>",orderdItems);

        if(!orderdItems){
            return res.status(404).json({message:"Not found"});
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
                orderDate: item.orderDate
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