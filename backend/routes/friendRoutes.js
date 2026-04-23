const express = require("express");
const router = express.Router();

const {
  sendRequest,
  getRequests,
  acceptRequest,
  getFriends
} = require("../controllers/friendController");

// routes
router.post("/friend/request", sendRequest);
router.get("/friend/requests/:userId", getRequests);
router.post("/friend/accept", acceptRequest);
router.get("/friends/:userId", getFriends);

module.exports = router;