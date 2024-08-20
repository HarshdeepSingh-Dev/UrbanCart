const Product = require('../models/productSchema');

module.exports.addToCart = async function(req,res){
    try {
        const product = new Product({
            id:req.body.id,
            name:req.body.name,
            price:req.body.price,
            description:req.body.description,
            image:req.body.image
        });

        await product.save()
        .then(()=>{
            res.status(201).json({
                message: "Product added to Cart!"
            });
        }
    )
    } catch (error) {
        res.status(400).json({
            error:error
        });
    }
}