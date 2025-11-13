import mongoose, { model } from "mongoose";

export const accountSchema = new mongoose.Schema({
  githubAccountId: {
    type: Number,
    required: true,
    unique: true,
    index: true,
  },
  accountLogin: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    enum: ["User", "Organization"],
    required: true,
  },
  accountName: {
    type: String,
    required: false,
  },
  avatarUrl: {
    type: String,
    required: false,
  },
  htmlUrl: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const accountModel =
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  mongoose.models.Account || model("Account", accountSchema);
