import { createServerFn } from "@tanstack/react-start";
import { getRepoRunsWithPagination } from "@server/functions/workflows";
import { getRepoRunsWithPaginationSchema } from "../dto/worklows";

export const getRepoRunsWithPaginationController = createServerFn()
  .inputValidator(getRepoRunsWithPaginationSchema)
  .handler(async ({ data }) => {
    return await getRepoRunsWithPagination(data);
  });
