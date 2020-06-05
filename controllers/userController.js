const User = require("../models/Users");
const dotenv = require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

// @route GET /api/users
// @desc Find all users
// @access Private
exports.findUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @route GET /api/users/user
// @desc Get a authenticated particular user
// @access Private
exports.findUser = async (req, res) => {
  try {
    const user = await User.findOne({ userName: req.user });
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    return res.status(404).json({
      success: false,
      error: "User does not exist / not logged in",
    });
  }
};

// @route POST /api/users/signup
// @desc Register user
// @access Public
exports.createUser = async (req, res) => {
  try {
    const { userName, password, email } = req.body;

    const user = await User.create({
      userName: userName.toLowerCase(),
      email,
      password,
    });
    user.profileImage = "/public/blank.png";
    user.save();

    jwt.sign(
      { id: user.userName },
      process.env.JWT_KEY,
      { expiresIn: "1hr" },
      (err, token) => {
        if (err) throw err;
        return res.status(201).json({
          success: true,
          data: user,
          token,
        });
      },
    );
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

// @route POST /api/users/login
// @desc Login user
// @access Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        error: "User does not exist",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: "Incorrect Password",
      });
    }

    // jwt takes a payload, secret key, expiration and a callback

    jwt.sign(
      { id: user.userName },
      process.env.JWT_KEY,
      { expiresIn: "1hr" },
      (err, token) => {
        if (err) throw err;
        return res.status(200).json({
          success: true,
          message: "User successfully logged in",
          token,
        });
      },
    );
  } catch (err) {
    res.status(500).json({
      succcess: false,
      error: "Server Error",
    });
  }
};

// @route POST /api/users/
// @desc Add user details
// @access Private
exports.addUserDetails = async (req, res) => {
  try {
    const user = await User.findOne({ userName: req.user });
    const { bio, website, location } = req.body;
    if (bio) user.bio = bio;
    if (website) {
      if (website.substring(0, 4) !== "http") {
        user.website = `http://${website.trim()}`;
      } else {
        user.website = website;
      }
    }
    if (location) {
      let locationArr = location.split("");
      user.location =
        locationArr[0].toUpperCase() + locationArr.slice(1).join("");
    }
    await user.save();
    return res.status(201).json({
      success: true,
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @route POST /api/users/image
// @desc Uploads profile image
// @access Private
exports.uploadImage = async (req, res) => {
  try {
    const user = await User.findOne({ userName: req.user });
    if (!req.files) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    let file = req.files.file;
    if (file.mimetype !== "image/jpeg") {
      return res.status(400).json({
        error: "File must be a JPEG or JPG image",
      });
    }
    file.name = Date.now() + file.name;
    const filePath = path.join(__dirname, `../public/${file.name}`);
    user.profileImage = `/public/${file.name}`;
    // use path package to define URL to image
    // Make sure to set files key in headers
    await user.save();
    file.mv(filePath, (err) => {
      console.log(err);
    });
    return res.status(201).json({
      success: true,
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
