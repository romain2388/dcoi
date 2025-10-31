import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ProjectFormDTOSchema } from "../dto/projects/project-form-struct";
import ProjectTable from "../schemas/project-schema";
import type {
  ProjectFormDTOType,
  ProjectFormType,
} from "../dto/projects/project-form-struct";

export const createProject = createServerFn()
  .inputValidator(ProjectFormDTOSchema)
  .handler(async ({ data }) => {
    if (data.adminPwd !== process.env.ADMIN_PWD) {
      throw new Error("Unauthorized");
    }
    await ProjectTable.create({
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
    await ProjectTable.updateOne(
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
    await ProjectTable.deleteOne({ _id: data });
  });

export const getAllProjects = createServerFn().handler(async () => {
  const projects = await ProjectTable.find();
  const serializableProjects = projects.map((p) => ({
    ...p,
    _id: p._id.toString(),
  })) as unknown as Array<ProjectFormDTOType>;
  return { success: true, projects: serializableProjects };
});

export const getProject = createServerFn()
  .inputValidator(z.string())
  .handler(async ({ data }) => {
    if (data === "") {
      return {
        project: {
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
        } as ProjectFormType,
      };
    }
    const project = await ProjectTable.findById(data);
    if (!project) {
      throw new Error("Project not found");
    }
    return {
      ...project,
      _id: project._id.toString(),
    } as ProjectFormType;
  });
