import middy from "@middy/core";

import { authenticate } from "../../../middlewares/authentication.mjs";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import { sendResponse } from "../../../responses/index.mjs";
import { removeCartItem } from "../../../services/carts.mjs";

export const handler = middy(async (event) => {
  const { userId } = event.user;
  const { productId } = event.pathParameters;

  const removedItem = await removeCartItem(userId, productId);

  return sendResponse(200, {
    message: "Produkten har tagits bort från varukorgen",
    removedItem,
  });
})
  .use(authenticate())
  .use(errorHandler());
