const express = require("express");
const auth = require("../../middleware/auth");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route POST api/post
// @desc create a post
// @access Private
router.post(
  "/",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });

      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      console.error(err.message);
      return res.json({ msg: "server error" });
    }
  }
);

// @route GET api/post
// @desc Get all posts
// @access Private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    return res.json(posts);
  } catch (err) {
    console.error(err.message);
    return res.json({ msg: "server error" });
  }
});

// @route GET api/post/:post_id
// @desc Get all posts
// @access Private
router.get("/:post_id", auth, async (req, res) => {
  try {
    const posts = await Post.findById(req.params.post_id);

    if (!posts) {
      return res.status(404).json({ msg: "post not found" });
    }

    return res.json(posts);
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "post not found" });
    }

    return res.json({ msg: "server error" });
  }
});

// @route GET api/post/:post_id
// @desc Get all posts
// @access Private
router.delete("/:post_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized." });
    }

    await post.remove();

    res.json({ msg: "Post removed." });
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "post not found" });
    }
    return res.json({ msg: "server error" });
  }
});

// @route PUT api/post/like/:post_id
// @desc Like a post
// @access Private
router.put("/like/:post_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    // check if post is already liked by a user
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: "post already liked" });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json({ msg: "post liked" });
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "post not found" });
    }
    return res.json({ msg: "server error" });
  }
});

// @route PUT api/post/unlike/:post_id
// @desc unlike a post
// @access Private
router.put("/unlike/:post_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    // check if post is already liked by a user
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      return res.status(400).json({ msg: "post not yet liked" });
    }

    // get remove index
    const removeIndex = await post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);

    await post.likes.splice(removeIndex, 1);

    await post.save();

    res.json({ msg: "post unliked" });
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "post not found" });
    }
    return res.json({ msg: "server error" });
  }
});

// @route POST api/post/comment/:post_id
// @desc Comment on a post
// @access Private
router.post(
  "/comment/:post_id",
  [
    auth,
    [
      check("text", "Need some text")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.post_id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };

      post.comments.unshift(newComment);

      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.error(err.message);

      if (err.kind === "ObjectId") {
        return res.status(404).json({ msg: "post not found" });
      }
      return res.json({ msg: "server error" });
    }
  }
);

// @route DELETE api/post/comment/:post_id/:comment_id
// @desc delete a comment
// @access Private
router.delete("/comment/:post_id/:comment_id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const post = await Post.findById(req.params.post_id);

    // get comment
    const comment = post.comments.find(
      comment => (comment.id = req.params.comment_id)
    );

    // does comment exist
    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    if (comment.user.toString() !== user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    // get remove index
    const removeIndex = await post.comments
      .map(comment => comment.user.toString())
      .indexOf(req.user.id);

    await post.comments.splice(removeIndex, 1);

    await post.save();

    res.json({ msg: "comment deleted." });
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "post not found" });
    }
    return res.json({ msg: "server error" });
  }
});

module.exports = router;
