import { useMutation } from "@tanstack/react-query";
import {
  createProjectController,
  updateProjectController,
} from "@controller/functions/projects";

export function useCreateProjectMutation() {
  return useMutation({
    mutationFn: createProjectController,
  });
}

export function useUpdateProjectMutation() {
  return useMutation({
    mutationFn: updateProjectController,
  });
}
