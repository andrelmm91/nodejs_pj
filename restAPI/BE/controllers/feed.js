const { validationResult } = require("express-validator"); //validator
const Post = require("../models/posts");
exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "firstaaaoi",
        content: "first",
        imagesUrl: "images/dog.jpeg",
        creator: { name: "And" },
        createdAt: new Date(),
      },
    ],
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
