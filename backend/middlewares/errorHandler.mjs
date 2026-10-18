import createError from "http-errors";
import { sendResponse } from "../responses/index.mjs";

export const errorHandler = () => ({
  onError: async (handler) => {
    const error = handler.error;
    console.error("ERROR:", error);

    // errors created with createError() carry a message written for the client.
    // anything else (SDK errors, bugs) can contain internal details, so it is only logged
    if (createError.isHttpError(error)) {
      handler.response = sendResponse(error.statusCode, {
        message: error.message,
      });
      return;
    }

    handler.response = sendResponse(500, {
      message: "Internal Server Error",
    });
  },
});
