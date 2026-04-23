const User = require("../models/User");
const Post = require("../models/Post");
const fs = require("fs");

// GET /api/profile/:userId
exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ userId }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const posts = await Post.find({ userId }).sort({ createdAt: -1 });

    res.json({ user, posts });
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

// PUT /api/profile/update
exports.updateProfile = async (req, res) => {
  try {
    const { userId, description } = req.body;

    await User.findOneAndUpdate({ userId }, { description });

    res.json({ message: "Profile updated ✅" });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
};

// POST /api/profile/upload
exports.uploadProfileImage = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!req.file) return res.status(400).json({ message: "No image provided" });

    const user = await User.findOne({ userId });

    // Delete old profile image if exists
    if (user.profileImage) {
      fs.unlink(user.profileImage, (err) => {
        if (err) console.log("Old image delete error:", err);
      });
    }

    await User.findOneAndUpdate({ userId }, { profileImage: req.file.path });

    res.json({ message: "Profile image updated ✅", path: req.file.path });
  } catch (err) {
    res.status(500).json({ message: "Error uploading image" });
  }
};
