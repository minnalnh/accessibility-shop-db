import middy from "@middy/core";
import { sendResponse } from "../../../responses/index.mjs";
import { deleteProduct } from "../../../services/products.mjs";
import { authenticate } from "../../../middlewares/authentication.mjs";
import { authorizeAdmin } from "../../../middlewares/authorizeAdmin.mjs";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";

export const handler = middy(async (event) => {
  const { productId } = event.pathParameters || {};

  const deletedProduct = await deleteProduct(productId);

  return sendResponse(200, {
    message: "The product has been deleted",
    deletedProduct,
  });
})
  .use(authenticate())
  .use(authorizeAdmin())
  .use(errorHandler());
