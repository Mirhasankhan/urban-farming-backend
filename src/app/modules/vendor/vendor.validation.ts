import { z } from "zod";

const setupProfileSchema = z.object({
  farmName: z.string().min(2, "Farm name must be at least 2 characters long"),
  farmLocation: z
    .string()
    .min(2, "Farm location must be at least 2 characters long"),
});
const sustainabilityCertificateSchema = z.object({
  certificationDate: z.string().refine(
    (date) => {
      const parsed = new Date(date);
      return !isNaN(parsed.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(date);
    },
    {
      message: "Invalid date. Use YYYY-MM-DD format",
    },
  ),
  certifyingAgency: z
    .string()
    .min(2, "Certifying agency must be at least 2 characters long"),
});

export const vendorValidation = {
  setupProfileSchema,
  sustainabilityCertificateSchema,
};
