# Bootstrap Atlas — Component Architecture Showcase

[![Quality](https://github.com/kooroosh1363/web-design-sa-bootstrap/actions/workflows/quality.yml/badge.svg)](https://github.com/kooroosh1363/web-design-sa-bootstrap/actions/workflows/quality.yml)

Bootstrap Atlas modernizes the original 2023 Bootstrap learning page into a cohesive component-architecture demo.

## What changed

The original page mixed many Bootstrap examples into one long exercise:

- placeholder `href="#"` links
- repeated Lorem Ipsum copy
- duplicated form IDs
- mismatched `aria-controls` references
- inline styles and inline JavaScript
- generic Bootstrap demo labels
- unused downloaded source ZIPs and media
- no tests, build, or CI

The maintained version treats Bootstrap as an interface dependency with clear boundaries.

## Architecture

```text
Bootstrap 5.3.1 runtime
        │
        ├── grid / collapse / tabs
        ├── accordion / modal / offcanvas
        ├── tooltip / toast / validation states
        │
        ▼
project presentation layer
        │
        ▼
application policy modules
        ├── color-mode persistence
        ├── contact-demo validation
        └── component manifest
```

Bootstrap owns the primitives. Project CSS owns the visual language. Project JavaScript owns only application-specific policy.

## Component manifest

The maintained interface demonstrates:

- responsive Navbar + Collapse
- Tabs
- Accordion
- Modal
- Offcanvas
- Tooltip
- Toast
- Bootstrap validation states
- Bootstrap color modes

Each component has a specific job rather than appearing only to prove that the component exists.

## Theme behavior

The interface supports Bootstrap light and dark color modes.

Resolution order:

```text
saved local preference
        ↓
system prefers-color-scheme
        ↓
light fallback
```

The theme policy is isolated in a pure module and covered by tests.

## Form demo

The validation section does **not** send a network request.

It exists to demonstrate:

- unique labels and field IDs
- deterministic validation
- Bootstrap valid/invalid states
- accessible field feedback
- live form status

## Markup quality gate

`npm run markup-check` checks:

- duplicate IDs
- broken local `href` / `data-bs-target` references
- broken `aria-controls`
- labels pointing to missing inputs
- placeholder `href="#"`
- inline styles
- inline event handlers
- inline executable scripts
- Lorem Ipsum
- placeholder alt text
- presence of the intended Bootstrap primitives

## Local run

The project is static:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Quality checks

No npm package installation is required.

```bash
npm run check
```

This runs:

- JavaScript syntax checks
- Node built-in unit tests
- Bootstrap markup relationship checks
- deterministic production build

## Production build

```bash
npm run build
```

The build writes `dist/` and copies only the Bootstrap files actually used by the page:

- `bootstrap.min.css`
- `bootstrap.bundle.min.js`

The historical vendor folder remains source material in git history, but the deployed artifact does not ship the entire Bootstrap distribution.

## GitHub Pages

A manual Pages workflow is included. Enable it once:

1. Open **Settings → Pages**
2. Set **Source** to **GitHub Actions**
3. Open **Actions → Deploy Pages**
4. Run the workflow

## Scope

This is a Bootstrap integration and front-end architecture demo. The contact form is intentionally local-only; there is no backend, database, account system, payment flow, or live storefront.

## License

MIT License.
