import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthCheck = asyncHandler(async (req, res) => {
  // TODO: build a healthcheck response that simply returns the OK status as json with a message
  res.send(
    new ApiResponse(
      200,
      { message: "OK" },
      "Connected to the server successfully!"
    )
  );
});

export { healthCheck };
