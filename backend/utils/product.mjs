import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(1),
  size: z.string().trim().min(1),
  material: z.string().trim().min(1),
  description: z.string().trim().min(1),
  brand: z.string().trim().min(1),
  price: z.number().positive(),
  image: z.string().trim().min(1),
  alt: z.string().trim().min(1),
  category: z.enum([
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
  ]),
});
