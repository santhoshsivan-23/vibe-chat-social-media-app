const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: String,
    receiver: String,

    text: String,

    // for sharing post inside chat
    postImage: String,
    postText: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);