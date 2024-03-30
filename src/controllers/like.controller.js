import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";

// TODO: TESTING IS NOT DONE YET

const toggleVideoLike = asyncHandler(async (req, res) => {
  // get videoId from req.params
  // check if video exists
  // check if user has already liked the video
  // if user has liked the video, remove like
  // if user has not liked the video, add like
  // return success message
  const { videoId } = req.params;

  if (!videoId.trim()) {
    throw new ApiError(400, "Video id is required");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const like = await Like.findOne({
    video: videoId,
    likedBy: req.user.id,
  });

  if (like) {
    await Like.deleteOne({ _id: like._id });
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Video like removed successfully"));
  } else {
    const newLike = await Like.create({
      video: videoId,
      likedBy: req.user.id,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, newLike, "Video liked successfully"));
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!commentId.trim()) {
    throw new ApiError(400, "Comment id is required");
  }
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const like = await Like.findOne({ comment: commentId, likedBy: req.user.id });
  if (like) {
    await Like.deleteOne({ _id: like._id });
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Comment like removed successfully"));
  } else {
    const newLike = await Like.create({
      comment: commentId,
      likedBy: req.user.id,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, newLike, "Comment liked successfully"));
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  if (!tweetId.trim()) {
    throw new ApiError(400, "Tweet id is required");
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  const like = await Like.findOne({ tweet: tweetId, likedBy: req.user.id });
  if (like) {
    await Like.deleteOne({ _id: like._id });
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Tweet like removed successfully"));
  } else {
    const newLike = await Like.create({
      tweet: tweetId,
      likedBy: req.user.id,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, newLike, "Tweet liked successfully"));
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  // get userid from req.user
  // get all video liked by user
  // return videos

  await Like.aggregate([
    {
      $match: {
        likedBy: mongoose.Types.ObjectId(req.user.id),
        video: { $exists: true },
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
      },
    },
    {
      $unwind: "$video",
    },
    {
      $project: {
        _id: 1,
        video: 1,
      },
    },
  ]);
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
