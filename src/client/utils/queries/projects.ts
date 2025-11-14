import { queryOptions } from "@tanstack/react-query";
import {
  getAllProjectsController,
  getFundedProjectsController,
  getProjectByIdController,
  getVotingProjectsController,
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

export const fundedProjectsQueryOptions = () =>
  queryOptions({
    queryKey: ["fundedProjects"],
    queryFn: () => getFundedProjectsController(),
  });

export const votingProjectsQueryOptions = () =>
  queryOptions({
    queryKey: ["votingProjects"],
    queryFn: () => getVotingProjectsController(),
  });
