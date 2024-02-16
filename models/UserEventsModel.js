const mongoose = require("mongoose");

const userEventSchema = new mongoose.Schema(
  {
    keyAppUserId: {
      type: mongoose.Schema.Types.String,
      ref: "User",
      required: true,
    },
    keyEvents: [
      {
        keyAppEventId: {
          type: mongoose.Schema.Types.String,
          ref: "EventDetails",
          required: true,
        },
        keyEventType: {
          type: String,
          enum: ["Conducted", "Attended"],
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const UserEvent = mongoose.model("UserEvent", userEventSchema);

module.exports = UserEvent;
