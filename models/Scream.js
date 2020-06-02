const mongoose = require("mongoose");

const ScreamsSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: false,
      trim: true,
    },
    profileImage: {
      type: String,
      required: false,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    comments: {
      type: Array,
      required: false,
    },
    likeCount: {
      type: Number,
      required: false,
      default: 0,
    },
    commentCount: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Scream", ScreamsSchema);
