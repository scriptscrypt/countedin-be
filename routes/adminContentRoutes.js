// const express = require('express');
// const router = express.Router();
// const Content = require('../models/contentsModel');
// const isAdmin = require("../middlewares/isAdmin");
// const passport = require('passport');
// const fnGenerateTapId = require("../utils/fnGenerateAppId");
// const User = require('../models/UserModel');


// // Create a new content post
// router.post('/newcontent', passport.authenticate('jwt', { session: false }), isAdmin , async (req, res) => {
//   const {
//     ipTitle, 
//     ipTags,
//     ipContentUrl,
//     ipContentType,
//     ipDescription,
//     ipPlatform,
//     // ipAuthor, // Assuming this is the user ID of the author
//     // ... Other data you might need
//   } = req.body;

//   try {
//     const newContent = new Content({
//       keyTapContentId : fnGenerateTapId("tapContent", 24),
//       keyTitle: ipTitle,
//       keyTags: ipTags,
//       keyContentUrl: ipContentUrl,
//       keyContentType: ipContentType,
//       keyDescription: ipDescription,
//       keyPlatform: ipPlatform,
//       keyAuthor: req.user.keyTapUserId,
//       // author: ipAuthor,
//       // ... Set other fields here
//     });

//     await newContent.save();

//     res.status(201).json({ message: 'New content post created successfully' });

//   } catch (error) {
//     console.error('Error creating new content:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// module.exports = router;
