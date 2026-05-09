const express = require("express");
const router = express.Router();

const {
  createStory,
  getStories,
  deleteStory
} = require("../controllers/storyController");

const multer = require("multer");

// multer setup
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image and video files are allowed"), false);
    }
  }
});

// routes
router.post("/story", upload.single("media"), createStory);
router.get("/stories/:userId", getStories);
router.delete("/story/:id", deleteStory);

module.exports = router;