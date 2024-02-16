const express = require("express");
const router = express.Router();
const EventDetails = require("../models/EventDetailsModel");
const UserEvent = require("../models/UserEventsModel");
const QRCode = require("../models/QRModel");
const authenticateToken = require("../middlewares/authenticateToken");
const qr = require("qr-image"); // npm install qr-image --save



// Generate QR code for an existing event
router.post(
  "/generate-qr/:keyAppEventId/:keyConductedUserId",
  authenticateToken,
  async (req, res) => {
    try {
      const { keyAppEventId, keyConductedUserId } = req.params;

      // Find the event details
      const eventDetails = await EventDetails.findOne({ keyAppEventId });
      if (!eventDetails) {
        return res.status(404).json({
          message: "Event not found",
          status: "error",
        });
      }

      // Generate QR code with event details
      const qrData = JSON.stringify({
        keyAppEventId,
        keyConductedUserId,
      });
      const qrCode = qr.image(qrData, { type: "png" });

      // Save the QR code with event details
      const qrCodeEntry = new QRCode({
        keyAppEventId,
        keyConductedUserId,
        keyQrCode: qrCode.toString("base64"),
      });

      await qrCodeEntry.save();

      return res.status(201).json({
        message: "QR code generated successfully",
        status: "success",
        data: qrCodeEntry,
      });
    } catch (error) {
      console.error("Error generating QR code:", error);
      return res.status(500).json({
        message: "Internal Server Error",
        status: "error",
      });
    }
  }
);


// User scans a QR code
router.post('/scan-qr/:keyAppUserId', authenticateToken, async (req, res) => {
    try {
        const { scannedQRData } = req.body;
        const keyAppUserId = req.params.keyAppUserId;

        // Parse the scanned QR data
        const parsedQRData = JSON.parse(scannedQRData);

        // Retrieve the QR code entry
        const qrCodeEntry = await QRCode.findOne({
            keyAppEventId: parsedQRData.keyAppEventId,
        });

        if (!qrCodeEntry) {
            return res.status(404).json({
                message: 'QR code not found',
                status: 'error',
            });
        }

        // Validate the scanned user with the conducted user in the QR code
        if (keyAppUserId !== qrCodeEntry.keyConductedUserId) {
            return res.status(401).json({
                message: 'Unauthorized: Scanned user does not match the conducted user',
                status: 'error',
            });
        }

        // Check if the user has already attended the event
        const userEvent = await UserEvent.findOne({
            keyAppUserId,
            'events.keyAppEventId': parsedQRData.keyAppEventId,
        });

        if (!userEvent) {
            // If not attended, add the user to the attendees
            await UserEvent.findOneAndUpdate(
                { keyAppUserId },
                {
                    $push: {
                        events: {
                            keyAppEventId: parsedQRData.keyAppEventId,
                            eventType: 'Attended',
                        },
                    },
                }
            );

            // Add the user to the QR code entry's attendees
            qrCodeEntry.keyAttendees.push(keyAppUserId);
            await qrCodeEntry.save();

            return res.json({
                message: 'User attended the event successfully',
                status: 'success',
                data: parsedQRData,
            });
        } else {
            return res.status(400).json({
                message: 'User has already attended the event',
                status: 'error',
            });
        }
    } catch (error) {
        console.error('Error scanning QR code:', error);
        return res.status(500).json({
            message: 'Internal Server Error',
            status: 'error',
        });
    }
});


module.exports = router;
