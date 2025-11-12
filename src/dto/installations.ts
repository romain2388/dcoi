import { z } from "zod";

export const upsertInstallationSchema = z.object({
  installationId: z.number(),
  accountId: z.number(),
});

export type UpsertInstallationInput = z.infer<typeof upsertInstallationSchema>;

export const recordWebhookDeliverySchema = z.object({
  deliveryId: z.string(),
  event: z.string(),
  action: z.string().optional(),
});

export type RecordWebhookDeliveryInput = z.infer<
  typeof recordWebhookDeliverySchema
>;
