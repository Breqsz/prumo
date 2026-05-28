import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { JsonLd } from "@/components/seo/json-ld";

describe("JsonLd", () => {
  it("renders a script tag with type application/ld+json", () => {
    const data = { "@context": "https://schema.org", "@type": "Thing", name: "Test" };
    const { container } = render(<JsonLd data={data} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
  });

  it("serialises the data object as valid JSON in the script innerHTML", () => {
    const data = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: "Prumo",
      url: "https://prumo.com.br",
    };
    const { container } = render(<JsonLd data={data} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    const parsed = JSON.parse(script!.innerHTML);
    expect(parsed).toEqual(data);
  });

  it("handles nested arrays (sameAs) without corruption", () => {
    const data = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Guilherme Rocha Bianchini",
      sameAs: ["https://linkedin.com/in/guilhermebreq"],
    };
    const { container } = render(<JsonLd data={data} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    const parsed = JSON.parse(script!.innerHTML);
    expect(parsed.sameAs).toEqual(["https://linkedin.com/in/guilhermebreq"]);
  });
});
