import { Octokit } from "octokit";
import { createAppAuth } from "@octokit/auth-app";
import { verify } from "@octokit/webhooks-methods";

const getAppId = () => Number(process.env.GITHUB_APP_ID);
const getPrivateKey = () => {
  const pk = process.env.GITHUB_APP_PRIVATE_KEY;
  if (!pk) throw new Error("GITHUB_APP_PRIVATE_KEY missing");
  return pk;
};
export function getInstallationOctokit(installationId: number) {
  return new Octokit({
    authStrategy: createAppAuth,
    auth: { appId: getAppId(), privateKey: getPrivateKey(), installationId },
  });
}
export function getAppLevelOctokit() {
  return new Octokit({
    authStrategy: createAppAuth,
    auth: { appId: getAppId(), privateKey: getPrivateKey() },
  });
}
export async function verifyWebhookSignature(
  rawBody: ArrayBuffer,
  signature256: string | null,
) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret || !signature256) return false;
  const payload = Buffer.from(rawBody).toString("utf8");
  return await verify(secret, payload, signature256);
}
export async function paginateAll<T = any>(
  octokit: Octokit,
  route: any,
  parameters: any,
) {
  return await octokit.paginate<T>(route, { per_page: 100, ...parameters });
}
