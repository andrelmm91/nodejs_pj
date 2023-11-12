const { validationResult } = require("express-validator"); //validator

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
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({ errors: error.array() });
  }
  const title = req.body.title;
  const content = req.body.content;
  //create db
  res.status(201).json({
    message: "ok!",
    post: {
      _id: new Date().toISOString(),
      title: title,
      content: content,
      creator: { name: "And" },
      createdAt: new Date(),
    },
  });
};
