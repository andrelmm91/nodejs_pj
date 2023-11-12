const { validationResult } = require("express-validator"); //validator
const Post = require("../models/posts");

exports.getPosts = (req, res, next) => {
  // fetch all posts from database
  Post.find()
    .then((posts) => {
      // return status code 200 and the fetched posts
      res
        .status(200)
        .json({ message: "successfully fecthed the posts.", posts: posts });
    })
    .catch((err) => {
      // handle errors
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      err.message = "Error loading it.";
      next(err);
    });
};

exports.createPosts = (req, res, next) => {
  // regular function... we must use throw err
  // validate input
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const err = new Error("validation failed, entered data is incorrect.");
    err.statusCode = 422;
    throw err;
  }
  // retrieve post data
  const title = req.body.title;
  const content = req.body.content;
  // create new post
  const post = new Post({
    title: title,
    content: content,
    creator: { name: "And" },
  });
  // save post to database
  post
    .save()
    .then((results) => {
      console.log(results);
      res.status(201).json({
        message: "post created successfully.",
        post: results,
      });
    })
    // syncronouos function... we cannot use throw err, next(err) is the correct way.
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      err.message = "Error saving it.";
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  // Extract postId from params
  const postId = req.params.postId;
  // Find post by ID using the Promise API
  Post.findById(postId)
    .then((post) => {
      // If no post found, throw an error
      if (!post) {
        const err = new Error("could not find post.");
        err.statusCode = 404;
        throw err;
      }
      // If post found, return success status with the post
      res.status(200).json({
        message: "successfully fetched post.",
        post: post,
      });
    })
    .catch((err) => {
      // If an error occurred, check if it has a status code
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      // Modify the error message
      err.message = "Error loading post.";
      // Pass the error to the next middleware function
      next(err);
    });
};
