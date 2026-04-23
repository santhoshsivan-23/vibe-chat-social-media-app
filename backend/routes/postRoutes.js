const express = require("express");
const router = express.Router();

const {
  createPost,
  deletePost,
  likePost,
  commentPost,
  getFeed
} = require("../controllers/postController");

const multer = require("multer");

// multer setup
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// routes
router.post("/post", upload.single("image"), createPost);
router.delete("/post/:id", deletePost);
router.post("/post/like", likePost);
router.post("/post/comment", commentPost);
router.get("/feed/:userId", getFeed);

module.exports = router;