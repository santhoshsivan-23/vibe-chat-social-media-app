const FriendRequest = require("../models/FriendRequest");
const User = require("../models/User");

// SEND REQUEST
exports.sendRequest = async (req, res) => {
  const { fromUserId, toUserId } = req.body;

  if (fromUserId === toUserId) {
    return res.status(400).json({ message: "Cannot add yourself" });
  }

  const exists = await FriendRequest.findOne({
    from: fromUserId,
    to: toUserId
  });

  if (exists) {
    return res.status(400).json({ message: "Already requested" });
  }

  await FriendRequest.create({
    from: fromUserId,
    to: toUserId
  });

  res.json({ message: "Friend request sent ✅" });
};

// GET REQUESTS
exports.getRequests = async (req, res) => {
  const requests = await FriendRequest.find({
    to: req.params.userId,
    status: "pending"
  });

  res.json(requests);
};

// ACCEPT REQUEST
exports.acceptRequest = async (req, res) => {
  const { fromUserId, toUserId } = req.body;

  await FriendRequest.findOneAndUpdate(
    { from: fromUserId, to: toUserId },
    { status: "accepted" }
  );

  res.json({ message: "Friend added ✅" });
};

// GET FRIENDS LIST
exports.getFriends = async (req, res) => {
  const userId = req.params.userId;

  const relations = await FriendRequest.find({
    $or: [
      { from: userId, status: "accepted" },
      { to: userId, status: "accepted" }
    ]
  });

  const friendIds = relations.map(r =>
    r.from === userId ? r.to : r.from
  );

  const friends = await User.find({
    userId: { $in: friendIds }
  }).select("name userId profileImage");

  res.json(friends);
};