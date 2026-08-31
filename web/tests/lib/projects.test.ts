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
    // Structural, not a marker list: a finite list of known placeholder
    // strings ("Substituir", "STUB", ...) only catches annotations someone
    // already thought of — it missed "[Adicionar URL pública e métricas se
    // houver]" in production because nobody had written "Adicionar" into the
    // list yet. A square bracket has no legitimate use in this renderable
    // copy (verified: none of summary/brief/process/outcome uses one for
    // anything else across the current data), so any "[" is rejected
    // outright. Do not narrow this back into a list of known words.
    const bracket = /\[/;
    for (const p of projects) {
      const copy = [p.summary, p.brief, p.process, p.outcome ?? ""];
      for (const field of copy) {
        expect(bracket.test(field), `${p.slug}: "${field.slice(0, 60)}…"`).toBe(
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
