import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CaseBlock } from "@/components/trabalhos/case-block";

describe("CaseBlock", () => {
  it("renders the title and body when there is copy", () => {
    render(<CaseBlock title="Resultado" body="Site no ar desde maio." />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Resultado",
    );
    expect(screen.getByText(/site no ar desde maio/i)).toBeInTheDocument();
  });

  it("renders nothing when the body is missing", () => {
    const { container } = render(<CaseBlock title="Resultado" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when the body is only whitespace", () => {
    const { container } = render(<CaseBlock title="Resultado" body="   " />);
    expect(container).toBeEmptyDOMElement();
  });
});
