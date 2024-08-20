const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    id: {type:Number, required:true},
    name:{type:String, required:true},
    price:{type:Number, required:true},
    description:{type:String, required:true},
    image:{type:String, required:true}
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;