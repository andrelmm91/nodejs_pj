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
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.createPosts
);

router.get("/post/:postId", feedController.getPost);

router.patch(
  "/posts/:postId",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.updatePost
);

router.delete("/post/:postId", feedController.deletePost);

module.exports = router;
