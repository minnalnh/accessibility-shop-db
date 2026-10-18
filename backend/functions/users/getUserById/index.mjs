import middy from "@middy/core";
import createError from "http-errors";

import { authenticate } from "../../../middlewares/authentication.mjs";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import { sendResponse } from "../../../responses/index.mjs";
import { getUserById } from "../../../services/users.mjs";

export const handler = middy(async (event) => {
  const { userId } = event.pathParameters;

  // users can only see their own profile, admins can see everyone's
  if (event.user.userId !== userId && event.user.role !== "admin") {
    throw createError(403, "Admin access is required");
  }

  const user = await getUserById(userId);

  if (!user) {
    throw createError(404, "User was not found");
  }

  return sendResponse(200, {
    message: "User retrieved successfully",
    user: {
      userId: user.userId,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
})
  .use(authenticate())
  .use(errorHandler());
