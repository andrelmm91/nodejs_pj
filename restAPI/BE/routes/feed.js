const express = require("express");
const router = express.Router();
const feedController = require("../controllers/feed");
const { body } = require("express-validator"); //validator

// GET / feed/posts
router.get("/posts", feedController.getPosts);
// POST / feed/posts
router.post(
  "/posts",
  [
    body("title")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Title must be at least 6 characters long"),
    body("content")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Content must be at least 6 characters long"),
  ],
  feedController.createPosts
);

module.exports = router;
