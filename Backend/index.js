const express = require('express');
const cors = require('cors');
const router = require('./routes/homeRoutes');
const db = require('./config/mongoose');
const app = express();
const port = 8000;

// for secure communication between client and server
app.use(cors());

// to parse incoming request with json payloads
app.use(express.json());

app.use('/',router);

app.listen(port, ()=>{
    console.log(`server is running on port::${port}`);
});