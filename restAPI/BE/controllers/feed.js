const { validationResult } = require("express-validator"); //validator
const Post = require("../models/posts");
const fs = require("fs");
const path = require("path");

exports.getPosts = (req, res, next) => {
  //pagination
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  Post.find()
    .countDocuments()
    .then((numItems) => {
      totalItems = numItems;
      return Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((posts) => {
      // return status code 200 and the fetched posts
      res.status(200).json({
        message: "successfully fecthed the posts.",
        posts: posts,
        totalItems: totalItems,
      });
    })
    .catch((err) => {
      // handle errors
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      err.message = "Error loading it.";
      next(err);
    });
  // // fetch all posts from database WITHOUT pagination
  // Post.find()
  //   .then((posts) => {
  //     // return status code 200 and the fetched posts
  //     res
  //       .status(200)
  //       .json({ message: "successfully fecthed the posts.", posts: posts });
  //   })
  //   .catch((err) => {
  //     // handle errors
  //     if (!err.statusCode) {
  //       err.statusCode = 500;
  //     }
  //     err.message = "Error loading it.";
  //     next(err);
  //   });
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
  // validate image
  if (!req.file) {
    const err = new Error("No file uploaded!");
    err.statusCode = 422;
    throw err;
  }
  // retrieve post data
  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.file.path.replace("\\", "/");
  // create new post
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
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

exports.updatePost = (req, res, next) => {
  // Validate the input
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const err = new Error("validation failed, entered data is incorrect.");
    err.statusCode = 422;
    throw err;
  }
  // Get the postId from the URL and the other fields from the body
  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  // If an image file was uploaded, use its path instead of the previous imageUrl
  req.file ? (imageUrl = req.file.path) : (imageUrl = req.body.image);
  // Ensure an image URL is provided
  if (!imageUrl) {
    const err = new Error("Please provide an image URL");
    err.statusCode = 422;
    throw err;
  }
  // Update the post in the database
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const err = new Error("No post found");
        error.statusCode(404);
        throw err;
      }
      // if (imageUrl !== post.imageUrl) {
      //   clearImage(post.imageUrl);
      // }
      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Post updated!", post: result });
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

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlike(filePath, (err) => console.log(err));
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  console.log("postId", postId);
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const err = new Error("No post found");
        error.statusCode(404);
        throw err;
      }
      //check user
      // clearImage(post.imageUrl);
      return Post.findByIdAndDelete(postId).then((result) => {
        res.status(200).json({ message: "Post deleted", result: result });
      });
    })
    .catch((err) => {
      // If an error occurred, check if it has a status code
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      // Modify the error message
      err.message = "Error delete post.";
      // Pass the error to the next middleware function
      next(err);
    });
};
