// filepath: /Volumes/T7/Projects/dcoi/src/db/schemas/installation-repo-schema.ts
import mongoose, { model } from "mongoose";

export const installationRepoSchema = new mongoose.Schema({
  installationId: {
    type: Number,
    required: true,
    index: true,
  },
  repoId: {
    type: Number,
    required: true,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const installationRepoModel =
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  mongoose.models.InstallationRepo ||
  model("InstallationRepo", installationRepoSchema);
