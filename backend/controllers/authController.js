const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  const { name, userId, email, dob, password } = req.body;

  const userExists = await User.findOne({ userId });
  if (userExists) return res.status(400).json({ message: "User exists" });

  const hashed = await bcrypt.hash(password, 10);

  await User.create({
    name,
    userId,
    email,
    dob,
    password: hashed
  });

  res.json({ message: "Registered ✅" });
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    $or: [{ email }, { userId: email }]
  });

  if (!user) return res.status(400).json({ message: "Invalid" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign(
    { userId: user.userId },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    token,
    user: {
      userId: user.userId,
      name: user.name
    }
  });
};

// SEARCH
exports.search = async (req, res) => {
  const { query } = req.query;

  const users = await User.find({
    $or: [
      { name: { $regex: query, $options: "i" } },
      { userId: { $regex: query, $options: "i" } }
    ]
  }).select("name userId");

  res.json(users);
};

// GET PROFILE
exports.getProfile = async (req, res) => {
  const user = await User.findOne({ userId: req.params.userId });

  if (!user) {
    return res.status(404).json({ message: "User not found ❌" });
  }

  const posts = await Post.find({ userId: req.params.userId });

  res.json({ user, posts });
};

// UPDATE DESCRIPTION
exports.updateProfile = async (req, res) => {
  const { userId, description } = req.body;

  const user = await User.findOneAndUpdate(
    { userId },
    { description },
    { new: true }
  );

  res.json(user);
};

// UPLOAD PROFILE IMAGE
exports.uploadProfileImage = async (req, res) => {
  const { userId } = req.body;

  const user = await User.findOneAndUpdate(
    { userId },
    { profileImage: req.file.path },
    { new: true }
  );

  res.json(user);
};