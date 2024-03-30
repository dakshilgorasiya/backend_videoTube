import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const getVideoComments = asyncHandler(async (req, res) => {
  // TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: TESTING IS NOT DONE YET
  // Get the video ID from the request parameters
  // Get the comment text from the request body
  // Get the user ID from the request user object
  // Create a new comment object
  // Save the comment to the database
  // Return the comment object in the response

  const { videoId } = req.params;
  if (!videoId?.trim()) {
    throw new ApiError(400, "Video id is required");
  }

  const { content } = req.body;
  if (!content?.trim()) {
    throw new ApiError(400, "Comment text is required");
  }

  const comment = await Comment.create({
    video: videoId,
    user: req.user._id,
    content: content,
  });

  return res.status(201).json(new ApiResponse(201, comment, "Comment added"));
});

const updateComment = asyncHandler(async (req, res) => {
  // get the comment ID from the request parameters
  // get the new comment text from the request body
  // find the comment by ID
  // check if the comment exists
  // check if the user is the owner of the comment
  // update the comment text
  // save the updated comment
  // return the updated comment in the response
  // TODO: TESTING IS NOT DONE YET
  const { commentId } = req.params;
  if (!commentId?.trim()) {
    throw new ApiError(400, "Comment ID is required");
  }

  const { content } = req.body;
  if (!content?.trim()) {
    throw new ApiError(400, "Comment text is required");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to update this comment");
  }

  comment.content = content;
  const newComment = await comment.save();

  res.status(200).json(new ApiResponse(200, newComment, "Comment updated"));
});

const deleteComment = asyncHandler(async (req, res) => {
  // get the comment ID from the request parameters
  // find the comment by ID
  // check if the comment exists
  // check if the user is the owner of the comment
  // delete the comment
  // return a success message in the response
  // TODO: TESTING IS NOT DONE YET
  const { commentId } = req.params;
  if (!commentId?.trim()) {
    throw new ApiError(400, "Comment ID is required");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to delete this comment");
  }

  await Comment.deleteOne({ _id: commentId });
  res.status(200).json(new ApiResponse(200, null, "Comment deleted"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
