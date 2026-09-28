import { describe, it } from "node:test";
import assert from "node:assert";
import { TEMPLATES } from "../src/templates/registry";

describe("Template Registry Specification", () => {
  it("should contain at least 25 unique templates as requested", () => {
    assert.ok(TEMPLATES.length >= 25, `Expected >= 25 templates, found ${TEMPLATES.length}`);
  });

  it("should have unique IDs for every single template", () => {
    const ids = new Set<string>();
    for (const t of TEMPLATES) {
      assert.ok(!ids.has(t.id), `Duplicate template id found: ${t.id}`);
      ids.add(t.id);
    }
  });

  it("should cover all mandated categories", () => {
    const categories = new Set(TEMPLATES.map((t) => t.category));
    const requiredCategories = [
      "ATS-Friendly",
      "Executive",
      "Tech",
      "Creative",
      "Modern",
      "Fresher",
      "Academic",
      "Minimal",
    ];

    for (const req of requiredCategories) {
      assert.ok(categories.has(req as any), `Missing required category: ${req}`);
    }
  });
});
