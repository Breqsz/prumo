import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AmbientVideo } from "./ambient-video";

vi.mock("@/lib/hooks/use-video-fade", () => ({
  useVideoFade: () => () => {},
}));

describe("AmbientVideo", () => {
  it("renders children", () => {
    const { getByText } = render(
      <AmbientVideo srcs={["/a.mp4"]}>
        <p>conteudo</p>
      </AmbientVideo>,
    );
    expect(getByText("conteudo")).toBeInTheDocument();
  });

  it("does not render the spotlight by default", () => {
    const { container } = render(
      <AmbientVideo srcs={["/a.mp4"]}>
        <p>x</p>
      </AmbientVideo>,
    );
    expect(container.querySelector(".prumo-spotlight")).toBeNull();
  });

  it("renders the spotlight when spotlight prop is true", () => {
    const { container } = render(
      <AmbientVideo srcs={["/a.mp4"]} spotlight>
        <p>x</p>
      </AmbientVideo>,
    );
    expect(container.querySelector(".prumo-spotlight")).toBeTruthy();
    expect(container.querySelector(".prumo-spotlight-soft")).toBeTruthy();
  });
});
