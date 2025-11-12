// filepath: /Volumes/T7/Projects/dcoi/src/db/schemas/repo-schema.ts
import mongoose, { model } from "mongoose";

export const repoSchema = new mongoose.Schema({
  repoId: {
    type: Number,
    required: true,
    unique: true,
    index: true,
  },
  fullName: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  ownerId: {
    type: Number,
    required: true,
    index: true,
  },
  private: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const repoModel =
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  mongoose.models.Repo || model("Repo", repoSchema);
