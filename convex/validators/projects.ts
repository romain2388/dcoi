import { Infer, v } from "convex/values";

export const ProjectValidator = v.object({
  _id: v.string(),
  name: v.string(),
  description: v.string(),
  carbonStandard: v.string(),
  carbonQuantity: v.int64(),
  carbonPrice: v.number(),
  country: v.string(),
  image1Url: v.string(),
  image2Url: v.string(),
  image3Url: v.string(),
  videoUrl: v.string(),
  proofOfRetirementUrl: v.string(),
});

export const ProjectValidatorWPwd = v.object({
  formData: ProjectValidator,
  adminPwd: v.string(),
});
