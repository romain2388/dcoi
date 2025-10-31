import { z } from "zod";

export const ProjectFormSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  carbonStandard: z.string(),
  carbonQuantity: z.number(),
  carbonPrice: z.number().optional(),
  country: z.string(),
  image1Url: z.url().optional(),
  image2Url: z.url().optional(),
  image3Url: z.url().optional(),
  videoUrl: z.url().optional(),
  proofOfRetirementUrl: z.url().optional(),
});

export const ProjectFormDTOSchema = z.object({
  formData: ProjectFormSchema,
  adminPwd: z.string(),
});

export type ProjectFormType = z.infer<typeof ProjectFormSchema>;
export type ProjectFormDTOType = z.infer<typeof ProjectFormDTOSchema>;
