const userController = require('../controllers/userController');
const express = require('express');
const passport = require('passport');
const jwt = require('../config/passport-jwt-strategy');

const router = express.Router();

router.post('/login',userController.login);

router.post('/signup',userController.signup);

router.get('/authUser',passport.authenticate('jwt', {session:false}),
    function(req, res){
        res.send(req.user);
    }
);

router.post('/signout',userController.signout);

module.exports = router;