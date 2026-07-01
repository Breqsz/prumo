import { describe, it, expect } from "vitest";
import { CRIAR_PLANS, MANTER_PLANS, PLAN_SETS, featuredSlug } from "@/lib/plans";

describe("plans data", () => {
  it("has three criar and three manter plans", () => {
    expect(CRIAR_PLANS).toHaveLength(3);
    expect(MANTER_PLANS).toHaveLength(3);
  });
  it("each set has exactly one featured plan", () => {
    expect(CRIAR_PLANS.filter((p) => p.featured)).toHaveLength(1);
    expect(MANTER_PLANS.filter((p) => p.featured)).toHaveLength(1);
  });
  it("featuredSlug returns the featured plan's slug per mode", () => {
    expect(featuredSlug("criar")).toBe("institucional");
    expect(featuredSlug("manter")).toBe("crescimento");
  });
  it("PLAN_SETS maps modes to arrays", () => {
    expect(PLAN_SETS.criar).toBe(CRIAR_PLANS);
    expect(PLAN_SETS.manter).toBe(MANTER_PLANS);
  });
});
