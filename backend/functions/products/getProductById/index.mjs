import middy from "@middy/core";
import { sendResponse } from "../../../responses/index.mjs";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import { getProductById } from "../../../services/products.mjs";

export const handler = middy(async (event) => {
  const { productId } = event.pathParameters;

  const product = await getProductById(productId);

  if (product) {
    return sendResponse(200, {
      success: true,
      product,
    });
  } else {
    return sendResponse(404, {
      success: false,
      product: "No product was found",
    });
  }
}).use(errorHandler());
