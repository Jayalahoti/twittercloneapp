// get, create, like or dislike, reply, retweet
const mongoose = require("mongoose");
const TweetModel = mongoose.model("TweetModel");

//get all tweets by user
exports.getUserTweets = async (req, res) => {
    try {
        const userTweets = await TweetModel.find({ tweetedBy: req.params.id }).sort({
          createdAt: -1,
        });
        res.status(200).json(userTweets);
      } catch (error) {
        console.error("Error: ", error);
        res.status(500).json({error:"An error occurred. Please try again later."});
      }
}

// Create a Tweet
exports.createTweet = async (req, res) => {
  try {
    const { content, image } = req.body;
    if (!content) {
      return res.status(400).json({ error: "Content cannot be empty" });
    }
    const tweet = new TweetModel({
      content: content,
      image: image,
      tweetedBy: req.user._id,
    });
    await tweet.save();
    res.status(201).json({ result: tweet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Some error occurred" });
  }
};

// Like & Dislike Tweet
exports.likeDislike = async (req, res) => {
  const tweetId = req.params.id;
  try {
    const tweet = await TweetModel.findById(tweetId);
    if (!tweet) {
      return res.status(404).json({ error: "Tweet not found" });
    }
    const userId = req.user.id;
    const hasLiked = tweet.likes.includes(userId);
    const query = hasLiked
      ? { $pull: { likes: userId }}
      : { $push: { likes: userId } };
    const updatedTweet = await TweetModel.findByIdAndUpdate(
      tweetId,
      query,
      { new: true }
    ).populate("tweetedBy", "_id username")
      .exec();
    res.json(updatedTweet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while updating the tweet" });
  }
};

// Reply on a  Tweet
exports.comment = async (req, res) => {
  try {
    const { content, image } = req.body;
    const tweetId = req.params.id;
    if (!content) {
      return res.status(400).json({ error: "Reply content cannot be empty" });
    }
    const tweet = await TweetModel.findById(tweetId);
    if (!tweet) {
      return res.status(404).json({ error: "Tweet not found" });
    }
    // Create a new tweet for the reply
    const comment = new TweetModel({content, image, tweetedBy: req.params.id, inReplyTo: tweetId});
    await comment.save();
    tweet.comments.push(comment._id);
    await tweet.save();
    res.status(201).json({ success: true, comment: comment});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Some error occured" });
  }
};

// Get a single tweet detail
exports.getTweet = async (req, res) => {
  const tweetId = req.params.id;
  try {
    const tweet = await TweetModel.findById(tweetId)
      .populate("tweetedBy", "_id name profileimg")
      .exec();

    // Checking if the tweet exists
    if (!tweet) {
      return res.status(404).json({ error: "Tweet not found" });
    }

    // Respond with the details of the single tweet
    res.status(200).json(tweet);
  } catch (error) {
    console.error(error); // Log any errors that occur during tweet retrieval
    res.status(500).json({ error: "An error occurred while fetching tweets." }); // Return an error message for server-side errors
  }
};

// Get All Tweets Details
exports.getAllTweets = async (req, res) => {
  try {
    const dbTweets = await TweetModel.find()
      .populate("tweetedBy", "_id name profileimg username email")
      .sort({ createdAt: -1 }); 
    res.status(200).json({ alltweets: dbTweets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Some error occurred" }); 
  }
};

// Delete a Tweet
exports.deleteTweet = async (req, res) => {
  const tweetId = req.params.id;
  try {
    const tweet = await TweetModel.findOne({ _id: tweetId }).populate(
      "tweetedBy",
      "_id"
    );
    if (!tweet) {
      return res.status(400).json({ error: "Tweet does not exist" });
    }
    if (tweet.tweetedBy._id.toString() !== req.user._id.toString()) {
      return res.status(400).json({ error: "You cannot delete other users tweet" });
    }
    await tweet.deleteOne();
    res.status(200).json({ message: "Tweet deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
};

// Retweet a Tweet
exports.retweet = async (req, res) => {
  const tweetId = req.params.id;
  try {
    const userRetweeted = await TweetModel.findOne({
      _id: tweetId,
      retweetBy: req.user.id,
    });
    if (userRetweeted) {
      return res.status(400).json({ error: "You've already retweeted this tweet" });
    }
    const updatedTweet = await TweetModel.findByIdAndUpdate(
      tweetId,
      { $push: { retweetBy: req.user._id } },
      { new: true }
    ).populate("tweetedBy", "_id username").exec();

    if (!updatedTweet) {
      return res.status(400).json({ error: "Tweet not found" });
    }
    res.json(updatedTweet);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while retweeting the tweet" });
  }
};