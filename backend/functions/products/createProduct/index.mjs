import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { authenticate } from "../../../middlewares/authentication.mjs";
import { authorizeAdmin } from "../../../middlewares/authorizeAdmin.mjs";
import { validateBody } from "../../../middlewares/validation.mjs";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import { createProduct } from "../../../services/products.mjs";
import { sendResponse } from "../../../responses/index.mjs";
import { productSchema } from "../../../utils/product.mjs";

export const handler = middy(async (event) => {
  const createdProduct = await createProduct({
    name: event.body.name,
    size: event.body.size,
    material: event.body.material,
    description: event.body.description,
    brand: event.body.brand,
    price: event.body.price,
    image: event.body.image,
    alt: event.body.alt,
    category: event.body.category,
  });

  return sendResponse(201, {
    message: "The product has been added",
    createdProduct,
  });
})
  .use(httpJsonBodyParser())
  .use(authenticate())
  .use(authorizeAdmin())
  .use(validateBody(productSchema))
  .use(errorHandler());
