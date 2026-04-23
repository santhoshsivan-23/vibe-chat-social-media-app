const Message = require("../models/Message");

// SEND MESSAGE
exports.sendMessage = async (req, res) => {
  const { sender, receiver, text, postImage, postText } = req.body;

  const msg = await Message.create({
    sender,
    receiver,
    text,
    postImage,
    postText
  });

  res.json(msg);
};

// GET MESSAGES (with pagination)
exports.getMessages = async (req, res) => {
  const { user1, user2 } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const skip = (page - 1) * limit;

  const messages = await Message.find({
    $or: [
      { sender: user1, receiver: user2 },
      { sender: user2, receiver: user1 }
    ]
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.json(messages);
};