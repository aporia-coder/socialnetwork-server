const dotenv = require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");
const path = require("path");
const auth = require("./middleware/auth");
const port = process.env.PORT;

const User = require("./models/Users");
const Scream = require("./models/Scream");

// Connecting to database
const connection = mongoose.connect(
  process.env.URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  () => {
    console.log("Connected to Database");
  },
);

// Initialize server
const app = express();

// Routes / Middleware
app.use("/api/public", express.static("public"));
app.use(express.json());
app.use("/api/screams", require("./routes/screams"));
app.use("/api/users", require("./routes/users"));

// Server connection
app.listen(port, () => {
  console.log(`Server connected to port ${port}`);
});

// TO DO LIST

// users can sign up even if passwords dont match
// handle usernames with capital letters,
// check which controller function i need to order comments in
// add profile image to comments through auth middleware req.user.profileImage
// Might have to call validate functions to get errors from models
// add general errors in typography above the button on login/signup
// do notifications
// CLIENT
// give generic homepage when there are no screams
// change white background color of text fields
// make signup/login styles globally available in theme, in new file and import it so it dosnt take up as much space on component files
// implement progress bar from traversy tutorial on uploading images
// set proptypes
// Make sure redux store contains likes
// Clear errors redux dosnt work
// implement authentication on homepage

// ERRORS TO FIX
// username/ email already exists
