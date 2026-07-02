import { describe, it, expect } from "vitest";
import {
  CONTACT,
  buildWhatsappLink,
  buildMailtoLink,
} from "@/lib/contact-config";

describe("CONTACT", () => {
  it("exposes the real channel values used across the site", () => {
    expect(CONTACT.email).toBe("guilherme@breq.com.br");
    expect(CONTACT.whatsappE164).toBe("+5534999194509");
    expect(CONTACT.linkedin).toBe(
      "https://www.linkedin.com/company/prumo-digital/",
    );
    expect(CONTACT.instagram).toBe(
      "https://www.instagram.com/prumo_digital/",
    );
  });
});

describe("buildWhatsappLink", () => {
  it("strips non-digits from the E.164 number and returns wa.me URL", () => {
    expect(buildWhatsappLink()).toBe("https://wa.me/5534999194509");
  });

  it("appends URL-encoded prefilled message when provided", () => {
    const link = buildWhatsappLink("Oi, vim do site Prumo");
    expect(link).toBe(
      "https://wa.me/5534999194509?text=Oi%2C+vim+do+site+Prumo",
    );
  });

  it("returns base URL when message is empty string", () => {
    expect(buildWhatsappLink("")).toBe("https://wa.me/5534999194509");
  });
});

describe("buildMailtoLink", () => {
  it("returns bare mailto when no subject or body", () => {
    expect(buildMailtoLink()).toBe("mailto:guilherme@breq.com.br");
  });

  it("encodes subject only", () => {
    expect(buildMailtoLink("Briefing inicial")).toBe(
      "mailto:guilherme@breq.com.br?subject=Briefing+inicial",
    );
  });

  it("encodes subject + body together", () => {
    expect(buildMailtoLink("Briefing", "Quero conversar sobre um site")).toBe(
      "mailto:guilherme@breq.com.br?subject=Briefing&body=Quero+conversar+sobre+um+site",
    );
  });

  it("encodes body without subject", () => {
    expect(buildMailtoLink(undefined, "Texto aqui")).toBe(
      "mailto:guilherme@breq.com.br?body=Texto+aqui",
    );
  });
});
