# 🥋 API Design Dojo

A fun, example-driven course on **web API design**, built with [Astro](https://astro.build) + [Starlight](https://starlight.astro.build).

**Live site:** https://daniprol.github.io/api-design/

- 9 modules, 28 short lessons: resources, HTTP, payloads, pagination, idempotency, evolution, security, events.
- Every concept shown in **FastAPI**, **Django REST Framework** and **Hono** (pick your stack once, every page remembers it).
- Stories & history, do's & don'ts, quick quizzes, and progress tracking saved in your browser.
- Company rules shown in context. Today: [Zalando RESTful API Guidelines](https://opensource.zalando.com/restful-api-guidelines/). Next: Google AIP.

## Development

Requires Node.js ≥ 22.23 (see `.nvmrc`) and [pnpm](https://pnpm.io).

```sh
pnpm install        # also installs the git hooks (lefthook)
pnpm dev            # http://localhost:4321/api-design/
pnpm build          # static site in dist/
pnpm preview        # serve the build
```

| Script              | What it does                                    |
| ------------------- | ----------------------------------------------- |
| `pnpm lint`         | ESLint (TypeScript, Astro, a11y)                |
| `pnpm format`       | Format with oxfmt (`format:check` in CI)        |
| `pnpm check`        | `astro check` type checking                     |
| `pnpm check:links`  | Verify internal links in the built site         |
| `pnpm verify`       | All of the above + build                        |

Git hooks (lefthook): `pre-commit` formats and lints staged files, `pre-push` runs `astro check`.

## Project structure

```text
src/
├── content/docs/
│   ├── index.mdx               # home page
│   ├── start-here.mdx
│   ├── course/<module>/<lesson>.mdx
│   ├── guides/                 # company guides (zalando, google-aip…)
│   └── reference/              # cheat sheets, glossary
├── data/
│   ├── curriculum.ts           # ⭐ single source of truth: modules & lessons
│   └── guides.ts               # registry of company guidelines
├── components/                 # lesson components (Hook, Story, DoDont, Rule, Quiz…)
│   └── overrides/              # Starlight overrides (lesson header, completion footer)
├── plugins/remark-base-links.ts
└── styles/                     # theme + component styles
```

### Writing a lesson

1. Create `src/content/docs/course/<module>/<lesson>.mdx`.
2. Add it to `src/data/curriculum.ts` (this drives the sidebar, course map and lesson numbering).
3. Import the building blocks in one line:

```mdx
import { Hook, Story, DoDont, Do, Dont, Rule, Quiz, Takeaways, Tabs, TabItem, Status } from "@components/lesson";
```

Write root-relative links (`/course/...`): the base path is added automatically. Inside JSX components, leave a blank line around Markdown content so the formatter keeps it intact.

### Adding a company guide

Add an entry to `src/data/guides.ts`, a page in `src/content/docs/guides/`, and `<Rule guide="<id>" id="…" level="…" title="…" />` boxes in lessons. The guide's rule index builds itself from the lessons.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and deploys it to GitHub Pages. Pull requests run `.github/workflows/ci.yml` (lint, format, type check, build, link check).
