const express = require("express");
const fileUpload = require("express-fileupload");
const auth = require("../middleware/auth");
const router = express.Router();

// @route /api/users

// Add controllers here
const {
  findUsers,
  findUser,
  createUser,
  loginUser,
  uploadImage,
  addUserDetails,
} = require("../controllers/userController");

router.route("/signup").post(createUser);
router.route("/login").post(loginUser);

// Middleware

router.use("/", auth);
router.use(
  "/image",
  fileUpload({
    limits: { fileSize: 16777216 },
  }),
);

// Filesize is limited to 16mb in binary

// Protected Routes

router.route("/").get(findUsers);
router.route("/user").get(findUser);
router.route("/image").post(uploadImage);
router.route("/").post(addUserDetails);

module.exports = router;
