import { z } from "zod";

const orderSchema = z.object({
  produceId: z.string(),
  quantity: z.number().positive("Quantity must be a positive number"),
});

export const orderValidation = {
  orderSchema,
};
