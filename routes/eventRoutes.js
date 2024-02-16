const express = require("express");
const router = express.Router();
const EventDetails = require("../models/EventDetailsModel");
const UserEvents = require("../models/UserEventsModel");
const authenticateToken = require("../middlewares/authenticateToken");
const fnGenerateAppId = require("../utils/fnGenerateAppId");
const UserEvent = require("../models/UserEventsModel");

// Create a new event
router.post(
  "/create-event/:keyAppUserId",
  authenticateToken,
  async (req, res) => {
    try {
      const {
        keyEventName,
        keyVenue,
        keyStartTime,
        keyEndTime,
        keyCreatedBy,
        keyTags,
        keyAttended,
      } = req.body;

      const newEventId = fnGenerateAppId("cinEvt", 8);

      const newEvent = new EventDetails({
        keyAppEventId: newEventId,
        keyEventName,
        keyVenue,
        keyStartTime,
        keyEndTime,
        keyCreatedBy: req.params.keyAppUserId,
        keyTags,
      });

      // Create a new entry in UserEvent for the user
      const newUserEvent = new UserEvent({
        keyAppUserId: req.params.keyAppUserId,
        keyEvents: [
          {
            keyAppEventId: newEventId,
            keyEventType: keyAttended ? "Attended" : "Conducted", // Assuming the user conducting the event
          },
        ],
      });

      const savedEvent = await newEvent.save();
      const savedEventForUser = await newUserEvent.save();

      return res.status(201).json({
        message: "Event created successfully",
        status: "success",
        data: savedEvent,
      });
    } catch (error) {
      console.error("Error creating event:", error);
      return res.status(500).json({
        message: "Internal Server Error",
        status: "error",
      });
    }
  }
);

// Get event details by keyAppEventId
router.get("/get-event/:keyAppEventId", authenticateToken, async (req, res) => {
  try {
    const keyAppEventId = req.params.keyAppEventId;

    // const eventDetails = await EventDetails.findOne({ keyAppEventId }).populate(
    //   "keyCreatedBy",
    //   "keyUsername"
    // ); // Assuming you want to populate the createdBy field with the username from the User model

    const eventDetails = await EventDetails.findOne({ keyAppEventId });

    if (!eventDetails) {
      return res.status(404).json({
        message: "Event not found",
        status: "error",
      });
    }

    return res.json({
      message: "Event details retrieved successfully",
      status: "success",
      data: eventDetails,
    });
  } catch (error) {
    console.error("Error getting event details:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      status: "error",
    });
  }
});

// Get all events
router.get("/get-allEvents", authenticateToken, async (req, res) => {
  try {
    const events = await EventDetails.find({});

    return res.json({
      message: "Events retrieved successfully",
      status: "success",
      data: events,
    });
  } catch (error) {
    console.error("Error getting events:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      status: "error",
    });
  }
});

// Update event details
router.put(
  "/update-event/:keyAppEventId",
  authenticateToken,
  async (req, res) => {
    try {
      const keyAppEventId = req.params.keyAppEventId;
      const {
        keyEventName,
        keyVenue,
        keyStartTime,
        keyEndTime,
        keyCreatedBy,
        keyTags,
      } = req.body;

      const updatedEvent = await EventDetails.findOneAndUpdate(
        { keyAppEventId },
        {
          $set: {
            keyEventName,
            keyVenue,
            keyStartTime,
            keyEndTime,
            keyCreatedBy,
            keyTags,
          },
        },
        { new: true }
      );

      if (!updatedEvent) {
        return res.status(404).json({
          message: "Event not found",
          status: "error",
        });
      }

      return res.json({
        message: "Event details updated successfully",
        status: "success",
        data: updatedEvent,
      });
    } catch (error) {
      console.error("Error updating event details:", error);
      return res.status(500).json({
        message: "Internal Server Error",
        status: "error",
      });
    }
  }
);

// Get all attended and conducted events by user
router.get("/user-events/:keyAppUserId", async (req, res) => {
  try {
    const keyAppUserId = req.params.keyAppUserId;

    // const userEvents = await EventDetails.find({ keyAppUserId }).populate(
    //   "events.keyEventId",
    //   "keyEventName keyVenue keyStartTime keyEndTime"
    // );
    const userEvents = await UserEvent.find({ keyAppUserId });

    return res.json({
      message: "User events retrieved successfully",
      status: "success",
      data: userEvents,
    });
  } catch (error) {
    console.error("Error getting user events:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      status: "error",
    });
  }
});

// Delete event
router.delete(
  "/delete-event/:keyAppEventId",
  authenticateToken,
  async (req, res) => {
    try {
      const keyAppEventId = req.params.keyAppEventId;

      const deletedEvent = await EventDetails.findOneAndDelete({
        keyAppEventId,
      });

      if (!deletedEvent) {
        return res.status(404).json({
          message: "Event not found",
          status: "error",
        });
      }

      return res.json({
        message: "Event deleted successfully",
        status: "success",
        data: deletedEvent,
      });
    } catch (error) {
      console.error("Error deleting event:", error);
      return res.status(500).json({
        message: "Internal Server Error",
        status: "error",
      });
    }
  }
);

module.exports = router;
