import { z } from "zod";

const CategoryEnum = z.enum([
  "PERSONAL_CARE",
  "BEAUTY",
  "HOME_KITCHEN",
  "FASHION",
  "SPORTS_FITNESS",
]);

const DocumentTypeEnum = z.enum([
  "INGREDIENT_LIST",
  "MATERIAL_LIST",
  "FRONT_LABEL",
  "BACK_LABEL",
  "CERTIFICATE"
]);

export const createProductSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    description: z.string().min(10, "Description must be at least 10 characters long"),
    category: CategoryEnum,
    features: z.union([z.string(), z.record(z.string(), z.any()), z.array(z.any())]).transform((val) => {
      // If features comes as a stringified JSON (from form data), parse it
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return val;
        }
      }
      return val;
    }),
    
    hsn: z.string().optional().nullable(),
    country: z.string().optional().nullable(),
    manufacturer: z.string().optional().nullable(),
    manufacturerContact: z.string().optional().nullable(),
    packerContact: z.string().optional().nullable(),
    netQuantity: z.string().optional().nullable(),
    attributes: z.any().optional().nullable(),

    variants: z
      .array(
        z.object({
          size: z.string().optional().nullable(),
          color: z.string().optional().nullable(),
          weight: z.string().optional().nullable(),
          ml: z.string().optional().nullable(),
          price: z.number().positive("Price must be positive"),
          stock: z.number().int().nonnegative("Stock cannot be negative"),
          skuCode: z.string().optional().nullable(), // Optional: Generated if missing
        })
      )
      .optional()
      .nullable(),

    packaging: z.object({
      primaryMaterial: z.string().optional().nullable(),
      secondaryMaterial: z.string().optional().nullable(),
      refillable: z.boolean().optional(),
      reusable: z.boolean().optional(),
      plasticFree: z.boolean().optional(),
    }).optional().nullable(),

    documents: z.array(z.object({
      type: DocumentTypeEnum,
      url: z.string().url("Must be a valid document URL")
    })).optional().nullable(),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    category: CategoryEnum.optional(),
    features: z.any().optional(),
    hsn: z.string().optional().nullable(),
    country: z.string().optional().nullable(),
    manufacturer: z.string().optional().nullable(),
    manufacturerContact: z.string().optional().nullable(),
    packerContact: z.string().optional().nullable(),
    netQuantity: z.string().optional().nullable(),
    attributes: z.any().optional().nullable(),
    
    packaging: z.object({
      primaryMaterial: z.string().optional().nullable(),
      secondaryMaterial: z.string().optional().nullable(),
      refillable: z.boolean().optional(),
      reusable: z.boolean().optional(),
      plasticFree: z.boolean().optional(),
    }).optional().nullable(),

    documents: z.array(z.object({
      type: DocumentTypeEnum,
      url: z.string().url("Must be a valid document URL")
    })).optional().nullable(),
  }),
  params: z.object({
    id: z.string().min(1, "Product ID is required"),
  }),
});
