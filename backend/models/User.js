const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  userId: { type: String, unique: true },
  email: String,
  dob: String,
  password: String,

  description: {
    type: String,
    default: "No bio yet ✨"
  },

  profileImage: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model("User", userSchema);