import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { validateBody } from "../../../middlewares/validation.mjs";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";

export const handler = middy(async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v4! Your function executed successfully!",
    }),
  };
})
  .use(httpJsonBodyParser())
  .use(validateBody(productsSchema))
  .use(errorHandler());
