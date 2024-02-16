const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
    keyAppEventId: {
        type: mongoose.Schema.Types.String,
        ref: 'EventDetails',
        required: true,
    },
    keyConductedUserId: {
        type: mongoose.Schema.Types.String,
        ref: 'User',
        required: true,
    },
    keyAttendees: [{
        type: mongoose.Schema.Types.String,
        ref: 'User',
    }],
    keyQrCode: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const QRCode = mongoose.model('QRCode', qrCodeSchema);

module.exports = QRCode;
