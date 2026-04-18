import { z } from "zod";

const rentalSpaceSchema = z.object({
  location: z.string(),
  size: z.string(),
  price: z
    .number({
      invalid_type_error: "Price must be a number",
    })
    .positive("Price must be greater than 0"),
});
const applicationSchema = z.object({
  spaceId: z.string(),
});
const plantSchema = z.object({
  rentId: z.string(),
  plantName: z.string(),
  quantity: z.number().positive("Quantity must be a positive number"),
});

export const rentValidation = {
  rentalSpaceSchema,
  applicationSchema,
  plantSchema,
};
