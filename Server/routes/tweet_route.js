// getalltweets, getusertweet, create, like or dislike, reply, retweet
const express = require('express');
const tweetRouter = express.Router();
const tweetController = require('../controllers/tweet_controller');
const protectedRoute = require('../middleware/protectedResource');

//get tweets of user
tweetRouter.get('/api/user/:id/tweets', protectedRoute, tweetController.getUserTweets);
// Create a Tweet
tweetRouter.post('/api/tweet', protectedRoute, tweetController.createTweet);
// Get All Tweets
tweetRouter.get('/api/alltweets', protectedRoute, tweetController.getAllTweets);
// Get a single tweet 
tweetRouter.get('/api/tweet/:id', protectedRoute, tweetController.getTweet);
// Delete a Tweet
tweetRouter.delete('/api/deletetweet/:id', protectedRoute, tweetController.deleteTweet);
// Like or Dislike Tweet
tweetRouter.put('/api/tweet/:id/like&dislike', protectedRoute, tweetController.likeDislike);
// Reply on a  Tweet
tweetRouter.put('/api/tweet/:id/comment', protectedRoute, tweetController.comment);
// Retweet a Tweet
tweetRouter.post('/api/tweet/:id/retweet', protectedRoute, tweetController.retweet);

module.exports = tweetRouter;