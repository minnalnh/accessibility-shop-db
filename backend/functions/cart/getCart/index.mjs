import middy from "@middy/core";
import { authenticate } from "../../../middlewares/authentication.mjs";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import { sendResponse } from "../../../responses/index.mjs";
import { getCart } from "../../../services/carts.mjs";

export const handler = middy(async (event) => {
  const { userId } = event.user;

  const cartItems = await getCart(userId);

  return sendResponse(200, {
    message: "Cart retrieved successfully",
    cartItems,
  });
})
  .use(authenticate())
  .use(errorHandler());
