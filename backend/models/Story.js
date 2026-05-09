const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  userId: String,

  image: String,

  type: {
    type: String,
    enum: ["image", "video"],
    default: "image"
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // auto delete after 24 hours
  }
});

module.exports = mongoose.model("Story", storySchema);