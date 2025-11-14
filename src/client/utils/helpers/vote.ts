// Gère le délai de vote dans le localStorage
const VOTE_COOLDOWN_KEY = "dcoi_vote_cooldown";
const VOTE_COOLDOWN_MS = 60 * 60 * 1000; // 1 heure

export function canVote(projectId: string): boolean {
  const cooldowns = getVoteCooldowns();
  const lastVote = cooldowns[projectId];

  if (!lastVote) return true;

  const currentTime = Date.now();
  const timeSinceLastVote = currentTime - lastVote;

  return timeSinceLastVote >= VOTE_COOLDOWN_MS;
}

export function getRemainingCooldown(projectId: string): number {
  const cooldowns = getVoteCooldowns();
  const lastVote = cooldowns[projectId];

  if (!lastVote) return 0;

  const currentTime = Date.now();
  const timeSinceLastVote = currentTime - lastVote;
  const remaining = VOTE_COOLDOWN_MS - timeSinceLastVote;

  return Math.max(0, remaining);
}

export function setVoteCooldown(projectId: string): void {
  const cooldowns = getVoteCooldowns();
  cooldowns[projectId] = Date.now();
  localStorage.setItem(VOTE_COOLDOWN_KEY, JSON.stringify(cooldowns));
}

function getVoteCooldowns(): Record<string, number> {
  try {
    const stored = localStorage.getItem(VOTE_COOLDOWN_KEY);
    if (!stored) return {};
    return JSON.parse(stored) as Record<string, number>;
  } catch {
    return {};
  }
}

export function formatCooldownTime(milliseconds: number): string {
  const minutes = Math.ceil(milliseconds / 60_000);
  if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? "s" : ""}`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours} heure${hours > 1 ? "s" : ""}`;
  }
  return `${hours}h ${remainingMinutes}min`;
}
