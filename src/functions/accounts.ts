import { createServerOnlyFn } from "@tanstack/react-start";
import { accountModel } from "../db/schemas/account-schema";
import { offsetUserWalletSchema, offsetWalletSchema } from "../dto/accounts";
import { marketplaceSubscriptionModel } from "../db/schemas/marketplace-subscription-schema";
import { walletModel } from "../db/schemas/wallet-schema";
import { getAppLevelOctokit } from "../utilities.github";
import type {
  MarketplacePayloadType,
  UpsertAccountType,
} from "../dto/accounts";

export const upsertAccount = createServerOnlyFn(
  async (data: UpsertAccountType) => {
    const existing = await accountModel.findOne({
      githubAccountId: data.githubAccountId,
    });

    if (existing) {
      return existing;
    }

    return await accountModel.create(data);
  },
);

export const patchAccountDetails = createServerOnlyFn(
  async (data: UpsertAccountType) => {
    await accountModel.findOneAndUpdate(
      { githubAccountId: data.githubAccountId },
      data,
    );
  },
);

export const upsertMarketplace = createServerOnlyFn(
  async (data: MarketplacePayloadType) => {
    const current = await marketplaceSubscriptionModel.findOne({
      accountId: data.accountId,
    });

    await (current
      ? marketplaceSubscriptionModel.findByIdAndUpdate(current._id, data)
      : marketplaceSubscriptionModel.create(data));
  },
);

export const offsetRunwCommunityWallet = createServerOnlyFn(
  async (data: { creditsDelta: number }) => {
    const validated = offsetWalletSchema.parse(data);
    const wallet = await walletModel.findOne();

    const balance = wallet.balanceCredits - validated.creditsDelta;

    if (balance < 0) {
      return false;
    }

    await walletModel.findByIdAndUpdate(wallet._id, {
      balanceCredits: balance,
    });

    return true;
  },
);

export const offsetRunwUserWallet = createServerOnlyFn(
  async (data: { repoOwnerId: number; creditsDelta: number }) => {
    const validated = offsetUserWalletSchema.parse(data);
    const wallet = await walletModel.findOne({
      accountId: validated.repoOwnerId,
    });

    if (!wallet) {
      return false;
    }

    const balance = wallet.balanceCredits - validated.creditsDelta;

    if (balance < 0) {
      return false;
    }

    await walletModel.findByIdAndUpdate(wallet._id, {
      balanceCredits: balance,
    });

    return true;
  },
);

export const getMarketPlacesToUpdate = createServerOnlyFn(async () => {
  const now = Date.now();

  return marketplaceSubscriptionModel.find({
    nextBillingDate: { $lt: new Date(now) },
  });
});

export const feedCarbon = createServerOnlyFn(
  async (arguments_: {
    planId: number;
    billingCycle: "monthly" | "yearly";
    accountId: number;
  }) => {
    const creditMap: Record<
      number,
      { monthly: [number, number]; yearly: [number, number] }
    > = {
      2: { monthly: [0, 100], yearly: [0, 1200] },
      3: { monthly: [0, 200], yearly: [0, 2400] },
      4: { monthly: [0, 500], yearly: [0, 6000] },
      5: { monthly: [80, 20], yearly: [1000, 200] },
      6: { monthly: [160, 40], yearly: [2000, 500] },
      7: { monthly: [400, 100], yearly: [5000, 1500] },
    };

    const plansCredits = creditMap[arguments_.planId];
    const credits =
      arguments_.billingCycle === "monthly"
        ? plansCredits.monthly
        : plansCredits.yearly;
    const [creditsToAddUser, creditsToAddCommunity] = credits;

    if (creditsToAddCommunity > 0) {
      const wallet = await walletModel.findOne();

      await walletModel.findByIdAndUpdate(wallet._id, {
        balanceCredits: wallet.balanceCredits + creditsToAddCommunity,
      });
    }

    if (creditsToAddUser > 0) {
      const wallet = await walletModel.findOne({
        accountId: arguments_.accountId,
      });

      if (wallet) {
        await walletModel.findByIdAndUpdate(wallet._id, {
          balanceCredits: wallet.balanceCredits + creditsToAddUser,
        });
      }
    }
  },
);

export const refreshAccountDetails = createServerOnlyFn(
  async (data: {
    githubAccountId: number;
    accountLogin: string;
    accountType: "User" | "Organization";
  }) => {
    const octokit = getAppLevelOctokit();
    if (data.accountType === "Organization") {
      const organisation = await octokit.rest.orgs.get({
        org: data.accountLogin,
      });
      await patchAccountDetails({
        githubAccountId: data.githubAccountId,
        accountLogin: data.accountLogin,
        accountType: data.accountType,
        accountName: organisation.data.name,
        avatarUrl: organisation.data.avatar_url,
        htmlUrl: organisation.data.html_url,
      });
    } else {
      const user = await octokit.rest.users.getByUsername({
        username: data.accountLogin,
      });
      await patchAccountDetails({
        githubAccountId: data.githubAccountId,
        accountLogin: data.accountLogin,
        accountType: data.accountType,
        accountName: user.data.name ?? "",
        avatarUrl: user.data.avatar_url,
        htmlUrl: user.data.html_url,
      });
    }
  },
);

export const syncMarketplaces = createServerOnlyFn(async () => {
  const octokit = getAppLevelOctokit();
  const marketplaces = await getMarketPlacesToUpdate();
  for (const marketplace of marketplaces) {
    const remoteMarketplace = await octokit.request(
      "GET /marketplace_listing/accounts/{account_id}",
      {
        account_id: marketplace.accountId,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );

    const mp = remoteMarketplace.data.marketplace_purchase;
    const plan = mp.plan;
    if (!plan) throw new Error("Could not find a plan");
    await upsertMarketplace({
      accountId: marketplace.accountId,
      planId: plan.id,
      planName: plan.name,
      billingCycle: mp.billing_cycle as "monthly" | "yearly",
      nextBillingDate: mp.next_billing_date ?? "",
    });

    await feedCarbon({
      planId: plan.id,
      billingCycle: mp.billing_cycle as "monthly" | "yearly",
      accountId: marketplace.accountId,
    });
  }
});
