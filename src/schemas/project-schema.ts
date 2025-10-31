import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
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

const ProjectTable = mongoose.model("Project", projectSchema);

export default ProjectTable;
