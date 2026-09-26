export const THEMES = Object.freeze(["light", "dark"]);

export function normalizeTheme(value) {
  return THEMES.includes(value) ? value : null;
}

export function resolveTheme(storedTheme, prefersDark = false) {
  return normalizeTheme(storedTheme) ?? (prefersDark ? "dark" : "light");
}

export function toggleTheme(theme) {
  return theme === "dark" ? "light" : "dark";
}

export function readTheme(storage) {
  try {
    return normalizeTheme(storage.getItem("bootstrap-atlas:theme"));
  } catch {
    return null;
  }
}

export function writeTheme(storage, theme) {
  const normalized = normalizeTheme(theme);
  if (!normalized) return false;

  try {
    storage.setItem("bootstrap-atlas:theme", normalized);
    return true;
  } catch {
    return false;
  }
}

export function validateContact(input) {
  const name = String(input?.name ?? "").trim();
  const email = String(input?.email ?? "").trim();
  const message = String(input?.message ?? "").trim();

  const errors = {};

  if (name.length < 2 || name.length > 80) {
    errors.name = "Enter a name between 2 and 80 characters.";
  }

  if (
    email.length > 254
    || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    errors.email = "Enter a valid email address.";
  }

  if (message.length < 10 || message.length > 600) {
    errors.message = "Message must be between 10 and 600 characters.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    data: { name, email, message },
  };
}
