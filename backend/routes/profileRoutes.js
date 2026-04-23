const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  getProfile,
  updateProfile,
  uploadProfileImage
} = require("../controllers/profileController");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

router.get("/profile/:userId", getProfile);
router.put("/profile/update", updateProfile);
router.post("/profile/upload", upload.single("image"), uploadProfileImage);

module.exports = router;
