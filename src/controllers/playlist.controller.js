import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
  // get user id from req.user
  // get name and description from req.body
  // create playlist
  // save playlist
  // return playlist

  const { name, description } = req.body;

  if ([name, description].some((filed) => filed?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const playlist = await Playlist.create({
    name,
    description,
    owner: req.user.id,
    videos: [],
  });

  return res
    .status(201)
    .json(new ApiResponse(201, playlist, "Playlist created successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  // get user id from req.params
  // check if user exists
  // get user playlists
  // return playlists
  const { userId } = req.params;
  if (!userId.trim()) {
    throw new ApiError(400, "User id is required");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const playlists = await Playlist.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, playlists, "Playslists fetched successfully"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  // get playlist id from req.params
  // check if playlist exists
  // return playlist
  const { playlistId } = req.params;
  if (!playlistId.trim()) {
    throw new ApiError(400, "Playlist id is required");
  }

  const playlist = await Playlist.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(playlistId),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
      },
    },
  ]);

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  // get playlist id and video id from req.params
  // check if playlist exists
  // check if video exists
  // check if user owns the playlist
  // check if video is already in playlist
  // add video to playlist
  // return playlist
  const { playlistId, videoId } = req.params;
  if ([playlistId, videoId].some((filed) => filed?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (playlist.owner.toString() !== req.user.id) {
    throw new ApiError(
      403,
      "You are not authorized to add video to this playlist"
    );
  }

  if (playlist.videos.includes(videoId)) {
    throw new ApiError(400, "Video already in playlist");
  }

  playlist.videos.push(videoId);
  await playlist.save();
  return res
    .status(200)
    .json(
      new ApiResponse(200, playlist, "Video added to playlist successfully")
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  // get playlist id and video id from req.params
  // check if playlist exists
  // check if video exists
  // check if user owns the playlist
  // check if video is in playlist
  // remove video from playlist
  // return playlist
  const { playlistId, videoId } = req.params;
  if ([playlistId, videoId].some((filed) => filed?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  if (playlist.owner.toString() !== req.user.id) {
    throw new ApiError(
      403,
      "You are not authorized to remove video from this playlist"
    );
  }
  if (!playlist.videos.includes(videoId)) {
    throw new ApiError(400, "Video not in playlist");
  }

  playlist.videos = playlist.videos.filter(
    (video) => video.toString() !== videoId
  );
  await playlist.save();

  const newPlaylist = await Playlist.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(playlistId),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videos",
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        newPlaylist,
        "Video removed from playlist successfully"
      )
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  // get playlist id from req.params
  // check if playlist exists
  // check if user owns the playlist
  // delete playlist
  // return success message
  const { playlistId } = req.params;
  if (!playlistId.trim()) {
    throw new ApiError(400, "Playlist id is required");
  }
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  if (playlist.owner.toString() !== req.user.id) {
    throw new ApiError(403, "You are not authorized to delete this playlist");
  }
  await Playlist.deleteOne({ _id: playlistId });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Playlist deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  // get playlist id from req.params
  // check if playlist exists
  // get name and description from req.body
  // check if user owns the playlist
  // update playlist
  // return playlist
  const { playlistId } = req.params;
  const { name, description } = req.body;
  if ([playlistId, name, description].some((filed) => filed?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  if (playlist.owner.toString() !== req.user.id) {
    throw new ApiError(403, "You are not authorized to update this playlist");
  }
  const newPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    { name, description },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, newPlaylist, "Playlist updated successfully"));
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
