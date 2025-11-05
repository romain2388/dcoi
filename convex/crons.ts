import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "sync marketplace",
  { hourUTC: 3, minuteUTC: 0 },
  internal.wnode.syncMarketplaces,
);
