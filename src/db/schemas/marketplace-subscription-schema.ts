// filepath: /Volumes/T7/Projects/dcoi/src/db/schemas/marketplace-subscription-schema.ts
import mongoose, { model } from "mongoose";

export const marketplaceSubscriptionSchema = new mongoose.Schema({
  accountId: {
    type: Number,
    required: true,
    index: true,
  },
  planId: {
    type: Number,
    required: true,
  },
  planName: {
    type: String,
    required: true,
  },
  billingCycle: {
    type: String,
    enum: ["monthly", "yearly"],
    required: false,
  },
  nextBillingDate: {
    type: String,
    required: false,
  },
  effectiveDate: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const marketplaceSubscriptionModel =
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  mongoose.models.MarketplaceSubscription ||
  model("MarketplaceSubscription", marketplaceSubscriptionSchema);
