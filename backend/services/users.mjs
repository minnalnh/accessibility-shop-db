import { db } from "./db.mjs";
import createError from "http-errors";
import {
  GetCommand,
  QueryCommand,
  TransactWriteCommand,
} from "@aws-sdk/lib-dynamodb";

const TABLE = "shui-table";

export const addUser = async (items) => {
  try {
    await db.send(
      new TransactWriteCommand({
        TransactItems: items.map((item) => ({
          Put: {
            TableName: TABLE,
            Item: item,
          },
        })),
      }),
    );

    const profile = items.find((item) => item.SK === "PROFILE");

    return {
      userId: profile.userId,
      username: profile.username,
      email: profile.email,
    };
  } catch (error) {
    console.error("ERROR createUser:", error);
    throw createError(500, error.message);
  }
};

export const getUser = async (username, email) => {
  try {
    let pk;

    if (username) {
      pk = `USERNAME#${username}`;
    } else if (email) {
      pk = `EMAIL#${email}`;
    } else {
      throw createError(400, "Användarnamn eller mail krävs");
    }
    const command = new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: {
        ":pk": pk,
      },
    });

    const result = await db.send(command);

    return result.Items ?? [];
  } catch (error) {
    console.error("ERROR:", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError(500, error.message);
  }
};

export const getUserById = async (userId) => {
  try {
    const { Item } = await db.send(
      new GetCommand({
        TableName: TABLE,
        Key: {
          PK: `USER#${userId}`,
          SK: "PROFILE",
        },
      }),
    );

    if (!Item) {
      return null;
    }

    return Item;
  } catch (error) {
    console.error("ERROR:", error);
    throw createError(500, error.message);
  }
};
