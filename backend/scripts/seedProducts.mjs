import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { fromIni } from "@aws-sdk/credential-providers";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tableName = "accessibility-shop-products-dev";

const categories = [
  "fan-brushes",
  "flat-brushes",
  "round-brushes",
  "acrylic-paint",
  "oil-paint",
  "watercolor-paint",
  "canvas-paper",
  "drawing-paper",
  "watercolor-paper",
  "charcoal-pencils",
  "colored-pencils",
  "graphite-pencils",
];

const client = new DynamoDBClient({
  region: "eu-north-1",
  credentials: fromIni({ profile: "accessibility-shop" }),
});

const db = DynamoDBDocumentClient.from(client);

async function loadProducts() {
  const allProducts = [];
  const allProductIds = new Set();

  for (const category of categories) {
    const filePath = path.join(
      __dirname,
      "../data/products",
      `${category}.json`,
    );

    const fileContent = await readFile(filePath, "utf8");
    const products = JSON.parse(fileContent);

    if (!Array.isArray(products)) {
      throw new Error(`${category}.json must contain an array.`);
    }

    const categorizedProducts = products.map((product) => {
      if (
        !product.productId ||
        typeof product.productId !== "string" ||
        product.productId.length !== 6 ||
        !product.name ||
        typeof product.price !== "number"
      ) {
        throw new Error(
          `Ogiltig produkt i ${category}.json: ${JSON.stringify(product)}`,
        );
      }

      if (allProductIds.has(product.productId)) {
        throw new Error(`Dubblett av productId: ${product.productId}`);
      }

      allProductIds.add(product.productId);

      return {
        ...product,
        category,
      };
    });

    allProducts.push(...categorizedProducts);
  }

  return allProducts;
}

async function writeBatch(items) {
  let pending = items.map((item) => ({
    PutRequest: { Item: item },
  }));

  while (pending.length > 0) {
    const result = await db.send(
      new BatchWriteCommand({
        RequestItems: {
          [tableName]: pending,
        },
      }),
    );

    pending = result.UnprocessedItems?.[tableName] ?? [];

    if (pending.length > 0) {
      console.warn(`${pending.length} products are waiting for another try.`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

async function seedProducts() {
  const products = await loadProducts();

  console.log(`${products.length} products are being read.`);

  for (let i = 0; i < products.length; i += 25) {
    await writeBatch(products.slice(i, i + 25));

    console.log(
      `Saved ${Math.min(i + 25, products.length)} av ${products.length}.`,
    );
  }

  console.log("All products have been saved in DynamoDB.");
}

seedProducts()
  .catch((error) => {
    console.error("Could not add products:", error);
    process.exitCode = 1;
  })
  .finally(() => client.destroy());
