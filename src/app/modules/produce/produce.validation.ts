import { z } from "zod";

const ProductCategoryEnum = z.enum([
  "VEGETABLE",
  "FRUIT",
  "GRAIN",
  "DAIRY",
  "SEED",
  "TOOL",
  "FERTILIZER",
  "HERB",
]);

const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string(),
  price: z
    .number({
      invalid_type_error: "Price must be a number",
    })
    .positive("Price must be greater than 0"),
  category: ProductCategoryEnum,
  availableQuantity: z
    .number({
      invalid_type_error: "Quantity must be a number",
    })
    .int("Quantity must be an integer")
    .min(0, "Quantity cannot be negative"),
});

export const produceValidation = {
  productSchema,
};
