const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/thumbnails/002/553/976/small/delivery-cargo-service-logistic-cardboard-box-and-mail-post-line-style-icon-free-vector.jpg",
    },
    creator: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema, "PostDB");
