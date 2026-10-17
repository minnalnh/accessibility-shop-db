import { db } from "./db.mjs";
import createError from "http-errors";
import { randomUUID } from "node:crypto";

import {
  GetCommand,
  QueryCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const TABLE = "accessibility-shop-products-dev";
const INDEX = "ProductTypeIndex";

const productTypes = ["brushes", "pencils", "paper", "paint"];

const categoryTypes = {
  "fan-brushes": "brushes",
  "flat-brushes": "brushes",
  "round-brushes": "brushes",
  "charcoal-pencils": "pencils",
  "colored-pencils": "pencils",
  "graphite-pencils": "pencils",
  "canvas-paper": "paper",
  "drawing-paper": "paper",
  "watercolor-paper": "paper",
  "acrylic-paint": "paint",
  "oil-paint": "paint",
  "watercolor-paint": "paint",
};

async function queryProducts(productType, category) {
  const items = [];
  let lastKey;

  do {
    const params = {
      TableName: TABLE,
      IndexName: INDEX,
      KeyConditionExpression: category
        ? "productType = :type AND #category = :category"
        : "productType = :type",
      ExpressionAttributeValues: {
        ":type": productType,
        ...(category ? { ":category": category } : {}),
      },
      ...(category
        ? { ExpressionAttributeNames: { "#category": "category" } }
        : {}),
      ...(lastKey ? { ExclusiveStartKey: lastKey } : {}),
    };

    const result = await db.send(new QueryCommand(params));

    items.push(...(result.Items ?? []));
    lastKey = result.LastEvaluatedKey;
  } while (lastKey);

  return items;
}

// get all products or filter based on product type / category
export const getProducts = async ({ productType, category } = {}) => {
  try {
    if (category) {
      const expectedType = categoryTypes[category];

      if (!expectedType) {
        throw createError(400, "Ogiltig produktkategori");
      }

      if (productType && productType !== expectedType) {
        throw createError(400, "Kategorin tillhör inte denna produkttyp");
      }

      return await queryProducts(expectedType, category);
    }

    if (productType) {
      if (!productTypes.includes(productType)) {
        throw createError(400, "Ogiltig produkttyp");
      }

      return await queryProducts(productType);
    }

    const results = await Promise.all(
      productTypes.map((type) => queryProducts(type)),
    );

    return results.flat();
  } catch (error) {
    if (error.statusCode) throw error;

    console.error("Kunde inte hämta produkter:", error);
    throw createError(500, "Kunde inte hämta produkter");
  }
};

// get a product using product ID
export const getProductById = async (productId) => {
  try {
    const result = await db.send(
      new GetCommand({
        TableName: TABLE,
        Key: { productId },
      }),
    );

    if (!result.Item) {
      throw createError(404, "Produkten hittades inte");
    }

    return result.Item;
  } catch (error) {
    if (error.statusCode) throw error;

    console.error("Kunde inte hämta produkten:", error);
    throw createError(500, "Kunde inte hämta produkten");
  }
};

// create a 6 digit product ID
export const createProduct = async (product) => {
  try {
    const productType = product.category && categoryTypes[product.category];

    if (!productType) {
      throw createError(400, "Ogiltig produktkategori");
    }

    const newProduct = {
      ...product,
      productId: randomUUID().replaceAll("-", "").slice(0, 6),
      productType,
    };

    await db.send(
      new PutCommand({
        TableName: TABLE,
        Item: newProduct,
        ConditionExpression: "attribute_not_exists(productId)",
      }),
    );

    return newProduct;
  } catch (error) {
    if (error.statusCode) throw error;

    if (error.name === "ConditionalCheckFailedException") {
      throw createError(409, "Produkt-ID finns redan");
    }

    console.error("Kunde inte skapa produkten:", error);
    throw createError(500, "Kunde inte skapa produkten");
  }
};

// update an existing product
export const updateProduct = async (productId, updates) => {
  try {
    const allowedFields = [
      "name",
      "size",
      "material",
      "description",
      "brand",
      "price",
      "image",
      "alt",
      "category",
    ];

    const entries = Object.entries(updates).filter(
      ([key, value]) => allowedFields.includes(key) && value !== undefined,
    );

    if (entries.length === 0) {
      throw createError(400, "Inga giltiga ändringar angavs");
    }

    const categoryUpdate = entries.find(([key]) => key === "category");

    const productType = categoryUpdate
      ? categoryTypes[categoryUpdate[1]]
      : undefined;

    if (categoryUpdate && !productType) {
      throw createError(400, "Ogiltig produktkategori");
    }

    const fields = entries.filter(([key]) => key !== "category");

    if (categoryUpdate) {
      fields.push(["category", categoryUpdate[1]]);
      fields.push(["productType", productType]);
    }

    const names = {};
    const values = {};
    const expressions = [];

    fields.forEach(([key, value], index) => {
      names[`#f${index}`] = key;
      values[`:v${index}`] = value;
      expressions.push(`#f${index} = :v${index}`);
    });

    const result = await db.send(
      new UpdateCommand({
        TableName: TABLE,
        Key: { productId },
        UpdateExpression: `SET ${expressions.join(", ")}`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ConditionExpression: "attribute_exists(productId)",
        ReturnValues: "ALL_NEW",
      }),
    );

    return result.Attributes;
  } catch (error) {
    if (error.statusCode) throw error;

    if (error.name === "ConditionalCheckFailedException") {
      throw createError(404, "Produkten hittades inte");
    }

    console.error("Kunde inte uppdatera produkten:", error);
    throw createError(500, "Kunde inte uppdatera produkten");
  }
};

// delete a product
export const deleteProduct = async (productId) => {
  try {
    const result = await db.send(
      new DeleteCommand({
        TableName: TABLE,
        Key: { productId },
        ConditionExpression: "attribute_exists(productId)",
        ReturnValues: "ALL_OLD",
      }),
    );

    return result.Attributes;
  } catch (error) {
    if (error.name === "ConditionalCheckFailedException") {
      throw createError(404, "Produkten hittades inte");
    }

    if (error.statusCode) throw error;

    console.error("Kunde inte ta bort produkten:", error);
    throw createError(500, "Kunde inte ta bort produkten");
  }
};
