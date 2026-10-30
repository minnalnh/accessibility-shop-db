import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";

import { validateBody } from "../../../middlewares/validation.mjs";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import { loginSchema } from "../../../models/userModels.mjs";
import { sendResponse } from "../../../responses/index.mjs";
import { comparePassword } from "../../../utils/bcrypt.mjs";
import { signToken } from "../../../utils/jwt.mjs";
import createError from "http-errors";
import { getUser, getUserById } from "../../../services/users.mjs";

export const handler = middy(async (event) => {
  const { email, password } = event.body;

  // hämtar användarens mail (PK = EMAIL#{email}. den första parametern är username som är undefined, då det enbart krävs mail och lösenord för att logga in. får ut var ID finns som kan användas för att hämta hela användaren
  const users = await getUser(undefined, email);

  if (users.length === 0) {
    throw createError(401, "Felaktig mailadress eller lösenord");
  }

  // hämtar hela användaren (PK = USER#{userId}) och det hashade lösenordet
  const user = await getUserById(users[0].userId);

  // kontrollera om lösenordet är giltigt
  const validPassword = await comparePassword(password, user.password);

  if (!validPassword) {
    throw createError(401, "Felaktig mailadress eller lösenord");
  }

  // skapa token
  const token = signToken({
    userId: user.userId,
    username: user.username,
    role: user.role,
  });

  return sendResponse(200, {
    token,
    user: {
      userId: user.userId,
      username: user.username,
    },
  });
})
  .use(httpJsonBodyParser())
  .use(validateBody(loginSchema))
  .use(errorHandler());
