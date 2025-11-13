import mongoose, { model } from "mongoose";

export const installationSchema = new mongoose.Schema({
  installationId: {
    type: Number,
    required: true,
    unique: true,
    index: true,
  },
  accountId: {
    type: Number,
    required: true,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const installationModel =
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  mongoose.models.Installation || model("Installation", installationSchema);
