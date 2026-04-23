const Story = require("../models/Story");
const FriendRequest = require("../models/FriendRequest");
const fs = require("fs");

// CREATE STORY
exports.createStory = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!req.file) return res.status(400).json({ message: "Image is required" });

    const story = await Story.create({
      userId,
      image: req.file.path
    });

    res.json(story);
  } catch (err) {
    console.error("createStory error:", err);
    res.status(500).json({ message: "Error creating story" });
  }
};

// GET STORIES (friends + self) with user details
exports.getStories = async (req, res) => {
  const { userId } = req.params;

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

  const allUsers = [...friendIds, userId];

  const stories = await Story.aggregate([
    {
      $match: {
        userId: { $in: allUsers }
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "userId",
        as: "user"
      }
    },
    {
      $unwind: "$user"
    },
    {
      $project: {
        userId: 1,
        image: 1,
        createdAt: 1,
        profileImage: "$user.profileImage",
        name: "$user.name"
      }
    },
    {
      $sort: { createdAt: -1 }
    }
  ]);

  res.json(stories);
};

// DELETE STORY
exports.deleteStory = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const story = await Story.findById(id);

    if (!story) {
      return res.status(404).json({ message: "Story not found ❌" });
    }

    if (story.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized ❌" });
    }

    if (story.image) {
      fs.unlink(story.image, (err) => {
        if (err) console.log("Image delete error:", err);
      });
    }

    await Story.findByIdAndDelete(id);

    res.json({ message: "Story deleted ✅" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting story" });
  }
};