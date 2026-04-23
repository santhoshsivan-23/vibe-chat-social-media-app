const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  userId: String,

  image: String,

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // auto delete after 24 hours
  }
});

module.exports = mongoose.model("Story", storySchema);