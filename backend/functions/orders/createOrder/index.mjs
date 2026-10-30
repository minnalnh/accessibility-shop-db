import middy from "@middy/core";

import { authenticate } from "../../../middlewares/authentication.mjs";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import { sendResponse } from "../../../responses/index.mjs";

import { getCart, removeCartItem } from "../../../services/carts.mjs";
import { createOrder } from "../../../services/orders.mjs";

export const handler = middy(async (event) => {
  const { userId } = event.user;

  // retrieve user's cart
  const cartItems = await getCart(userId);

  // create order
  const order = await createOrder(userId, cartItems);

  // empty the cart once order has been created
  for (const item of cartItems) {
    await removeCartItem(userId, item.productId);
  }

  return sendResponse(201, {
    message: "Ordern har skapats",
    order,
  });
})
  .use(authenticate())
  .use(errorHandler());
