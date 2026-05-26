import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ProfileCard } from "@/components/effects/profile-card";

describe("ProfileCard", () => {
  it("renders name, title, handle and status", () => {
    render(
      <ProfileCard
        name="Fulano de Tal"
        title="Founder"
        handle="fulano"
        status="Disponível"
        contactText="Falar comigo"
      />,
    );
    expect(
      screen.getByRole("heading", { level: 3, name: /fulano de tal/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Founder")).toBeInTheDocument();
    expect(screen.getByText("@fulano")).toBeInTheDocument();
    expect(screen.getByText("Disponível")).toBeInTheDocument();
  });

  it("fires onContactClick when the contact button is clicked", () => {
    const onContactClick = vi.fn();
    render(
      <ProfileCard
        name="X"
        contactText="Contato"
        onContactClick={onContactClick}
      />,
    );
    screen.getByRole("button", { name: /contact x/i }).click();
    expect(onContactClick).toHaveBeenCalledTimes(1);
  });

  it("hides the user info section when showUserInfo is false", () => {
    render(<ProfileCard name="X" handle="x" showUserInfo={false} />);
    expect(screen.queryByText("@x")).not.toBeInTheDocument();
  });
});
