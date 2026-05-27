import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { QuemAssina } from "@/components/sobre/quem-assina";

describe("QuemAssina", () => {
  it("renders the section heading with the real name", () => {
    render(<QuemAssina />);
    expect(
      screen.getByRole("heading", { level: 2, name: /guilherme rocha bianchini/i }),
    ).toBeInTheDocument();
  });

  it("renders the eyebrow label", () => {
    render(<QuemAssina />);
    expect(screen.getByText(/^Quem assina$/)).toBeInTheDocument();
  });

  it("renders LinkedIn and WhatsApp social links with real URLs", () => {
    render(<QuemAssina />);
    const linkedin = screen.getByRole("link", { name: /linkedin/i });
    const whatsapp = screen.getByRole("link", { name: /whatsapp/i });
    expect(linkedin).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/guilhermebreq/",
    );
    expect(whatsapp).toHaveAttribute(
      "href",
      expect.stringContaining("wa.me/5534999194509"),
    );
    expect(linkedin).toHaveAttribute("target", "_blank");
    expect(whatsapp).toHaveAttribute("target", "_blank");
  });

  it("does not render Instagram while CONTACT.instagram is null", () => {
    render(<QuemAssina />);
    expect(screen.queryByRole("link", { name: /instagram/i })).toBeNull();
  });

  it("renders the profile card avatar image", () => {
    render(<QuemAssina />);
    const avatars = screen.getAllByAltText(/avatar/i);
    expect(avatars.length).toBeGreaterThan(0);
  });
});
