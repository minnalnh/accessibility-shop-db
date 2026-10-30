import jwt from "jsonwebtoken";

const getSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return secret;
};

export const signToken = (payload) => {
  return jwt.sign(payload, getSecret(), { expiresIn: "1h" });
};

export const verifyToken = (token) => {
  return jwt.verify(token, getSecret());
};
