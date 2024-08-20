const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/E-commerce');

const db = mongoose.connection;
db.on('error',(error)=>{
    console.error("MongoDB Connection error:",error);
});

db.once('open',()=>{
    console.log('Connected to MongoDB');
});

db.on('disconnected', () => {
    console.log('Disconnected from MongoDB');
});

module.exports = db;