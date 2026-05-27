import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ContatoChannels } from "@/components/contato/contato-channels";

describe("ContatoChannels", () => {
  it("renders the section heading", () => {
    render(<ContatoChannels />);
    expect(screen.getByText("Atalhos")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /se já decidiu/i }),
    ).toBeInTheDocument();
  });

  it("renders WhatsApp link with prefilled message and digits-only number", () => {
    render(<ContatoChannels />);
    const link = screen.getByRole("link", { name: /whatsapp/i });
    const href = link.getAttribute("href") ?? "";
    expect(href).toContain("wa.me/5534999194509");
    expect(href).toContain("text=");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders mailto link with the real email", () => {
    render(<ContatoChannels />);
    const link = screen.getByRole("link", { name: /email/i });
    expect(link).toHaveAttribute(
      "href",
      expect.stringContaining("mailto:guilherme@breq.com.br"),
    );
  });

  it("renders LinkedIn link to the real profile", () => {
    render(<ContatoChannels />);
    const link = screen.getByRole("link", { name: /linkedin/i });
    expect(link).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/guilhermebreq/",
    );
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("does not render Instagram while CONTACT.instagram is null", () => {
    render(<ContatoChannels />);
    expect(screen.queryByRole("link", { name: /instagram/i })).toBeNull();
  });
});
