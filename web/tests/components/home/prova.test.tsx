import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Prova } from "@/components/home/prova";
import { homeCases } from "@/lib/home-content";

describe("Prova", () => {
  it("renders one link per case, pointing at its page", () => {
    render(<Prova cases={homeCases()} />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(4);
    expect(links[0]).toHaveAttribute("href", "/trabalhos/hold-corretora");
  });

  it("shows each case title", () => {
    render(<Prova cases={homeCases()} />);
    expect(screen.getByText("Hold Corretora")).toBeInTheDocument();
    expect(screen.getByText("To Do Green")).toBeInTheDocument();
  });

  it("does not show the personal portfolio", () => {
    render(<Prova cases={homeCases()} />);
    expect(screen.queryByText(/Software Engineer Portfolio/i)).toBeNull();
  });

  it("renders nothing when there are no cases", () => {
    const { container } = render(<Prova cases={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
