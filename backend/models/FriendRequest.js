const mongoose = require("mongoose");

const friendRequestSchema = new mongoose.Schema(
  {
    from: String,
    to: String,

    status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("FriendRequest", friendRequestSchema);