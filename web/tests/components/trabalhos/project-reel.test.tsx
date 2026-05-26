import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeAll, vi } from "vitest";
import { ProjectReel } from "@/components/trabalhos/project-reel";
import type { Project } from "@/lib/projects";

const mockProjects: Project[] = [
  {
    slug: "alpha",
    title: "Alpha Studio",
    scope: "Identidade",
    year: 2026,
    summary: "Resumo do projeto alpha.",
    videoSrc: "/hero.mp4",
    meta: { cliente: "Alpha", setor: "Tech", entrega: "Brand" },
    brief: "brief",
    process: "process",
    outcome: "outcome",
  },
  {
    slug: "beta",
    title: "Beta Co",
    scope: "Site institucional",
    year: 2025,
    summary: "Resumo do projeto beta.",
    videoSrc: "/hero-2.mp4",
    meta: { cliente: "Beta", setor: "Serviço", entrega: "Site" },
    brief: "brief",
    process: "process",
    outcome: "outcome",
  },
];

beforeAll(() => {
  // happy-dom doesn't ship IntersectionObserver
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      disconnect() {}
      unobserve() {}
    },
  );
  // Silence HTMLMediaElement.play in happy-dom
  Object.defineProperty(HTMLMediaElement.prototype, "play", {
    configurable: true,
    value: () => Promise.resolve(),
  });
  Object.defineProperty(HTMLMediaElement.prototype, "pause", {
    configurable: true,
    value: () => {},
  });
});

describe("ProjectReel", () => {
  it("renders one slide per project", () => {
    render(<ProjectReel projects={mockProjects} />);
    expect(
      screen.getByRole("region", { name: /Alpha Studio/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: /Beta Co/i }),
    ).toBeInTheDocument();
  });

  it("shows the project title, scope and summary", () => {
    render(<ProjectReel projects={mockProjects} />);
    expect(screen.getByText("Alpha Studio")).toBeInTheDocument();
    expect(screen.getByText("Resumo do projeto alpha.")).toBeInTheDocument();
    const scopes = screen.getAllByText("Identidade");
    expect(scopes.length).toBeGreaterThan(0);
  });

  it("links each slide to its case study", () => {
    render(<ProjectReel projects={mockProjects} />);
    const links = screen
      .getAllByRole("link")
      .filter((a) => a.getAttribute("href")?.startsWith("/trabalhos/"));
    expect(links.map((a) => a.getAttribute("href"))).toEqual(
      expect.arrayContaining(["/trabalhos/alpha", "/trabalhos/beta"]),
    );
    expect(
      screen.getAllByRole("link", { name: /Ler capítulo/i }).length,
    ).toBe(mockProjects.length);
  });

  it("shows a counter with 01 / 02 on the first slide", () => {
    render(<ProjectReel projects={mockProjects} />);
    expect(screen.getByText("01 / 02")).toBeInTheDocument();
    expect(screen.getByText("02 / 02")).toBeInTheDocument();
  });
});
