const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema({
  screamId: {
    type: String,
    required: true,
    trim: true,
  },
  userName: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = new mongoose.model("Like", LikeSchema);
