import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ProjectFormDTOSchema } from "../dto/projects";
import databaseConnect from "../db/mongoose";
import { projectModel } from "../db/schemas/project-schema";
import type { ProjectFormType } from "../dto/projects";

export const createProject = createServerFn()
  .inputValidator(ProjectFormDTOSchema)
  .handler(async ({ data }) => {
    if (data.adminPwd !== process.env.ADMIN_PWD) {
      throw new Error("Unauthorized");
    }
    await databaseConnect();
    await projectModel.create({
      name: data.formData.name,
      description: data.formData.description,
      carbonStandard: data.formData.carbonStandard,
      carbonQuantity: data.formData.carbonQuantity,
      carbonPrice: data.formData.carbonPrice,
      country: data.formData.country,
      image1Url: data.formData.image1Url,
      image2Url: data.formData.image2Url,
      image3Url: data.formData.image3Url,
      videoUrl: data.formData.videoUrl,
      proofOfRetirementUrl: data.formData.proofOfRetirementUrl,
    });
  });

export const updateProject = createServerFn()
  .inputValidator(ProjectFormDTOSchema)
  .handler(async ({ data }) => {
    if (data.adminPwd !== process.env.ADMIN_PWD) {
      throw new Error("Unauthorized");
    }
    await databaseConnect();
    await projectModel.updateOne(
      { _id: data.formData._id },
      {
        name: data.formData.name,
        description: data.formData.description,
        carbonStandard: data.formData.carbonStandard,
        carbonQuantity: data.formData.carbonQuantity,
        carbonPrice: data.formData.carbonPrice,
        country: data.formData.country,
        image1Url: data.formData.image1Url,
        image2Url: data.formData.image2Url,
        image3Url: data.formData.image3Url,
        videoUrl: data.formData.videoUrl,
        proofOfRetirementUrl: data.formData.proofOfRetirementUrl,
      },
    );
  });

export const deleteProject = createServerFn()
  .inputValidator(z.string())
  .handler(async ({ data }) => {
    await databaseConnect();
    await projectModel.deleteOne({ _id: data });
  });

export const getAllProjects = createServerFn().handler(async () => {
  console.log("getAllProjects");
  await databaseConnect();
  const projects = await projectModel.find();
  return projects.map((p) => ({
    ...p,
    _id: p._id.toString(),
  })) as Array<ProjectFormType>;
});

export const getProject = createServerFn()
  .inputValidator(z.string())
  .handler(async ({ data }) => {
    console.log("getProject called with id:", data);
    if (data === "0") {
      return {
        _id: "0",
        name: "",
        description: "",
        carbonStandard: "",
        carbonQuantity: 0,
        carbonPrice: 0,
        country: "",
        image1Url: "",
        image2Url: "",
        image3Url: "",
        videoUrl: "",
        proofOfRetirementUrl: "",
      } as ProjectFormType;
    }
    await databaseConnect();
    const project = await projectModel.findById(data);
    if (!project) {
      throw new Error("Project not found");
    }
    return {
      ...project,
      _id: project._id.toString(),
    } as ProjectFormType;
  });
