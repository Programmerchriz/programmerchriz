import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// Exercise the real data and rendering without adding a test framework.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const cache = new Map();
function loadSource(relativePath) {
  const filename = path.resolve(root, relativePath);
  if (cache.has(filename)) return cache.get(filename).exports;
  const loadedModule = { exports: {} };
  cache.set(filename, loadedModule);
  const javascript = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  const localRequire = (specifier) => {
    if (specifier.startsWith("@/")) {
      const base = specifier.slice(2);
      return loadSource([`${base}.ts`, `${base}.tsx`].find((candidate) => existsSync(path.join(root, candidate))));
    }
    return require(specifier);
  };
  new Function("require", "module", "exports", javascript)(localRequire, loadedModule, loadedModule.exports);
  return loadedModule.exports;
}

const { projects, getProjectBySlug, getFeaturedProjects } = loadSource("lib/data/projects.ts");
const { projectMetadata } = loadSource("lib/project-metadata.ts");
const { default: ProjectLinks } = loadSource("components/Projects/ProjectLinks.tsx");
const { default: ProjectGallery } = loadSource("components/Projects/ProjectGallery.tsx");
const render = (Component, props) => renderToStaticMarkup(React.createElement(Component, props));

assert.deepEqual(getFeaturedProjects().map(({ slug }) => slug), ["swifttopup", "vehicle-license-app", "career-guidance-app", "cryptocurrency-finance-app", "inventory-management-app"]);
assert.equal(getProjectBySlug("missing-project"), undefined);
assert.equal(new Set(projects.map(({ slug }) => slug)).size, projects.length);
for (const project of projects) {
  for (const image of project.images ?? []) {
    assert.ok(existsSync(path.join(root, "public", image.src)), `Missing ${image.src}`);
    assert.ok(image.alt && image.caption);
  }
  for (const repo of project.repositories ?? []) {
    if (repo.visibility === "private") assert.equal(Object.hasOwn(repo, "url"), false);
    else assert.match(repo.url, /^https:\/\/github\.com\/[^/]+\/[^/]+$/);
  }
}

// A mixed-visibility project must render each repository independently.
const mixed = render(ProjectLinks, { project: {
  repositories: [
    { label: "Public API", visibility: "public", url: "https://github.com/example/public" },
    // A stale URL must never leak even if malformed runtime data bypasses TypeScript.
    { label: "Private worker", visibility: "private", url: "https://github.com/example/secret" },
    { label: "Public UI", visibility: "public", url: "https://github.com/example/ui" },
  ],
} });
assert.equal((mixed.match(/<a /g) ?? []).length, 2);
assert.ok(mixed.includes("Private worker") && mixed.includes("Private source"));
assert.ok(!mixed.includes("example/secret"));
assert.equal(render(ProjectLinks, { project: {} }), "");
const swiftLinks = render(ProjectLinks, { project: getProjectBySlug("swifttopup") });
assert.equal((swiftLinks.match(/<a /g) ?? []).length, 1);
assert.ok(!swiftLinks.includes("github.com"));

for (const images of [undefined, []]) {
  const metadata = projectMetadata({ ...projects[0], images });
  assert.equal(metadata.alternates.canonical, "/projects/swifttopup");
  assert.equal(metadata.openGraph.images[0].url, "/images/s1-og-premium-img.jpg");
  assert.equal(metadata.twitter.images[0].url, metadata.openGraph.images[0].url);
  const empty = render(ProjectGallery, { title: "No media", images });
  assert.ok(empty.includes("Screenshots have not been published"));
  assert.ok(!empty.includes("<img") && !empty.includes("<button"));
}
const single = render(ProjectGallery, { title: "Single image", images: [projects[0].images[0]] });
assert.ok(single.includes("Full-size image"));
assert.ok(!single.includes("Next screenshot") && !single.includes("Play slideshow"));
const reduction = (212.9 - 28) / 212.9 * 100;
assert.equal(reduction.toFixed(1), "86.8");
console.log("Project checks passed: stable routes/order, local assets, mixed/private repositories, missing links/media, single-image gallery, metadata fallback and Redis calculation.");
