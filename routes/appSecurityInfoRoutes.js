const express = require("express");
const router = express.Router();

const SecurityInfo = require("../models/SecurityInfoModel");
const authenticateToken = require("../middlewares/authenticateToken");
const fnGeneratePin = require("../utils/fnGeneratePin");

// Set up pin
router.post("/setup-pin", authenticateToken, async (req, res) => {
  try {
    const { ipKeyAppUserId, ipPin } = req.body;
    const user = await SecurityInfo.findOneAndUpdate(
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
router.post("/validate-pin", authenticateToken, async (req, res) => {
  try {
    const { ipKeyAppUserId, ipPin } = req.body;
    const user = await SecurityInfo.findOne({
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
router.post("/regenerate-pin", authenticateToken, async (req, res) => {
  try {
    const { ipKeyAppUserId } = req.body;
    const newPin = fnGeneratePin("", 4);
    const user = await SecurityInfo.findOneAndUpdate(
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

// Generate Passkey
router.post("/generate-passkey", authenticateToken, async (req, res) => {
  try {
    const { ipKeyAppUserId } = req.body;
    const newPasskey = fnGeneratePin("", 6); // Implement a function to generate a new passkey
    const securityInfo = await SecurityInfo.findOneAndUpdate(
      { keyAppUserId: ipKeyAppUserId },
      { $set: { keyPasskey: newPasskey } },
      { upsert: true, new: true }
    );
    return res.json({
      message: "Passkey generated successfully",
      status: "success",
      passkey: newPasskey,
    });
  } catch (error) {
    console.error("Error generating Passkey:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", status: "error" });
  }
});

// Validate Passkey
router.post("/validate-passkey", authenticateToken, async (req, res) => {
  try {
    const { ipKeyAppUserId, ipPasskey } = req.body;
    const securityInfo = await SecurityInfo.findOne({
      keyAppUserId: ipKeyAppUserId,
      keyPasskey: ipPasskey,
    });
    if (securityInfo) {
      return res.json({ message: "Passkey is valid", status: "success" });
    } else {
      return res
        .status(401)
        .json({ message: "Invalid Passkey", status: "error" });
    }
  } catch (error) {
    console.error("Error validating Passkey:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", status: "error" });
  }
});

module.exports = router;
