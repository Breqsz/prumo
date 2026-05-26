import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});

// Mock Three.js WebGLRenderer for testing components that use pixel-snow
vi.mock("three", async () => {
  const actual = await vi.importActual("three");
  class MockWebGLRenderer {
    render = vi.fn();
    setSize = vi.fn();
    setPixelRatio = vi.fn();
    setClearColor = vi.fn();
    forceContextLoss = vi.fn();
    domElement = document.createElement("canvas");
    dispose = vi.fn();
    constructor() {}
  }
  return {
    ...actual,
    WebGLRenderer: MockWebGLRenderer,
  };
});
