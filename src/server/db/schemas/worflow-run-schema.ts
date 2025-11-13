import mongoose, { model } from "mongoose";

export const workflowRunSchema = new mongoose.Schema({
  accountId: {
    type: Number,
    required: true,
    index: true,
  },
  repoId: {
    type: Number,
    required: true,
    index: true,
  },
  repoFullName: {
    type: String,
    required: true,
  },
  runId: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: false,
  },
  headBranch: {
    type: String,
    required: false,
  },
  conclusion: {
    type: String,
    required: false,
  },
  createdAt: {
    type: String,
    required: true,
    index: true,
  },
});

workflowRunSchema.index({ accountId: 1, createdAt: 1 });
workflowRunSchema.index({ repoId: 1, createdAt: 1 });

export const workflowRunModel =
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  mongoose.models.WorkflowRun || model("WorkflowRun", workflowRunSchema);
