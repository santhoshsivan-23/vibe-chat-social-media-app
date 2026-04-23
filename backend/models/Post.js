const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userId: String,

    image: String,
    text: String,

    likes: [
      { type: String } // store userId
    ],

    comments: [
      {
        userId: String,
        text: String
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);