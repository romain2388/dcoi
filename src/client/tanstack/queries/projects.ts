import { queryOptions } from "@tanstack/react-query";
import {
  getAllProjectsController,
  getProjectByIdController,
} from "@controller/functions/projects";

export const adminProjectsQueryOptions = () =>
  queryOptions({
    queryKey: ["adminProjects"],
    queryFn: () => getAllProjectsController(),
  });

export const getProjectByIdQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["getProject", id],
    queryFn: () => getProjectByIdController({ data: id }),
  });
