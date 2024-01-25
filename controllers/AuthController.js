// authController.js

const nodemailer = require("nodemailer");
const { ENV_EMAIL_ADDRESS, ENV_EMAIL_PASSWORD } = require("../config/secrets");

function sendMagicLinkEmail(email, token) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: `${ENV_EMAIL_ADDRESS}`,
      pass: `${ENV_EMAIL_PASSWORD}`,
    },
  });
  
  const magicLink = `http://localhost:3000/auth/magic-link/${token}`;

  const mailOptions = {
    from: ENV_EMAIL_ADDRESS,
    to: email,
    subject: "Magic Link Authentication",
    text: `Click on the following link to log in: ${magicLink}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending magic link email:", error);
    } else {
      console.log("Magic link email sent:", info.response);
    }
  });
}

module.exports = {
  sendMagicLinkEmail,
};
