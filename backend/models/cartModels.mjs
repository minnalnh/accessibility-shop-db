import { z } from "zod";

export const addCartItemSchema = z.object({
  productId: z.string().trim().min(1, "Product ID is required"),
  quantity: z.number().int().positive().default(1),
});

export const updateCartItemSchema = z
  .object({
    quantity: z.number().int().positive(),
  })
  .strict();
