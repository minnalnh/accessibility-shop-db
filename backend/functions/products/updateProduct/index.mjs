import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { validateBody } from "../../../middlewares/validation.mjs";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import { productSchema } from "../../../utils/product.mjs";
import { sendResponse } from "../../../responses/index.mjs";
import { updateProduct } from "../../../services/products.mjs";
import { authenticate } from "../../../middlewares/authentication.mjs";
import { authorizeAdmin } from "../../../middlewares/authorizeAdmin.mjs";

// MAKE SURE THAT THERE ARE CHANGES IN THE REQ BODY
export const handler = middy(async (event) => {
  const { productId } = event.pathParameters;

  const updatedProduct = await updateProduct(productId, event.body);

  return sendResponse(200, {
    success: true,
    product: updatedProduct,
  });
})
  .use(httpJsonBodyParser())
  .use(authenticate())
  .use(authorizeAdmin())
  .use(validateBody(productSchema.partial()))
  .use(errorHandler());
