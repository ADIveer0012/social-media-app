const express = require("express");
const router = express.Router();
const post = require("../models/post");

/* CREATE POST */
router.post("/", async (req, res) => {
  try {
    const { userId, caption, image } = req.body;
    if (!userId || !image)
      return res.status(400).json({ message: "User and image required" });

    const post = await Post.create({ user: userId, caption, image });
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* GET ALL POSTS */
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username profilePic")
      .populate("comments.user", "username")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* LIKE / UNLIKE POST */
router.put("/like/:id", async (req, res) => {
  try {
    const { userId } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.likes.includes(userId)) post.likes.pull(userId);
    else post.likes.push(userId);

    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* ADD COMMENT */
router.post("/comment/:id", async (req, res) => {
  try {
    const { userId, text } = req.body;
    if (!userId || !text)
      return res.status(400).json({ message: "User and text required" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ user: userId, text });
    await post.save();

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
