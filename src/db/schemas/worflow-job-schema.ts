// filepath: /Volumes/T7/Projects/dcoi/src/db/schemas/workflow-job-schema.ts
import mongoose, { model } from "mongoose";

export const workflowJobSchema = new mongoose.Schema({
  jobId: {
    type: Number,
    required: true,
    unique: true,
    index: true,
  },
  repoId: {
    type: Number,
    required: true,
  },
  runId: {
    type: Number,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  conclusion: {
    type: String,
    required: false,
  },
  durationMs: {
    type: Number,
    required: false,
  },
  completedAt: {
    type: String,
    required: false,
    index: true,
  },
});

workflowJobSchema.index({ runId: 1, completedAt: 1 });

export const workflowJobModel =
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  mongoose.models.WorkflowJob || model("WorkflowJob", workflowJobSchema);
