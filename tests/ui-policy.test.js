import test from "node:test";
import assert from "node:assert/strict";

import {
  normalizeTheme,
  readTheme,
  resolveTheme,
  toggleTheme,
  validateContact,
  writeTheme,
} from "../assets/js/ui-policy.js";

test("theme normalization and resolution are deterministic", () => {
  assert.equal(normalizeTheme("light"), "light");
  assert.equal(normalizeTheme("dark"), "dark");
  assert.equal(normalizeTheme("sepia"), null);
  assert.equal(resolveTheme("dark", false), "dark");
  assert.equal(resolveTheme(null, true), "dark");
  assert.equal(resolveTheme(null, false), "light");
  assert.equal(toggleTheme("light"), "dark");
  assert.equal(toggleTheme("dark"), "light");
});

test("theme storage fails safely", () => {
  const values = new Map();
  const storage = {
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { values.set(key, value); },
  };

  assert.equal(writeTheme(storage, "dark"), true);
  assert.equal(readTheme(storage), "dark");
  assert.equal(writeTheme(storage, "sepia"), false);

  const blocked = {
    getItem() { throw new Error("blocked"); },
    setItem() { throw new Error("blocked"); },
  };

  assert.equal(readTheme(blocked), null);
  assert.equal(writeTheme(blocked, "light"), false);
});

test("contact validation accepts a complete demo submission", () => {
  const result = validateContact({
    name: "Peyman Raad",
    email: "peyman@example.com",
    message: "This is a sufficiently detailed project message.",
  });

  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, {});
  assert.equal(result.data.name, "Peyman Raad");
});

test("contact validation rejects malformed input", () => {
  const result = validateContact({
    name: "X",
    email: "bad-email",
    message: "short",
  });

  assert.equal(result.valid, false);
  assert.ok(result.errors.name);
  assert.ok(result.errors.email);
  assert.ok(result.errors.message);
});

test("contact validation trims values and enforces maximums", () => {
  const result = validateContact({
    name: "  Ada Lovelace  ",
    email: "  ada@example.com  ",
    message: `  ${"a".repeat(601)}  `,
  });

  assert.equal(result.data.name, "Ada Lovelace");
  assert.equal(result.data.email, "ada@example.com");
  assert.ok(result.errors.message);
});
