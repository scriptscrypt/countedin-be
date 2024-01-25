const passport = require("passport");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const User = require("../models/UserModel");
const { ENV_JWT_SECRET } = require("../config/secrets");
require("dotenv").config();

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: ENV_JWT_SECRET, // Use the actual secret key value
    },
    async (jwtPayload, done) => {
      try {
        const user = await User.find({ keyAppUserId: jwtPayload.sub });
        if (user) {
          console.log("user found");
          console.log(user);
          return done(null, user);
        } else {
          console.log("user not found");
          return done(null, false);
        }
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

const isAdmin = (req, res, next) => {
  console.log(req.user);

  // Check if the user is authenticated and has the 'admin' role
  if (req.isAuthenticated() && req.user[0].keyIsAdmin) {
    // if (req.isAuthenticated()) {
    return next(); // User is an admin, proceed to the next middleware/route
  }

  res.status(403).json({ message: "Access denied. You are not an admin." });
};

module.exports = isAdmin;
