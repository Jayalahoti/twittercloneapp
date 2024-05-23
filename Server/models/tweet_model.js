// Tweet Model
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

// Defining the Tweet schema
const tweetSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    tweetedBy: {
      type: ObjectId,
      ref: "UserModel", // posted by
    },
    likes: [
      {
        type: ObjectId,
        ref: "UserModel", // likedby
      },
    ],
    retweetBy: [
      {
        type: ObjectId,
        ref: "UserModel", // retweet
      },
    ],
    image: {
      type: String,
      default: null, 
    },
    comments: [
      {
        type: ObjectId,
        ref: "TweetModel", 
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TweetModel", tweetSchema); // Exporting Tweet Model