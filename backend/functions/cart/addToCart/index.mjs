import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import createError from "http-errors";

import { authenticate } from "../../../middlewares/authentication.mjs";
import { validateBody } from "../../../middlewares/validation.mjs";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";

import { addCartItemSchema } from "../../../models/cartModels.mjs";
import { getProductById } from "../../../services/products.mjs";
import { addCartItem } from "../../../services/carts.mjs";
import { sendResponse } from "../../../responses/index.mjs";

export const handler = middy(async (event) => {
  const { productId, quantity = 1 } = event.body;
  const { userId } = event.user;

  // check if product exists
  const product = await getProductById(productId);

  if (!product) {
    throw createError(404, "Product not found");
  }

  // add the product to the user's cart
  const cartItem = await addCartItem(userId, productId, quantity);

  return sendResponse(201, {
    message: "Product added to cart",
    cartItem,
  });
})
  .use(httpJsonBodyParser())
  .use(authenticate())
  .use(validateBody(addCartItemSchema))
  .use(errorHandler());
