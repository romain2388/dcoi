import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ProjectValidatorWPwd } from "./validators/projects";
import type { Id } from "./_generated/dataModel";

export const get = query({
  args: { projectId: v.id("projects") },
  handler: async (context, arguments_) => {
    return await context.db
      .query("projects")
      .filter((p) => p.eq(p.field("_id"), arguments_.projectId))
      .collect();
  },
});

export const getAll = query({
  args: {},
  handler: async (context) => {
    return await context.db.query("projects").collect();
  },
});

export const createProject = mutation({
  args: { ProjectValidatorWPwd },
  handler: async (context, arguments_) => {
    return await context.db.insert("projects", {
      name: arguments_.ProjectValidatorWPwd.formData.name,
      description: arguments_.ProjectValidatorWPwd.formData.description,
      carbonStandard: arguments_.ProjectValidatorWPwd.formData.carbonStandard,
      carbonQuantity: arguments_.ProjectValidatorWPwd.formData.carbonQuantity,
      carbonPrice: arguments_.ProjectValidatorWPwd.formData.carbonPrice,
      country: arguments_.ProjectValidatorWPwd.formData.country,
      image1Url: arguments_.ProjectValidatorWPwd.formData.image1Url,
      image2Url: arguments_.ProjectValidatorWPwd.formData.image2Url,
      image3Url: arguments_.ProjectValidatorWPwd.formData.image3Url,
      videoUrl: arguments_.ProjectValidatorWPwd.formData.videoUrl,
      proofOfRetirementUrl:
        arguments_.ProjectValidatorWPwd.formData.proofOfRetirementUrl,
    });
  },
});

export const updateProject = mutation({
  args: { ProjectValidatorWPwd },
  handler: async (context, arguments_) => {
    return await context.db.patch(
      arguments_.ProjectValidatorWPwd.formData._id as Id<"projects">,
      {
        name: arguments_.ProjectValidatorWPwd.formData.name,
        description: arguments_.ProjectValidatorWPwd.formData.description,
        carbonStandard: arguments_.ProjectValidatorWPwd.formData.carbonStandard,
        carbonQuantity: arguments_.ProjectValidatorWPwd.formData.carbonQuantity,
        carbonPrice: arguments_.ProjectValidatorWPwd.formData.carbonPrice,
        country: arguments_.ProjectValidatorWPwd.formData.country,
        image1Url: arguments_.ProjectValidatorWPwd.formData.image1Url,
        image2Url: arguments_.ProjectValidatorWPwd.formData.image2Url,
        image3Url: arguments_.ProjectValidatorWPwd.formData.image3Url,
        videoUrl: arguments_.ProjectValidatorWPwd.formData.videoUrl,
        proofOfRetirementUrl:
          arguments_.ProjectValidatorWPwd.formData.proofOfRetirementUrl,
      },
    );
  },
});
