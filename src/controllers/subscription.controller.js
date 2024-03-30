import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subsciption.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  // get channel
  // check if channel exists
  // get user
  // check if user is already subscribed to channel
  // if yes, remove document from subscription collection
  // if no, add document to subscription collection

  const { channelId } = req.params;
  if (!channelId?.trim()) {
    throw new ApiError(400, "Channel id is required");
  }
  const channel = await User.findById(channelId);
  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const subscription = await Subscription.findOne({
    subscriber: user._id,
    channel: channel._id,
  });

  if (subscription) {
    await Subscription.deleteOne({
      subscriber: user._id,
      channel: channel._id,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, "Unsubscribed successfully"));
  } else {
    await Subscription.create({ subscriber: user._id, channel: channel._id });
    return res
      .status(200)
      .json(new ApiResponse(200, "Subscribed successfully"));
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  // check subscriber exist or not
  // get user from User model
  // get all channels to which subscriber has subscribed
  const { channelId } = req.params;
  if (!channelId?.trim()) {
    throw new ApiError(400, "Subscriber id is required");
  }

  const user = await User.findById(channelId);
  if (!user) {
    throw new ApiError(404, "Subscriber not found");
  }

  const subscriptions = await Subscription.aggregate([
    {
      $match: { subscriber: new mongoose.Types.ObjectId(channelId) },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channel",
        pipeline: [
          {
            $project: {
              fullname: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        channel: 1,
      },
    },
  ]);

  return res.status(200).json(new ApiResponse(200, subscriptions, "success"));
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
