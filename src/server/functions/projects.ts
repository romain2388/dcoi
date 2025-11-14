import { createServerOnlyFn } from "@tanstack/react-start";
import databaseConnect from "../db/mongoose";
import { projectModel } from "../db/schemas/project-schema";
import type { ProjectFormType } from "@controller/dto/projects";

export const createProject = createServerOnlyFn(
  async (data: ProjectFormType) => {
    await databaseConnect();
    await projectModel.create({
      name: data.name,
      description: data.description,
      carbonStandard: data.carbonStandard,
      carbonQuantity: data.carbonQuantity,
      carbonPrice: data.carbonPrice,
      country: data.country,
      image1Url: data.image1Url,
      image2Url: data.image2Url,
      image3Url: data.image3Url,
      videoUrl: data.videoUrl,
      proofOfRetirementUrl: data.proofOfRetirementUrl,
    });
  },
);

export const updateProject = createServerOnlyFn(
  async (data: ProjectFormType) => {
    await databaseConnect();
    await projectModel.updateOne(
      { _id: data._id },
      {
        name: data.name,
        description: data.description,
        carbonStandard: data.carbonStandard,
        carbonQuantity: data.carbonQuantity,
        carbonPrice: data.carbonPrice,
        country: data.country,
        image1Url: data.image1Url,
        image2Url: data.image2Url,
        image3Url: data.image3Url,
        videoUrl: data.videoUrl,
        proofOfRetirementUrl: data.proofOfRetirementUrl,
      },
    );
  },
);

export const deleteProject = createServerOnlyFn(async (data: string) => {
  await databaseConnect();
  await projectModel.deleteOne({ _id: data });
});

export const getAllProjects = createServerOnlyFn(async () => {
  await databaseConnect();
  const projects = await projectModel.find().lean();
  return projects.map((p) => ({
    _id: p._id?.toString(),
    name: p.name,
    description: p.description,
    carbonStandard: p.carbonStandard,
    carbonQuantity: p.carbonQuantity,
    carbonPrice: p.carbonPrice,
    country: p.country,
    image1Url: p.image1Url,
    image2Url: p.image2Url,
    image3Url: p.image3Url,
    videoUrl: p.videoUrl,
    proofOfRetirementUrl: p.proofOfRetirementUrl,
  })) as Array<ProjectFormType>;
});

export const getProjectById = createServerOnlyFn(async (data: string) => {
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
    _id: project._id?.toString(),
    name: project.name,
    description: project.description,
    carbonStandard: project.carbonStandard,
    carbonQuantity: project.carbonQuantity,
    carbonPrice: project.carbonPrice,
    country: project.country,
    image1Url: project.image1Url,
    image2Url: project.image2Url,
    image3Url: project.image3Url,
    videoUrl: project.videoUrl,
    proofOfRetirementUrl: project.proofOfRetirementUrl,
  } as ProjectFormType;
});

export const getFundedProjects = createServerOnlyFn(async () => {
  await databaseConnect();
  const projects = await projectModel
    .find({
      proofOfRetirementUrl: { $exists: true, $ne: "" },
    })
    .lean();
  return projects.map((p) => ({
    _id: p._id?.toString(),
    name: p.name,
    description: p.description,
    carbonStandard: p.carbonStandard,
    carbonQuantity: p.carbonQuantity,
    carbonPrice: p.carbonPrice,
    country: p.country,
    image1Url: p.image1Url,
    image2Url: p.image2Url,
    image3Url: p.image3Url,
    videoUrl: p.videoUrl,
    proofOfRetirementUrl: p.proofOfRetirementUrl,
  })) as Array<ProjectFormType>;
});

export const getVotingProjects = createServerOnlyFn(async () => {
  await databaseConnect();
  const projects = await projectModel
    .find({
      $or: [
        { proofOfRetirementUrl: { $exists: false } },
        { proofOfRetirementUrl: "" },
      ],
    })
    .lean();
  return projects.map((p) => ({
    _id: p._id?.toString(),
    name: p.name,
    description: p.description,
    carbonStandard: p.carbonStandard,
    carbonQuantity: p.carbonQuantity,
    carbonPrice: p.carbonPrice,
    country: p.country,
    image1Url: p.image1Url,
    image2Url: p.image2Url,
    image3Url: p.image3Url,
    videoUrl: p.videoUrl,
    proofOfRetirementUrl: p.proofOfRetirementUrl,
    voteCount: p.voteCount || 0,
  })) as Array<ProjectFormType>;
});

export const voteForProject = createServerOnlyFn(
  async (data: { projectId: string }) => {
    await databaseConnect();

    // Vérifier si le projet existe et n'est pas déjà financé
    const project = await projectModel.findById(data.projectId);
    if (!project) {
      throw new Error("Project not found");
    }
    if (project.proofOfRetirementUrl && project.proofOfRetirementUrl !== "") {
      throw new Error("Cannot vote for already funded project");
    }

    // Incrémenter le compteur de votes
    const updatedProject = await projectModel.findByIdAndUpdate(
      data.projectId,
      { $inc: { voteCount: 1 } },
      { new: true },
    );

    return {
      success: true,
      voteCount: updatedProject?.voteCount || 0,
    };
  },
);
