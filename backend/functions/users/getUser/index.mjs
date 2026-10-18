import middy from "@middy/core";

import { authenticate } from "../../../middlewares/authentication.mjs";
import { authorizeAdmin } from "../../../middlewares/authorizeAdmin.mjs";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import { sendResponse } from "../../../responses/index.mjs";
import { getUser } from "../../../services/users.mjs";

// GET /users?username=... or GET /users?email=...
export const handler = middy(async (event) => {
  const { username, email } = event.queryStringParameters ?? {};

  const users = await getUser(username, email);

  return sendResponse(200, {
    message: "Users retrieved successfully",
    users,
  });
})
  .use(authenticate())
  .use(authorizeAdmin())
  .use(errorHandler());
