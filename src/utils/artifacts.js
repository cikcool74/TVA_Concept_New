import { ARTIFACTS } from "../data/artifacts";

const uid = () => Math.random().toString(36).slice(2);

export const generateRandomArtifact = (existing = []) => {
  const existingBaseIds = new Set(existing.map((a) => a.baseId));
  const pool = ARTIFACTS.filter((a) => !existingBaseIds.has(a.baseId));
  const pick = pool.length ? pool[Math.floor(Math.random() * pool.length)] : ARTIFACTS[Math.floor(Math.random() * ARTIFACTS.length)];
  return { ...pick, id: `${pick.baseId}-${uid()}` };
};

export const ensureArtifactIds = (items) =>
  (items || []).map((a, idx) => ({
    ...a,
    id: a.id || `${a.baseId || "artifact"}-${idx}`,
    baseId: a.baseId || a.id || `base-${idx}`,
  }));
