const mongoose = require("mongoose");

const securityInfoSchema = new mongoose.Schema({
  keyAppUserId: {
    type: String,
    required: true,
    unique: true,
  },
  keyPin: {
    type: String,
    required: true,
  },
  keyPasskey: {
    type: String,
    required: true,
  },
});

const SecurityInfo = mongoose.model("SecurityInfo", securityInfoSchema);

module.exports = SecurityInfo;
