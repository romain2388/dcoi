import { createServerOnlyFn } from "@tanstack/react-start";
import {
  recordWebhookDeliverySchema,
  upsertInstallationSchema,
} from "../dto/installations";
import { installationModel } from "../db/schemas/installation-schema";
import { webhookDeliveryModel } from "../db/schemas/webhook-delivery-schema";

export const upsertInstallation = createServerOnlyFn(
  async (arguments_: { installationId: number; accountId: number }) => {
    const validated = upsertInstallationSchema.parse(arguments_);

    const existing = await installationModel.findOne({
      installationId: validated.installationId,
    });

    if (existing) {
      return installationModel.findByIdAndUpdate(existing._id, validated, {
        new: true,
      });
    }

    return await installationModel.create(validated);
  },
);

export const recordWebhookDelivery = createServerOnlyFn(
  async (arguments_: {
    deliveryId: string;
    event: string;
    action?: string;
  }) => {
    const validated = recordWebhookDeliverySchema.parse(arguments_);

    const existing = await webhookDeliveryModel.findOne({
      deliveryId: validated.deliveryId,
    });

    if (existing) {
      return false;
    }

    await webhookDeliveryModel.create(validated);
    return true;
  },
);
