import mongoose, { model } from "mongoose";

export const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  carbonStandard: {
    type: String,
    required: true,
  },
  carbonQuantity: {
    type: Number,
    required: true,
  },
  carbonPrice: {
    type: Number,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  image1Url: {
    type: String,
    required: true,
  },
  image2Url: {
    type: String,
    required: true,
  },
  image3Url: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  proofOfRetirementUrl: {
    type: String,
    required: true,
  },
});
export const projectModel =
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  mongoose.models.Project || model("Project", projectSchema);
