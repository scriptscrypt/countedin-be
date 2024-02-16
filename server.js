const express = require("express");
const passport = require("passport");
const app = express();
const PORT = 3000;
const connectDB = require("./config/dbconfig");
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");
const securityRoutes = require("./routes/appSecurityInfoRoutes");
const eventRoutes = require("./routes/eventRoutes");
const bodyParser = require("body-parser");
const cors = require("cors"); 
require("dotenv").config();
// Connect to the MongoDB database
connectDB();

app.get("/", (req, res) => {
  res.send("Try accessing our server lol!");
});

// app.use(cors());
// app.use(cors({
//   origin: ["http://127.0.0.1:3000" ,"http://localhost:3000", "https://tap-be.vercel.app", "https://tap-fe.vercel.app", "http://127.0.0.1:5173/"], // Replace with your frontend URL
// }));

// app.use(cors({
//   origin: "http://127.0.0.1:5173" || "http://localhost:5173" || "https://tap-fe.vercel.app", // Replace with your frontend URL
// }));

app.use(
  cors({
    origin: "*",
  })
);

// Body parser middleware
app.use(express.json());

// Parse incoming JSON request bodies
app.use(bodyParser.json());
// Initialize Passport and use it as middleware
app.use(passport.initialize());

// Include the user routes
app.use("/auth", userRoutes);
app.use("/profile", profileRoutes);
app.use("/security", securityRoutes);
app.use("/event", eventRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
