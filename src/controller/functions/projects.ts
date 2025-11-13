import { createServerFn } from "@tanstack/react-start";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  updateProject,
} from "@server/functions/projects";
import { z } from "zod";
import { ProjectFormDTOSchema } from "../dto/projects";

export const createProjectController = createServerFn()
  .inputValidator(ProjectFormDTOSchema)
  .handler(async ({ data }) => {
    if (data.adminPwd !== process.env.ADMIN_PASSWORD) {
      throw new Error("Unauthorized");
    }
    await createProject(data.formData);
  });

export const updateProjectController = createServerFn()
  .inputValidator(ProjectFormDTOSchema)
  .handler(async ({ data }) => {
    if (data.adminPwd !== process.env.ADMIN_PWD) {
      throw new Error("Unauthorized");
    }
    await updateProject(data.formData);
  });

export const deleteProjectController = createServerFn()
  .inputValidator(z.string())
  .handler(async ({ data }) => {
    await deleteProject(data);
  });

export const getAllProjectsController = createServerFn().handler(async () => {
  return await getAllProjects();
});

export const getProjectByIdController = createServerFn()
  .inputValidator(z.string())
  .handler(async ({ data }) => {
    return await getProjectById(data);
  });
