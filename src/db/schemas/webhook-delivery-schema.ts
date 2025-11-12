import mongoose, { model } from "mongoose";

export const webhookDeliverySchema = new mongoose.Schema({
  deliveryId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  event: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const webhookDeliveryModel =
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  mongoose.models.WebhookDelivery ||
  model("WebhookDelivery", webhookDeliverySchema);
