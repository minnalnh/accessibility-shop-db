import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { validateBody } from "../../../middlewares/validation.mjs";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import { registerSchema } from "../../../models/userModels.mjs";
import { sendResponse } from "../../../responses/index.mjs";
import { addUser, getUser } from "../../../services/users.mjs";
import { createUser } from "../../../utils/user.mjs";
import createError from "http-errors";

export const handler = middy(async (event) => {
  const { username, email } = event.body;

  // check if username already exists
  const existingUsername = await getUser(username);

  if (existingUsername.length > 0) {
    throw createError(409, "Username has already been registered");
  }

  // check if mail is already registered
  const existingEmail = await getUser(undefined, email);

  if (existingEmail.length > 0) {
    throw createError(409, "Mail has already been registered");
  }

  // assign all users with the user role
  const newUser = {
    username,
    email,
    password: event.body.password,
  };

  // process user
  const items = await createUser(newUser);

  // save user
  const user = await addUser(items);

  return sendResponse(201, {
    message: "User has been registered",
    user,
  });
})
  .use(httpJsonBodyParser())
  .use(validateBody(registerSchema))
  .use(errorHandler());
