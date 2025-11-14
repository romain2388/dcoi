import { z } from "zod";

export const ProjectFormSchema = z.object({
  _id: z.string(),
  name: z.string().min(5),
  description: z.string().min(5),
  carbonStandard: z.string().min(5),
  carbonQuantity: z.int().min(5),
  carbonPrice: z.int().optional(),
  country: z.string().min(5),
  image1Url: z.url().or(z.literal("")).optional(),
  image2Url: z.url().or(z.literal("")).optional(),
  image3Url: z.url().or(z.literal("")).optional(),
  videoUrl: z.url().or(z.literal("")).optional(),
  proofOfRetirementUrl: z.url().or(z.literal("")).optional(),
  voteCount: z.number().optional(),
});

export const ProjectFormDTOSchema = z.object({
  formData: ProjectFormSchema,
  adminPwd: z.string(),
});

export const VoteProjectDTOSchema = z.object({
  projectId: z.string(),
});

export type ProjectFormType = z.infer<typeof ProjectFormSchema>;
export type ProjectFormDTOType = z.infer<typeof ProjectFormDTOSchema>;
export type VoteProjectDTOType = z.infer<typeof VoteProjectDTOSchema>;
