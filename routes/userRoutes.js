const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const User = require("../models/UserModel");
const { sendMagicLinkEmail } = require("../controllers/AuthController");
const fnGenerateAppId = require("../utils/fnGenerateAppId");
const {
  JWT_SECRET,
  ENV_JWT_SECRET,
  ENV_BE_LOCAL_URL,
  ENV_EMAIL_ADDRESS,
  ENV_EMAIL_PASSWORD,
} = require("../config/secrets");
const passport = require("../config/passportconfig");
const { requireAuth } = require("../middlewares/isAuthenticated");

// User Registration
router.post("/register", async (req, res) => {
  // console.log(req.body);

  const { ipEmail, ipPassword } = req.body;

  console.log("Register route started");
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ keyEmail: ipEmail });

    if (existingUser) {
      return res.status(409).json({ message: "Username/Email already exists" });
    } else {
      // Generate a salt with 10 rounds of salt generation
      const salt = await bcrypt.genSalt(10);

      // Hash the password with the generated salt
      const hashedPassword = await bcrypt.hash(ipPassword, salt);

      console.log("Hashed Password:", hashedPassword);

      // Create a new user with the hashed password
      // Left - keys are from the database model
      // Right - keys are from the request body

      const newUser = new User({
        keyAppUserId: fnGenerateAppId("countedinUser", 16), // user + 16 random characters
        keyUsername: ipEmail,
        keyEmail: ipEmail,
        keyPassword: hashedPassword,
      });

      await newUser.save();

      // console.log(username, hashedPassword);
      res.status(201).json({ message: "User registered successfully" });
      return res;
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }

  console.log("Register route ended");
});

// User login
router.post("/login", async (req, res) => {
  const { ipEmail, ipPassword } = req.body;
  console.log(ipEmail);
  try {
    // Check if the user exists
    const user = await User.findOne({ keyEmail: ipEmail });
    console.log(user);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Authentication failed: Email not found" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(ipPassword, user.keyPassword);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Authentication failed: Passwords match failed" });
    }

    // Generate JWT token
    // sub
    console.log(user.keyAppUserId);
    const token = jwt.sign({ sub: user.keyAppUserId }, ENV_JWT_SECRET, {
      expiresIn: "4d",
    });
    // localStorage.setItem("bearertoken", token);
    res
      .status(200)
      .json({ message: "Authentication successful", email: ipEmail, token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Forgot password
router.post("/forgotpassword", async (req, res) => {
  const { ipEmail } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ keyEmail: ipEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a JWT token for password reset
    const token = jwt.sign({ sub: user._id }, ENV_JWT_SECRET, {
      expiresIn: "15m",
    });

    // Create the reset link
    const resetLink = `${ENV_BE_LOCAL_URL}/resetpassword?token=${token}`;

    // Send the reset link to the user's email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: `${ENV_EMAIL_ADDRESS}`,
        pass: `${ENV_EMAIL_PASSWORD}`,
      },
    });

    const mailOptions = {
      from: `${ENV_EMAIL_ADDRESS}`,
      to: user.keyEmail,
      subject: "Password Reset Link",
      html: `<p>Please click the following link to reset your password:</p><p>${resetLink}</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Error sending email" });
      }
      console.log("Email sent:", info.response);
      res
        .status(200)
        .json({ message: "Password reset link sent successfully" });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Check if the token is valid &&
// Reset password
router.post("/resetpassword/:token", async (req, res) => {
  console.log("Reset Password Route");

  const { token } = req.params;
  const { ipPassword } = req.body;

  try {
    // Verify the token
    jwt.verify(token, ENV_JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      // Find the user by ID (decoded.sub)
      const user = await User.findById(decoded.sub);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(ipPassword, 10);

      // Update the user's password in the database
      user.keyPassword = hashedPassword;
      await user.save();

      res.status(200).json({ message: "Password updated successfully" });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// MAGIC LINK AUTH
router.post("/magic-link", async (req, res) => {
  const { ipEmail } = req.body;

  // Generate a JWT token
  const token = jwt.sign({ sub: ipEmail }, ENV_JWT_SECRET, {
    expiresIn: "10m",
  }); // Set expiration time

  const user = await User.findOne({ keyEmail: ipEmail });

  console.log(user);
  if (!user) {
    const newUser = new User({
      keyAppUserId: fnGenerateAppId("appUser", 16), // tapUser + 16 random characters
      keyUsername: ipEmail,
      keyEmail: ipEmail,
    });

    await newUser.save();
  }

  // Send the magic link to the user's email
  sendMagicLinkEmail(ipEmail, token);

  res.json({ message: "Magic link sent successfully", token, email: ipEmail });
});

router.get("/magic-link/:token", requireAuth, (req, res) => {
  console.log("Magic Link Route");
  console.log(req.user);

  // Generate new JWT
  const newToken = jwt.sign({ sub: req.user.keyEmail }, ENV_JWT_SECRET, {
    expiresIn: "15m",
  });
  res
    .status(200)
    .json({ message: "User authenticated successfully", newToken });
});
module.exports = router;
