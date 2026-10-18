import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";

import { authenticate } from "../../../middlewares/authentication.mjs";
import { validateBody } from "../../../middlewares/validation.mjs";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import { sendResponse } from "../../../responses/index.mjs";
import { updateCartItemSchema } from "../../../models/cartModels.mjs";
import { updateCartItem } from "../../../services/carts.mjs";

export const handler = middy(async (event) => {
  const { userId } = event.user;
  const { productId } = event.pathParameters;
  const { quantity } = event.body;

  const updatedItem = await updateCartItem(userId, productId, quantity);

  return sendResponse(200, {
    message: "Cart has been updated",
    updatedItem,
  });
})
  .use(httpJsonBodyParser())
  .use(authenticate())
  .use(validateBody(updateCartItemSchema))
  .use(errorHandler());
