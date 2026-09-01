import { describe, it, expect } from "vitest";
import { HOME_CASE_SLUGS, homeCases } from "@/lib/home-content";
import { projects } from "@/lib/projects";

describe("HOME_CASE_SLUGS", () => {
  it("lists the four cases chosen for the home", () => {
    expect([...HOME_CASE_SLUGS]).toEqual([
      "hold-corretora",
      "todo",
      "desafog-ai",
      "bereading",
    ]);
  });

  it("leaves the personal portfolio out", () => {
    expect(HOME_CASE_SLUGS).not.toContain("breq-dev");
  });

  it("only references slugs that exist", () => {
    const known = new Set(projects.map((p) => p.slug));
    for (const slug of HOME_CASE_SLUGS) expect(known.has(slug)).toBe(true);
  });
});

describe("homeCases", () => {
  it("returns the projects in the declared order", () => {
    expect(homeCases().map((p) => p.slug)).toEqual([...HOME_CASE_SLUGS]);
  });

  it("does not depend on the order inside projects.ts", () => {
    expect(homeCases()).toHaveLength(4);
    expect(projects.length).toBeGreaterThan(4);
  });
});
