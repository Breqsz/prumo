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
    const linkedins = screen
      .getAllByRole("link", { name: /linkedin/i })
      .map((l) => l.getAttribute("href"));
    expect(linkedins).toContain(
      "https://www.linkedin.com/company/prumo-digital/",
    );
    const whatsapp = screen.getByRole("link", { name: /whatsapp/i });
    expect(whatsapp).toHaveAttribute(
      "href",
      expect.stringContaining("wa.me/5534999194509"),
    );
    expect(whatsapp).toHaveAttribute("target", "_blank");
  });

  it("renders the company and personal Instagram links", () => {
    render(<QuemAssina />);
    const hrefs = screen
      .getAllByRole("link", { name: /instagram/i })
      .map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("https://www.instagram.com/prumo_digital/");
    expect(hrefs).toContain("https://www.instagram.com/carvalhoguilherme_/");
  });

  it("renders the profile card avatar image", () => {
    render(<QuemAssina />);
    const avatars = screen.getAllByAltText(/avatar/i);
    expect(avatars.length).toBeGreaterThan(0);
  });

  it("renders the second team member (Guilherme Carvalho) as Designer", () => {
    render(<QuemAssina />);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /guilherme carvalho guimar/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/^Equipe$/)).toBeInTheDocument();
    expect(screen.getByText(/^Designer$/)).toBeInTheDocument();
  });

  it("links Carvalho's portfolio, personal LinkedIn and Behance", () => {
    render(<QuemAssina />);
    const portfolio = screen.getByRole("link", { name: /portfólio/i });
    expect(portfolio).toHaveAttribute("href", "https://www.dsguilherme.com.br/");

    const behance = screen.getByRole("link", { name: /behance/i });
    expect(behance).toHaveAttribute(
      "href",
      "https://www.behance.net/guilherguimara18/projects",
    );

    const linkedins = screen
      .getAllByRole("link", { name: /linkedin/i })
      .map((l) => l.getAttribute("href"));
    expect(linkedins).toContain(
      "https://www.linkedin.com/in/guilherme-carvalho-13a194293/?locale=en",
    );
  });
});
