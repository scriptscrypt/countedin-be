const express = require("express");
const router = express.Router();

const User = require("../models/UserModel");
const authenticateToken = require("../middlewares/authenticateToken");
const fnGeneratePin = require("../utils/fnGeneratePin");
// Set up pin
router.post("/setup", authenticateToken, async (req, res) => {
  try {
    const { ipKeyAppUserId, ipPin } = req.body;
    const user = await User.findOneAndUpdate(
      { keyAppUserId: ipKeyAppUserId },
      { $set: { keyPin: ipPin } }
    );
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", status: "error" });
    }
    return res.json({ message: "Pin set up successfully", status: "success" });
  } catch (error) {
    console.error("Error setting up pin:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", status: "error" });
  }
});

// Validate pin
router.post("/validate", async (req, res) => {
  try {
    const { ipKeyAppUserId, ipPin } = req.body;
    const user = await User.findOne({
      keyAppUserId: ipKeyAppUserId,
      keyPin: ipPin,
    });
    if (user) {
      return res.json({ message: "Pin is valid", status: "success" });
    } else {
      return res.status(401).json({ message: "Invalid pin", status: "error" });
    }
  } catch (error) {
    console.error("Error validating pin:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", status: "error" });
  }
});

// Regenerate pin
router.post("/regenerate", async (req, res) => {
  try {
    const { ipKeyAppUserId } = req.body;
    const newPin = fnGeneratePin("",4);
    const user = await User.findOneAndUpdate(
      { keyAppUserId: ipKeyAppUserId },
      { $set: { keyPin: newPin } }
    );
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", status: "error" });
    }
    return res.json({
      message: "Pin regenerated successfully",
      status: "success",
      pin: newPin,
    });
  } catch (error) {
    console.error("Error regenerating pin:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", status: "error" });
  }
});

module.exports = router;
