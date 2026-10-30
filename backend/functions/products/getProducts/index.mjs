import middy from "@middy/core";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import { sendResponse } from "../../../responses/index.mjs";
import { getProducts } from "../../../services/products.mjs";

export const handler = middy(async (event) => {
  const { productType, category } = event.queryStringParameters ?? {};

  const products = await getProducts({
    productType,
    category,
  });

  return sendResponse(200, {
    products,
  });
}).use(errorHandler());
