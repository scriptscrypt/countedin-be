const jwt = require("jsonwebtoken");
const { ENV_JWT_SECRET } = require("../config/secrets");
require("dotenv").config();

// Middleware to verify JWT and populate req.user
const authenticateToken = (req, res, next) => {
  // const token = req.headers["authorization"]; // Assuming the token is included in the 'Authorization' header

  // Since the token is included in the 'Authorization' header as a `Bearer` + token,
  // we split the token string into an array and verify the token itself
  // Thank you to this StackOverflow post for the `.split(' ')` tip
  // https://stackoverflow.com/questions/48606341/jwt-gives-jsonwebtokenerror-invalid-token
  
  const token = req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, ENV_JWT_SECRET, (err, user) => {
    console.log(user);
    if (err) {
      console.log(err);
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = user; // Set req.user to the decoded user information
    next();
  });
};

module.exports = authenticateToken;
