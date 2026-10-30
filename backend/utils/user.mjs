import crypto from "node:crypto";
import { hashPassword } from "./bcrypt.mjs";

export const createUser = async (body) => {
  // generate a unique user ID
  const userId = crypto.randomUUID();

  // hash password
  const hashedPassword = await hashPassword(body.password);
  const currentTime = new Date().toISOString();

  // assigns the user role to the user, unless the create admin script is running
  return [
    {
      PK: `USER#${userId}`,
      SK: `PROFILE`,
      userId,
      username: body.username,
      email: body.email,
      password: hashedPassword,
      role: body.role ?? "user",
      createdAt: currentTime,
    },
    {
      PK: `USERNAME#${body.username}`,
      SK: `USER#${userId}`,
      userId,
      username: body.username,
      email: body.email,
    },
    {
      PK: `EMAIL#${body.email}`,
      SK: `USER#${userId}`,
      userId,
      username: body.username,
      email: body.email,
    },
  ];
};
