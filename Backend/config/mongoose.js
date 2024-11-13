const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_ADDRESS);

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