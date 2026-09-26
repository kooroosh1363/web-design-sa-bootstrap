import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const failures = [];

const ids = [...html.matchAll(/\sid=["']([^"']+)["']/g)].map((match) => match[1]);
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
if (duplicates.length) failures.push(`Duplicate IDs: ${[...new Set(duplicates)].join(", ")}`);

const idSet = new Set(ids);
for (const match of html.matchAll(/(?:href|data-bs-target)=["']#([^"']+)["']/g)) {
  const target = match[1];
  if (!idSet.has(target)) failures.push(`Missing local target #${target}`);
}

for (const match of html.matchAll(/aria-controls=["']([^"']+)["']/g)) {
  for (const target of match[1].split(/\s+/)) {
    if (!idSet.has(target)) failures.push(`aria-controls references missing #${target}`);
  }
}

for (const match of html.matchAll(/<label\b[^>]*for=["']([^"']+)["']/g)) {
  if (!idSet.has(match[1])) failures.push(`Label references missing #${match[1]}`);
}

if (/href=["']#["']/i.test(html)) failures.push("Placeholder href=# links are not allowed.");
if (/\sstyle=["']/i.test(html)) failures.push("Inline style attributes are not allowed.");
if (/on(?:click|change|submit|input)=/i.test(html)) failures.push("Inline event handlers are not allowed.");
if (/<script(?![^>]*\bsrc=)[^>]*>\s*[^<\s]/i.test(html)) failures.push("Inline executable scripts are not allowed.");
if (/lorem ipsum/i.test(html)) failures.push("Placeholder lorem ipsum copy is not allowed.");
if (/alt=["']\.\.\.["']/i.test(html)) failures.push("Placeholder image alt text is not allowed.");

const required = [
  'data-bs-toggle="collapse"',
  'data-bs-toggle="pill"',
  'data-bs-toggle="modal"',
  'data-bs-toggle="offcanvas"',
  'data-bs-toggle="tooltip"',
  'data-contact-form',
];

for (const token of required) {
  if (!html.includes(token)) failures.push(`Required Bootstrap showcase token missing: ${token}`);
}

if (failures.length) {
  failures.forEach((failure) => console.error(`[fail] ${failure}`));
  process.exit(1);
}

console.log(`[pass] Markup relationships valid across ${ids.length} unique IDs.`);
