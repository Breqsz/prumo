import { describe, it, expect } from "vitest";
import { projects, getProject, getNextProject } from "@/lib/projects";

describe("projects data", () => {
  it("has at least one project", () => {
    expect(projects.length).toBeGreaterThan(0);
  });

  it("every project has unique slug", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every project carries title, scope, year, videoSrc and meta", () => {
    for (const p of projects) {
      expect(p.title).toBeTruthy();
      expect(p.scope).toBeTruthy();
      expect(p.year).toBeGreaterThan(2000);
      expect(/^(\/|https?:\/\/)/.test(p.videoSrc)).toBe(true);
      expect(p.meta.cliente).toBeTruthy();
      expect(p.meta.setor).toBeTruthy();
      expect(p.meta.entrega).toBeTruthy();
    }
  });

  it("every project has exactly 4 gallery images with /public paths", () => {
    for (const p of projects) {
      expect(p.gallery).toHaveLength(4);
      for (const src of p.gallery) {
        expect(src.startsWith("/")).toBe(true);
        expect(/\.(png|jpg|jpeg|webp|avif)$/i.test(src)).toBe(true);
      }
    }
  });

  it("no renderable copy carries draft annotations", () => {
    const draft = /\[Substituir|\bSTUB\b|Lorem ipsum/i;
    // Uppercase-only: a case-insensitive \bTODO\b also matches "Todo", the
    // Portuguese word for "all" (e.g. "Todo o conteúdo..." in `todo`'s process
    // copy) — legitimate prose, not a draft marker. Real markers are written
    // in caps by convention.
    const todoMarker = /\bTODO\b/;
    for (const p of projects) {
      const copy = [p.summary, p.brief, p.process, p.outcome ?? ""];
      for (const field of copy) {
        const hasDraftAnnotation = draft.test(field) || todoMarker.test(field);
        expect(hasDraftAnnotation, `${p.slug}: "${field.slice(0, 60)}…"`).toBe(
          false,
        );
      }
    }
  });
});

describe("getProject", () => {
  it("returns the project for a known slug", () => {
    const first = projects[0];
    expect(getProject(first.slug)).toBe(first);
  });

  it("returns undefined for an unknown slug", () => {
    expect(getProject("nao-existe-xyz")).toBeUndefined();
  });
});

describe("getNextProject", () => {
  it("returns the following project in the list", () => {
    expect(getNextProject(projects[0].slug)).toBe(projects[1]);
  });

  it("wraps around from the last to the first", () => {
    const last = projects[projects.length - 1];
    expect(getNextProject(last.slug)).toBe(projects[0]);
  });
});
