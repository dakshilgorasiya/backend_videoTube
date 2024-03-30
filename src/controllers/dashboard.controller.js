import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subsciption.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: get channel stats like video views, total subscribers, total likes etc.
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: get all the videos uploaded by a channel
  const video = await Video.find({ owner: req.user.id });
  if (!video) {
    throw new ApiError(404, "No videos found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Videos found successfully"));
});

export { getChannelStats, getChannelVideos };
