import middy from "@middy/core";
import { authenticate } from "../../../middlewares/authentication.mjs";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import { sendResponse } from "../../../responses/index.mjs";
import { getUserOrders } from "../../../services/orders.mjs";

export const handler = middy(async (event) => {
  const { userId } = event.user;

  const orders = await getUserOrders(userId);

  return sendResponse(200, {
    message: "Orders retrieved",
    orders,
  });
})
  .use(authenticate())
  .use(errorHandler());
