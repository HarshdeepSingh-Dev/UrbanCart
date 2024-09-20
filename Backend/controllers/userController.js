require('dotenv').config();
const passport = require('passport');
const { hashPassword, comparePassword } = require("../helper/authHelper");
const User = require("../models/userSchema");
const JWT = require('jsonwebtoken');

// controller for login the user
module.exports.login = async function(req,res){
        try {
            const {email,password} = req.body;
            // check email and password are there
            if(!email || !password){
                return res.status(404).send({
                    success:false,
                    message:'invalid email or password'
                })
            }
            // find user with email
            const user = await User.findOne({email});

            if(!user){
                return res.status(404).send({
                    success: false,
                    message: "Email is not registerd"
                })
            };
            // check if password match
            const isMatch = await comparePassword(password,user.password);

            if(!isMatch){
                return res.status(401).send({
                    success:false,
                    message:"Invalid password"
                })
            };
            // token
            const token = await JWT.sign({_id:user._id}, process.env.JWT_SECRET, {
                expiresIn:"1d",
            });

            res.status(200).send({
                success:true,
                message:"login successfully",
                user:{
                    name:user.name,
                    email:user.email
                },
                token
            });

        } catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: "Error in login",
                error
            })
        }
};

// controller for creating new user
module.exports.signup = async function(req,res){
    try {
        // Check if the email is already in use
        let existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }
        // hash the password coming from user
        const hashedPassword = await hashPassword(req.body.password);
        
        let user = new User({
            email: req.body.email,
            password: hashedPassword,
            name: req.body.name
        })

        await user.save();
        return res.status(200).json({message:"new user created successfully!!"});
        
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "An error occurred during signup", error });
    }
};

// controller for signout the user
module.exports.signout = async function(req,res) {
    return res.status(200).send({success: true, message: 'Successfully logged out'});     
}