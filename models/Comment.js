const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    screamId: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: [true, "Please enter a comment"],
      trim: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Comment", CommentSchema);
