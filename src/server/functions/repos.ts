import { createServerOnlyFn } from "@tanstack/react-start";
import { upsertRepoSchema } from "@controller/dto/repos";
import { repoModel } from "../db/schemas/repo-schema";
import { getInstallationOctokit, paginateAll } from "../utilities.github";

export const upsertRepo = createServerOnlyFn(
  async (arguments_: {
    repoId: number;
    fullName: string;
    name: string;
    ownerId: number;
    private: boolean;
    visibility?: string;
  }) => {
    const validated = upsertRepoSchema.parse(arguments_);

    const existing = await repoModel.findOne({
      repoId: validated.repoId,
    });
    if (existing) {
      return repoModel.findByIdAndUpdate(existing._id, validated);
    }
    return await repoModel.create(validated);
  },
);

export const syncInstallationRepos = createServerOnlyFn(
  async (data: { installationId: number; accountId: number }) => {
    const octokit = getInstallationOctokit(data.installationId);
    const repos = await paginateAll<any>(
      octokit,
      octokit.rest.apps.listReposAccessibleToInstallation,
      {},
    );
    const mapped = repos.map((r) => ({
      repoId: r.id,
      fullName: r.full_name,
      name: r.name,
      private: !!r.private,
      ownerId: r.owner.id,
    }));
    for (const r of mapped) {
      await upsertRepo(r);
    }
  },
);
