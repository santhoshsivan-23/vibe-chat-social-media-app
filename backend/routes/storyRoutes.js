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

const upload = multer({ storage });

// routes
router.post("/story", upload.single("image"), createStory);
router.get("/stories/:userId", getStories);
router.delete("/story/:id", deleteStory);

module.exports = router;