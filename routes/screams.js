const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// @route /api/screams

const {
  getScreams,
  getScream,
  addScream,
  likeScream,
  unlikeScream,
  commentOnScream,
  deleteScream,
} = require("../controllers/screamController");

router.route("/").get(getScreams);
router.route("/:screamId").get(getScream);

// Protected Routes
router.use("/", auth);
router.route("/").post(addScream);
router.route("/:screamId/like").post(likeScream);
router.route("/:screamId/unlike").post(unlikeScream);
router.route("/:screamId/comment").post(commentOnScream);
router.route("/:screamId").delete(deleteScream);

module.exports = router;
