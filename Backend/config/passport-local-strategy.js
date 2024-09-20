const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/userSchema');
const { comparePassword } = require('../helper/authHelper');

// authentication using passport
passport.use(new LocalStrategy(
    {
        usernameField:'email'
    },
    async function(email, password, done) {
        try {
            const user = await User.findOne({email});
            if(!user){
                console.log("user not found");
                return done(null, false, { message: 'Incorrect email.' });
            }
            // compare password with hashed password
            const isMatch = await comparePassword(password,user.password);
            if(!isMatch){
                console.log("Incorrect password");
                return done(null, false, { message: 'Incorrect password' });
            } 

            return done(null,user);

        }catch (error) {
            return done(error);
        }

    }
));

// serializing the user
passport.serializeUser(function(user,done){
    done(null,user.id);
});

// deserilizing the user
passport.deserializeUser(function(id,done){
    User.findById(id, function(err,user){
        if(err){
            console.log("Error in finding user-->passport")
            return done(err);
        }

        return done(null, user);
    })
});


module.exports = passport;