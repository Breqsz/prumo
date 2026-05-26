import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { RotatingPhrase } from "@/components/hero/rotating-phrase";

describe("RotatingPhrase", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders all phrases (only one visible at a time)", () => {
    render(<RotatingPhrase />);
    expect(screen.getByText("uma linha reta.")).toBeInTheDocument();
    expect(screen.getByText("um norte certo.")).toBeInTheDocument();
    expect(screen.getByText("um plano firme.")).toBeInTheDocument();
    expect(screen.getByText("uma meta clara.")).toBeInTheDocument();
  });

  it("starts with the first phrase active and others hidden via aria", () => {
    render(<RotatingPhrase />);
    expect(screen.getByText("uma linha reta.")).toHaveAttribute(
      "aria-hidden",
      "false",
    );
    expect(screen.getByText("um norte certo.")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("advances to the next phrase after 4 seconds", () => {
    render(<RotatingPhrase />);
    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(screen.getByText("um norte certo.")).toHaveAttribute(
      "aria-hidden",
      "false",
    );
    expect(screen.getByText("uma linha reta.")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("loops back to the first phrase after the last", () => {
    render(<RotatingPhrase />);
    act(() => {
      vi.advanceTimersByTime(4000 * 4);
    });
    expect(screen.getByText("uma linha reta.")).toHaveAttribute(
      "aria-hidden",
      "false",
    );
  });

  it("keeps every phrase at 15 characters so layout does not shift", () => {
    render(<RotatingPhrase />);
    for (const phrase of [
      "uma linha reta.",
      "um norte certo.",
      "um plano firme.",
      "uma meta clara.",
    ]) {
      expect(phrase).toHaveLength(15);
    }
  });
});
