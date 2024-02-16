const mongoose = require("mongoose");

const eventDetailsSchema = new mongoose.Schema(
  {
    keyAppEventId: {
      type: String,
      required: true,
    },
    keyEventName: {
      type: String,
      required: true,
    },
    keyVenue: {
      type: String,
      required: true,
    },
    keyStartTime: {
      type: Date,
      required: true,
    },
    keyEndTime: {
      type: Date,
      required: true,
    },
    keyCreatedBy: {
      type: mongoose.Schema.Types.String,
      ref: "User",
      required: true,
    },
    keyTags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const EventDetails = mongoose.model("EventDetails", eventDetailsSchema);

module.exports = EventDetails;
