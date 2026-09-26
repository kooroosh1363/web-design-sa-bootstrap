import {
  readTheme,
  resolveTheme,
  toggleTheme,
  validateContact,
  writeTheme,
} from "./ui-policy.js";
import { componentManifest } from "./component-manifest.js";

const bootstrapApi = window.bootstrap;
if (!bootstrapApi) {
  throw new Error("Bootstrap bundle is required before app.js.");
}

const root = document.documentElement;
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeLabel = document.querySelector("[data-theme-label]");
const componentCount = document.querySelector("[data-component-count]");
const componentList = document.querySelector("[data-component-list]");
const form = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");
const successToast = document.querySelector("#successToast");

function systemPrefersDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(theme) {
  root.setAttribute("data-bs-theme", theme);
  if (themeToggle) themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  if (themeLabel) themeLabel.textContent = theme === "dark" ? "Dark" : "Light";
}

let theme = resolveTheme(readTheme(window.localStorage), systemPrefersDark());
applyTheme(theme);

themeToggle?.addEventListener("click", () => {
  theme = toggleTheme(theme);
  writeTheme(window.localStorage, theme);
  applyTheme(theme);
});

document
  .querySelectorAll('[data-bs-toggle="tooltip"]')
  .forEach((element) => bootstrapApi.Tooltip.getOrCreateInstance(element));

if (componentCount) {
  componentCount.textContent = String(componentManifest.length);
}

if (componentList) {
  const fragment = document.createDocumentFragment();

  componentManifest.forEach((component) => {
    const item = document.createElement("li");
    item.className = "list-group-item d-flex justify-content-between gap-3 py-3";
    item.innerHTML = `
      <div>
        <strong class="d-block">${component.name}</strong>
        <small class="text-body-secondary">${component.purpose}</small>
      </div>
      <span class="badge text-bg-primary align-self-start">${component.primitive}</span>
    `;
    fragment.append(item);
  });

  componentList.replaceChildren(fragment);
}

function setFieldState(field, errorElement, error) {
  if (!field || !errorElement) return;

  field.classList.toggle("is-invalid", Boolean(error));
  field.classList.toggle("is-valid", !error && field.value.trim() !== "");
  field.setAttribute("aria-invalid", String(Boolean(error)));
  errorElement.textContent = error ?? "";
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = Object.fromEntries(new FormData(form).entries());
  const result = validateContact(data);

  setFieldState(
    form.elements.namedItem("name"),
    document.querySelector("#name-error"),
    result.errors.name,
  );
  setFieldState(
    form.elements.namedItem("email"),
    document.querySelector("#email-error"),
    result.errors.email,
  );
  setFieldState(
    form.elements.namedItem("message"),
    document.querySelector("#message-error"),
    result.errors.message,
  );

  if (!result.valid) {
    if (formStatus) formStatus.textContent = "Review the highlighted fields.";
    form.querySelector(".is-invalid")?.focus();
    return;
  }

  if (formStatus) {
    formStatus.textContent = "Demo validation passed. No message was sent.";
  }

  bootstrapApi.Toast.getOrCreateInstance(successToast).show();
  form.reset();
  form.querySelectorAll(".is-valid").forEach((field) => field.classList.remove("is-valid"));
});
