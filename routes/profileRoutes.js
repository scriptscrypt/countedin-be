const express = require("express");
const router = express.Router();
const User = require("../models/UserModel");
const authenticateToken = require("../middlewares/authenticateToken");

router.put("/update/:email", authenticateToken, async (req, res) => {
  try {
    const paramEmail = req.params.email;
    const {
      ipName,
      ipUsername,
      ipPhoneNumber,
      ipUSN,
      ipEmpId,
      ipYearOfStudy,
      ipDepartment,
      ipRole,
    } = req.body;

    updatedValues = {
      keyName: ipName,
      keyUsername: ipUsername,
      keyPhoneNumber: ipPhoneNumber,
      keyUSN: ipUSN,
      keyEmpId: ipEmpId,
      keyYearOfStudy: ipYearOfStudy,
      keyDepartment: ipDepartment,
      keyRole: ipRole,
      keyUpdatedAt: Date.now(),
    };

    // Find the user by email and update only the provided values
    const updatedUser = await User.findOneAndUpdate(
      { keyEmail: paramEmail },
      updatedValues,
      { new: true }
    );

    res
      .status(200)
      .json({ message: "User updated successfully", data: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
