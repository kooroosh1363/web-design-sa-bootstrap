import { cp, mkdir, rm } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const dist = new URL("../dist/", import.meta.url);

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

await cp(new URL("index.html", root), new URL("index.html", dist));
await cp(new URL("assets/", root), new URL("assets/", dist), { recursive: true });

await mkdir(new URL("bootstrap-source/bootstrap-5.3.1-dist/css/", dist), { recursive: true });
await mkdir(new URL("bootstrap-source/bootstrap-5.3.1-dist/js/", dist), { recursive: true });
await cp(
  new URL("bootstrap-source/bootstrap-5.3.1-dist/css/bootstrap.min.css", root),
  new URL("bootstrap-source/bootstrap-5.3.1-dist/css/bootstrap.min.css", dist),
);
await cp(
  new URL("bootstrap-source/bootstrap-5.3.1-dist/js/bootstrap.bundle.min.js", root),
  new URL("bootstrap-source/bootstrap-5.3.1-dist/js/bootstrap.bundle.min.js", dist),
);

console.log("Built Bootstrap Atlas into dist/ with only the active Bootstrap runtime.");
