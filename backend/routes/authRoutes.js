const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  register,
  login,
  search,
  getProfile,
  updateProfile,
  uploadProfileImage
} = require("../controllers/authController");

// multer setup
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// auth
router.post("/register", register);
router.post("/login", login);

// search
router.get("/search", search);

// profile
router.get("/profile/:userId", getProfile);
router.put("/profile/update", updateProfile);
router.post("/profile/upload", upload.single("image"), uploadProfileImage);

module.exports = router;