import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  // get userid from req.user
  // get content from req.body
  // create tweet
  // save tweet
  // return tweet
  //TODO: create tweet
  const { content } = req.body;
  const tweet = await Tweet.create({
    content,
    owner: req.user._id,
  });
  res
    .status(201)
    .json(new ApiResponse(201, { tweet }, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // get user id from req.params
  // check if user exists
  // get user tweets
  // return user tweets
  // TODO: get user tweets
  const { userId } = req.params;
  if (!userId.trim()) {
    throw new ApiError(400, "User id is required");
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const tweets = await Tweet.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $project: {
        content: 1,
        createdAt: 1,
      },
    },
  ]);

  res
    .status(200)
    .json(new ApiResponse(200, { tweets }, "User tweets fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  // get tweet id from req.params
  // get content from req.body
  // check if tweet exists
  // check if user is owner of tweet
  // update tweet
  // save tweet
  // return tweet
  //TODO: update tweet

  const { tweetId } = req.params;
  if (!tweetId.trim()) {
    throw new ApiError(400, "Tweet id is required");
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  const { content } = req.body;
  if (!content.trim()) {
    throw new ApiError(400, "Content is required");
  }

  if (tweet.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to update this tweet");
  }

  const newTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      $set: {
        content: content,
      },
    },
    { new: true }
  );

  res
    .status(200)
    .json(new ApiResponse(200, newTweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  // get tweet id from req.params
  // check if tweet exists
  // check if user is owner of tweet
  // delete tweet
  // return tweet
  //TODO: delete tweet
  const { tweetId } = req.params;
  if (!tweetId.trim()) {
    throw new ApiError(400, "Tweet id is required");
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  if (tweet.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to delete this tweet");
  }

  await Tweet.deleteOne({ _id: tweetId });

  res
    .status(200)
    .json(new ApiResponse(200, null, "Tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
