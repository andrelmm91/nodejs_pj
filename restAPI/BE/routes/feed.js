const express = require("express");
const router = express.Router();
const { body } = require("express-validator"); //validator

const feedController = require("../controllers/feed");
const isAuth = require("../middleware/is-auth");

// GET / feed/posts
router.get("/posts", isAuth, feedController.getPosts);

// POST / feed/posts
router.post(
  "/posts",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.createPosts
);

router.get("/post/:postId", isAuth, feedController.getPost);

router.patch(
  "/posts/:postId",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.updatePost
);

router.delete("/post/:postId", isAuth, feedController.deletePost);

module.exports = router;
