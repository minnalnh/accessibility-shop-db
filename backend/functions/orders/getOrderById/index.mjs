import middy from "@middy/core";
import { authenticate } from "../../../middlewares/authentication.mjs";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import { sendResponse } from "../../../responses/index.mjs";
import { getOrderById } from "../../../services/orders.mjs";

export const handler = middy(async (event) => {
  const { userId } = event.user;
  const { orderId } = event.pathParameters;

  const order = await getOrderById(userId, orderId);

  return sendResponse(200, {
    message: "Ordern hämtades",
    order,
  });
})
  .use(authenticate())
  .use(errorHandler());
