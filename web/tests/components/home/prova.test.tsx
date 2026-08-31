import { render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Prova } from "@/components/home/prova";
import { homeCases } from "@/lib/home-content";

describe("Prova", () => {
  it("links each case to its own page", () => {
    render(<Prova cases={homeCases()} />);
    const caseLinks = screen
      .getAllByRole("link")
      .filter((a) => a.getAttribute("href")?.startsWith("/trabalhos/"));
    expect(caseLinks).toHaveLength(4);
    expect(caseLinks[0]).toHaveAttribute("href", "/trabalhos/hold-corretora");
  });

  it("shows each case title", () => {
    render(<Prova cases={homeCases()} />);
    expect(screen.getByText("Hold Corretora")).toBeInTheDocument();
    expect(screen.getByText("To Do Green")).toBeInTheDocument();
  });

  it("carries the services index that replaced the standalone section", () => {
    render(<Prova cases={homeCases()} />);
    const list = screen.getByRole("list");
    expect(within(list).getAllByRole("listitem")).toHaveLength(3);
    expect(within(list).getByText("Sites institucionais")).toBeInTheDocument();
  });

  it("points the services index at the services hub", () => {
    render(<Prova cases={homeCases()} />);
    expect(
      screen.getByRole("link", { name: /ver serviços em detalhe/i }),
    ).toHaveAttribute("href", "/servicos");
  });

  it("leaves the case images out of the accessibility tree", () => {
    // O título do case já é o texto do link. Um alt repetindo o título faria
    // o leitor de tela anunciar cada card duas vezes.
    render(<Prova cases={homeCases()} />);
    expect(screen.queryAllByRole("img")).toHaveLength(0);
  });

  it("renders nothing when there are no cases", () => {
    const { container } = render(<Prova cases={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
