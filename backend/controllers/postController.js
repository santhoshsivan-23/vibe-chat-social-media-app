const Post = require("../models/Post");
const FriendRequest = require("../models/FriendRequest");
const fs = require("fs");

// CREATE POST
exports.createPost = async (req, res) => {
  try {
    const { userId, text } = req.body;

    const post = await Post.create({
      userId,
      image: req.file?.path,
      text
    });

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Error creating post" });
  }
};

// DELETE POST
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found ❌" });
    }

    if (post.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized ❌" });
    }

    // delete image
    if (post.image) {
      fs.unlink(post.image, (err) => {
        if (err) console.log("Image delete error:", err);
      });
    }

    await Post.findByIdAndDelete(id);

    res.json({ message: "Post deleted ✅" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting post" });
  }
};

// LIKE / UNLIKE
exports.likePost = async (req, res) => {
  const { postId, userId } = req.body;

  const post = await Post.findById(postId);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const alreadyLiked = post.likes.includes(userId);

  if (alreadyLiked) {
    post.likes = post.likes.filter(id => id !== userId);
  } else {
    post.likes.push(userId);
  }

  await post.save();
  res.json(post);
};

// COMMENT
exports.commentPost = async (req, res) => {
  const { postId, userId, text } = req.body;

  const post = await Post.findById(postId);
  if (!post) return res.status(404).json({ message: "Post not found" });

  post.comments.push({ userId, text });

  await post.save();
  res.json(post);
};

// GET FEED
exports.getFeed = async (req, res) => {
  const { userId } = req.params;
  const { limit = 6, exclude = "" } = req.query;

  const excludeIds = exclude ? exclude.split(",") : [];

  // get friends
  const relations = await FriendRequest.find({
    $or: [
      { from: userId, status: "accepted" },
      { to: userId, status: "accepted" }
    ]
  });

  const friendIds = relations.map(r =>
    r.from === userId ? r.to : r.from
  );

  // ONLY FRIEND POSTS
  const posts = await Post.find({
    _id: { $nin: excludeIds },
    userId: { $in: friendIds }
  })
    .sort({ createdAt: -1 })
    .limit(Number(limit));

  res.json(posts);
};