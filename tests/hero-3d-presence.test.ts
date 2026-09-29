/**
 * tests/hero-3d-presence.test.ts
 *
 * Automated guard: fails if the Three.js 3D canvas / HeroScene is removed
 * from the landing page. This ensures the animated background can never be
 * silently stripped again during readability or accessibility refactors.
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import { test, describe } from "node:test";
import assert from "node:assert/strict";

const ROOT = resolve(process.cwd());

describe("3D Hero Scene — Presence Guard", () => {
  test("HeroScene component file exists and exports a React component", () => {
    const heroPath = resolve(ROOT, "src/components/3d/HeroScene.tsx");
    const content = readFileSync(heroPath, "utf-8");
    // Must export HeroScene
    assert.match(content, /export const HeroScene/, "HeroScene must be exported");
    // Must use Three.js
    assert.match(content, /from "three"/, "HeroScene must import three.js");
    // Must have a canvas/renderer
    assert.match(content, /WebGLRenderer/, "HeroScene must use a WebGLRenderer");
    // Must have animation loop
    assert.match(content, /requestAnimationFrame/, "HeroScene must use requestAnimationFrame for animation");
    // Must NOT disable or hide the canvas by default (only under reduced motion)
    assert.doesNotMatch(
      content,
      /display\s*:\s*["']none["']/,
      "HeroScene must not have display:none on the canvas"
    );
  });

  test("HeroScene must have particles (Points + PointsMaterial)", () => {
    const heroPath = resolve(ROOT, "src/components/3d/HeroScene.tsx");
    const content = readFileSync(heroPath, "utf-8");
    assert.match(content, /THREE\.Points/, "Scene must include particle Points objects");
    assert.match(content, /PointsMaterial/, "Scene must include PointsMaterial");
    // Particles must not be invisible (opacity > 0.1)
    const opacityMatches = [...content.matchAll(/opacity:\s*([\d.]+)/g)];
    const allOpacities = opacityMatches.map((m) => parseFloat(m[1]));
    assert.ok(
      allOpacities.some((o) => o > 0.2),
      `At least one opacity value must be > 0.2 (particles visible). Found: ${allOpacities}`
    );
  });

  test("HeroScene must have floating resume sheet meshes", () => {
    const heroPath = resolve(ROOT, "src/components/3d/HeroScene.tsx");
    const content = readFileSync(heroPath, "utf-8");
    assert.match(content, /BoxGeometry/, "Scene must include BoxGeometry for resume sheets");
    assert.match(content, /MeshStandardMaterial/, "Scene must use MeshStandardMaterial for sheets");
    assert.match(content, /sheetsGroup/, "Scene must group sheets together");
  });

  test("HeroScene must implement mouse parallax", () => {
    const heroPath = resolve(ROOT, "src/components/3d/HeroScene.tsx");
    const content = readFileSync(heroPath, "utf-8");
    assert.match(content, /mousemove/, "Scene must listen to mousemove for parallax");
    assert.match(content, /camera\.position/, "Scene must update camera position for parallax");
  });

  test("Landing page (page.tsx) must render HeroScene", () => {
    const pagePath = resolve(ROOT, "src/app/page.tsx");
    const content = readFileSync(pagePath, "utf-8");
    assert.match(content, /HeroScene/, "page.tsx must import HeroScene");
    assert.match(content, /<HeroScene/, "page.tsx must render <HeroScene");
    // Must NOT have display:none on the HeroScene container
    const heroSceneBlock = content.slice(content.indexOf("<HeroScene"), content.indexOf("</") + 20);
    assert.doesNotMatch(heroSceneBlock, /display:\s*["']none["']/, "HeroScene must not be hidden");
  });

  test("HeroScene canvas must NOT be under -z-10 without a positive z on the parent container", () => {
    const pagePath = resolve(ROOT, "src/app/page.tsx");
    const content = readFileSync(pagePath, "utf-8");
    // The 3D layer wrapper in page.tsx should have a positive zIndex so it is visible
    assert.match(
      content,
      /zIndex:\s*[1-9]/,
      "The 3D layer wrapper in page.tsx must have a positive zIndex (not buried at -z-10)"
    );
  });

  test("HeroScene must have prefersReducedMotion guard but NOT disable canvas entirely", () => {
    const heroPath = resolve(ROOT, "src/components/3d/HeroScene.tsx");
    const content = readFileSync(heroPath, "utf-8");
    assert.match(content, /prefers-reduced-motion/, "Must check prefers-reduced-motion");
    // Even with reduced motion, it should render one static frame, not skip entirely
    assert.match(
      content,
      /renderer\.render\(scene, camera\)/,
      "Must call renderer.render at least once (static frame for reduced-motion users)"
    );
  });
});
