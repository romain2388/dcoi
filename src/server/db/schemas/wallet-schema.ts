import mongoose, { model } from "mongoose";

export const walletSchema = new mongoose.Schema({
  accountId: {
    type: Number,
    required: true,
    unique: true,
    index: true,
  },
  balanceCredits: {
    type: Number,
    required: true,
    default: 0,
  },
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const walletModel =
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  mongoose.models.Wallet || model("Wallet", walletSchema);
