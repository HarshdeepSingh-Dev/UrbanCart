require('dotenv').config();
const port = process.env.PORT;
const express = require('express');
const cors = require('cors');
const app = express();
const router = require('./routes/homeRoutes');
const db = require('./config/mongoose');
const passport = require('passport');
const session = require('express-session');
const passportLocal = require('./config/passport-local-strategy');



// for secure communication between client and server
app.use(cors());

// to parse incoming requests
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(session({
    name:"e-commerce",
    secret:process.env.SESSION_SECRET,
    saveUninitialized:true,
    resave:false,
    cookie:{
        maxAge:(1000 * 60 * 100),
        secure:false
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/',router);

app.listen(port, ()=>{
    console.log(`server is running on port::${port}`);
});