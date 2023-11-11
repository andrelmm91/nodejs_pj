exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "first",
        content: "first",
        imagesUrl: "images/dog.jpeg",
        creator: {
          name: "And",
        },
        createdAt: new Date(),
      },
    ],
  });
};

exports.createPosts = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  //create db
  res.status(201).json({
    message: "ok!",
    post: { id: new Date().toISOString(), title: title, content: content },
  });
};
