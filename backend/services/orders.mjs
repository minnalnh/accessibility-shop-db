import crypto from "node:crypto";
import { GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { db } from "./db.mjs";
import createError from "http-errors";
import { getProductById } from "./products.mjs";

const ORDERS_TABLE = process.env.ORDERS_TABLE;

export const createOrder = async (userId, cartItems) => {
  try {
    if (!cartItems.length) {
      throw createError(400, "Cart is empty");
    }

    const items = [];
    let totalPrice = 0;

    for (const cartItem of cartItems) {
      const product = await getProductById(cartItem.productId);

      if (!product) {
        throw createError(
          404,
          `Product ${cartItem.productId} no longer exists`,
        );
      }

      const itemTotal = product.price * cartItem.quantity;
      totalPrice += itemTotal;

      items.push({
        productId: product.productId,
        name: product.name,
        quantity: cartItem.quantity,
        price: product.price,
      });
    }

    const order = {
      userId,
      orderId: crypto.randomUUID(),
      items,
      totalPrice: Number(totalPrice.toFixed(2)),
      status: "confirmed", // confirmed right away, since no payment method is added
      createdAt: new Date().toISOString(),
    };

    await db.send(
      new PutCommand({
        TableName: ORDERS_TABLE,
        Item: order,
      }),
    );

    return order;
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }

    console.error("Kunde inte skapa order:", error);
    throw createError(500, "Kunde inte skapa order");
  }
};

export const getUserOrders = async (userId) => {
  try {
    const result = await db.send(
      new QueryCommand({
        TableName: ORDERS_TABLE,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      }),
    );

    return result.Items ?? [];
  } catch (error) {
    console.error("Could not fetch user orders:", error);
    throw createError(500, "Could not fetch orders");
  }
};

export const getOrderById = async (userId, orderId) => {
  try {
    const result = await db.send(
      new GetCommand({
        TableName: ORDERS_TABLE,
        Key: {
          userId,
          orderId,
        },
      }),
    );

    if (!result.Item) {
      throw createError(404, "Order was not found");
    }

    return result.Item;
  } catch (error) {
    if (error.statusCode === 404) {
      throw error;
    }

    console.error("Could not fetch order:", error);
    throw createError(500, "Could not fetch order");
  }
};
