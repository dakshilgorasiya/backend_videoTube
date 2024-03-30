import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  // Get the video file and thumbnail from the request
  // Get the title and description from the request body
  // Get duration from cloudanary
  // Create a new video object
  // Save the video to the database
  // Return the video object in the response
  const { title, description } = req.body;

  if ([title, description].some((filed) => filed?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const videoLocalPath = req.files?.videoFile[0]?.path;
  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is required");
  }

  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail is required");
  }

  const video = await uploadOnCloudinary(videoLocalPath);
  if (!video) {
    throw new ApiError(500, "Failed to upload video");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  if (!thumbnail) {
    throw new ApiError(500, "Failed to upload thumbnail");
  }

  const duration = video?.duration;

  const uploadedVideo = await Video.create({
    title,
    description,
    videoFile: video?.url,
    thumbnail: thumbnail?.url,
    duration,
    owner: req.user._id,
  });

  res
    .status(201)
    .json(new ApiResponse(201, uploadedVideo, "Video uploaded successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  // Get the video id from the request params
  // Find the video by id
  // Return the video object in the response]
  const { videoId } = req.params;
  if (!videoId?.trim()) {
    throw new ApiError(400, "Video id is required");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  res.status(200).json(new ApiResponse(200, video, "Video found"));
});

const updateVideo = asyncHandler(async (req, res) => {
  // Get the video id from the request params
  // Find the video by id
  // Get the title and description from the request body
  // Get the thumbnail from the request file
  // Update the video object
  // Save the video object
  // Return the updated video object in the response
  const { videoId } = req.params;
  if (!videoId?.trim()) {
    throw new ApiError(400, "Video id is required");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const { title, description } = req.body;
  if ([title, description].some((filed) => filed?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const thumbnailLocalPath = req.file?.path;

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!thumbnail) {
    throw new ApiError(500, "Failed to upload thumbnail");
  }

  const newVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      title,
      description,
      thumbnail: thumbnail?.url,
    },
    { new: true }
  );

  res.status(200).json(new ApiResponse(200, newVideo, "Video updated"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  // Get the video id from the request params
  // Find the video by id
  // Check if user is the owner of the video
  // Delete the video
  // Return a success message in the response
  const { videoId } = req.params;
  if (!videoId?.trim()) {
    throw new ApiError(400, "Video id is required");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this video");
  }

  await Video.deleteOne({ _id: videoId });

  res.status(200).json(new ApiResponse(200, null, "Video deleted"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  // Get the video id from the request params
  // Find the video by id
  // Check user is the owner of the video
  // Toggle the isPublished status
  // Save the video object
  // Return the updated video object in the response
  const { videoId } = req.params;
  if (!videoId?.trim()) {
    throw new ApiError(400, "Video id is required");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this video");
  }
  video.isPublished = !video.isPublished;
  await video.save();
  res.status(200).json(new ApiResponse(200, video, "Video updated"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
