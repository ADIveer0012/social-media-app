// backend/routes/users.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/post");
const auth = require("../middleware/auth");

/* FOLLOW USER */
router.put("/follow/:id", auth, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.userId);
    if (!userToFollow || !currentUser) return res.status(404).json({ message: "User not found" });

    if (!currentUser.following.includes(userToFollow._id)) {
      currentUser.following.push(userToFollow._id);
      userToFollow.followers.push(currentUser._id);
      await currentUser.save();
      await userToFollow.save();
    }

    res.json({ message: "Followed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* UNFOLLOW USER */
router.put("/unfollow/:id", auth, async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.userId);
    if (!userToUnfollow || !currentUser) return res.status(404).json({ message: "User not found" });

    currentUser.following.pull(userToUnfollow._id);
    userToUnfollow.followers.pull(currentUser._id);

    await currentUser.save();
    await userToUnfollow.save();

    res.json({ message: "Unfollowed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET PROFILE BY ID */
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("followers", "username")
      .populate("following", "username");

    if (!user) return res.status(404).json({ message: "User not found" });

    const posts = await Post.find({ user: user._id });

    res.json({ user, posts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
