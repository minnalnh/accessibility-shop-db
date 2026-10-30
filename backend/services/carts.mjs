import {
  DeleteCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { db } from "./db.mjs";
import createError from "http-errors";

const CARTS_TABLE = process.env.CARTS_TABLE;

export const addCartItem = async (userId, productId, quantity = 1) => {
  try {
    const command = new UpdateCommand({
      TableName: CARTS_TABLE,
      Key: {
        userId,
        productId,
      },
      UpdateExpression: `
        SET quantity = if_not_exists(quantity, :zero) + :quantity,
            updatedAt = :updatedAt
      `,
      ExpressionAttributeValues: {
        ":zero": 0,
        ":quantity": quantity,
        ":updatedAt": new Date().toISOString(),
      },
      ReturnValues: "ALL_NEW",
    });

    const result = await db.send(command);
    return result.Attributes;
  } catch (error) {
    console.error("Failed to add cart item:", error);
    throw createError(500, "Could not add item to cart");
  }
};

export const getCart = async (userId) => {
  try {
    const result = await db.send(
      new QueryCommand({
        TableName: CARTS_TABLE,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      }),
    );

    return result.Items ?? [];
  } catch (error) {
    console.error("Could not fetch cart:", error);
    throw createError(500, "Could not fetch cart");
  }
};

export const removeCartItem = async (userId, productId) => {
  try {
    const result = await db.send(
      new DeleteCommand({
        TableName: CARTS_TABLE,
        Key: {
          userId,
          productId,
        },
        ReturnValues: "ALL_OLD",
      }),
    );

    if (!result.Attributes) {
      throw createError(404, "Product was not found in cart");
    }

    return result.Attributes;
  } catch (error) {
    if (error.statusCode === 404) {
      throw error;
    }

    console.error("Could not remove product from cart:", error);
    throw createError(500, "Could not remove product from cart");
  }
};

export const updateCartItem = async (userId, productId, quantity) => {
  try {
    const result = await db.send(
      new UpdateCommand({
        TableName: CARTS_TABLE,
        Key: {
          userId,
          productId,
        },
        UpdateExpression: "SET quantity = :quantity, updatedAt = :updatedAt",
        ConditionExpression:
          "attribute_exists(userId) AND attribute_exists(productId) AND quantity <> :quantity",
        ExpressionAttributeValues: {
          ":quantity": quantity,
          ":updatedAt": new Date().toISOString(),
        },
        ReturnValues: "ALL_NEW",
        ReturnValuesOnConditionCheckFailure: "ALL_OLD",
      }),
    );

    // check if quantity has updated
    const updatedItem = result.Attributes;

    if (!updatedItem || updatedItem.quantity !== quantity) {
      throw createError(500, "Could not confirm the update");
    }

    return updatedItem;
  } catch (error) {
    if (error.name === "ConditionalCheckFailedException") {
      if (error.Item) {
        // the line exists but the quantity is the same
        throw createError(409, "Quantity is already set to that value");
      }
      throw createError(404, "Product does not exist in cart");
    }

    console.error("Could not update cart:", error);
    throw createError(500, "Could not update cart");
  }
};
