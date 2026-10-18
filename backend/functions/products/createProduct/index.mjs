import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { validateBody } from "../../../middlewares/validation.mjs";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import createError from "http-errors";
import { createProduct } from "../../../services/products.mjs";
import { sendResponse } from "../../../responses/index.mjs";
import { getUserById } from "../../../services/users.mjs";
import { productSchema } from "../../../utils/product.mjs";
import { verifyToken } from "../../../utils/jwt.mjs";

export const handler = middy(async (event) => {
  const authHeader = event.headers?.authorization;

  if (!authHeader) {
    throw createError(401, "Authentication is required");
  }
  const token = authHeader.replace("Bearer ", "");

  let user;

  try {
    user = verifyToken(token);
  } catch (error) {
    console.error("Token verification failed:", error);
    throw createError(401, "Invalid or expired token");
  }
  const userData = await getUserById(user.userId);

  if (!userData) {
    throw createError(404, "User was not found");
  }
  const createdProduct = await createProduct({
    name: event.body.name,
    size: event.body.size,
    material: event.body.material,
    description: event.body.description,
    brand: event.body.brand,
    price: event.body.price,
    image: event.body.image,
    alt: event.body.alt,
    category: event.body.category,
  });

  return sendResponse(201, {
    message: "The product has been added",
    createdProduct,
  });
})
  .use(httpJsonBodyParser())
  .use(validateBody(productSchema))
  .use(errorHandler());
