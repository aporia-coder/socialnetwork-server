const Scream = require("../models/Scream");
const User = require("../models/Users");
const Like = require("../models/Like");
const Comment = require("../models/Comment");

// @route GET /api/screams
// @desc Get all screams
// @access Public
exports.getScreams = async (req, res) => {
  try {
    const screams = await Scream.find().sort({ _id: -1 });
    return res.status(200).json({
      success: true,
      count: screams.length,
      data: screams,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

// @route POST /api/screams
// @desc Post a scream
// @access Private
exports.addScream = async (req, res) => {
  try {
    const user = await User.findOne({ userName: req.user });
    const scream = await Scream.create({
      body: req.body.body,
      userName: req.user,
      profileImage: user.profileImage,
    });
    return res.status(201).json({
      success: true,
      data: scream,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: "Input Error",
    });
  }
};

// @route GET /api/screams/:screamId
// @desc Get individual scream with comments
// @access Public
exports.getScream = async (req, res) => {
  try {
    const screamId = req.params.id;
    const scream = await Scream.findById(screamId);
    if (!scream) {
      return res.status(404).json({
        success: false,
        error: "Scream not found",
      });
    }
    const comments = await Comment.find({ screamId }).sort({
      _id: -1,
    });
    return res.status(200).json({
      success: true,
      data: scream,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

// @desc POST Comment on scream
// @route /api/screams/:screamId/comment/
// @access Private
exports.commentOnScream = async (req, res) => {
  try {
    const screamId = req.params.screamId;
    const scream = await Scream.findById(screamId);
    if (!scream) {
      return res.status(404).json({
        success: false,
        data: "Scream not found",
      });
    }
    const comment = await Comment.create({
      userName: req.user,
      screamId,
      body: req.body.body,
    });
    const comments = await Comment.find({ screamId }).sort({
      _id: -1,
    });
    scream.comments = [];
    comments.forEach((comment) => {
      scream.comments.push(comment);
    });
    scream.commentCount++;
    await scream.save();
    return res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// @desc POST like a scream
// @route /api/screams/:screamId/like
// @access Private
exports.likeScream = async (req, res) => {
  try {
    const screamId = req.params.screamId;
    const scream = await Scream.findById(screamId);
    if (!scream) {
      return res.status(404).json({
        success: false,
        error: "Scream not found",
      });
    }
    const likeDoc = await Like.findOne({
      userName: req.user,
      screamId,
    });
    if (!likeDoc) {
      const like = await Like.create({
        userName: req.user,
        screamId,
      });
      scream.likeCount++;
      await scream.save();
      return res.status(201).json({
        success: true,
        message: "Scream was liked",
        data: like,
      });
    } else {
      return res.status(400).json({
        success: false,
        error: "Scream has already been liked",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc POST unlike a scream
// @route /api/screams/:screamId/unlike
// @access Private
exports.unlikeScream = async (req, res) => {
  try {
    const screamId = req.params.screamId;
    const scream = await Scream.findById(screamId);
    if (!scream) {
      return res.status(400).json({
        success: false,
        error: "Scream not found",
      });
    }
    const likeDoc = await Like.findOne({
      userName: req.user,
      screamId,
    });
    if (!likeDoc) {
      return res.status(404).json({
        success: false,
        error: "Scream not liked",
      });
    }
    scream.likeCount--;
    await scream.save();
    await Like.findOneAndDelete({
      userName: req.user,
      screamId,
    });
    return res.status(200).json({
      success: true,
      message: "Scream was unliked",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc DELETE delete a scream
// @route /api/screams/:screamId
// @access Private
exports.deleteScream = async (req, res) => {
  try {
    const screamId = req.params.screamId;
    const scream = await Scream.findById(screamId);
    if (req.user == scream.userName) {
      await Scream.findByIdAndDelete(screamId, (err) => {
        if (err) {
          return res.status(404).json({
            success: false,
            error: "Scream not found",
          });
        }
      });
      await Like.deleteMany({ screamId });
      await Comment.deleteMany({ screamId });
    } else {
      return res.status(403).json({
        success: false,
        error: "You can only delete your own scream",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Scream deleted",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
