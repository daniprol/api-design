# HTTP API Design

A practical reference for designing HTTP APIs that stay pleasant to use and cheap to change: modelling, HTTP semantics, payloads, collections, reliability, security, evolution, events and webhooks.

**Live site:** https://daniprol.github.io/api-design/

- **Guide:** 32 chapters in nine sections, each with a clear recommendation, examples in FastAPI, Django REST Framework and Hono, sourced notes on history and real incidents, and a short self-check. Appendix A walks through a full design review.
- **Practice:** four design challenges set at the same shop, with hints, model answers and a self-review.
- **In the wild:** teardowns of Stripe, GitHub, Shopify and Twilio, mapped to the Guide's recommendations.
- **Reference:** status codes, headers, media types, a review checklist, a glossary, an RFC index and a rule index.
- **Guidelines:** where Zalando, Google AIP, Microsoft Azure and Stripe agree and differ, with Zalando and Google AIP rules cited chapter by chapter.

Built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build).

## Development

Requires Node.js ≥ 22.23 (see `.nvmrc`) and [pnpm](https://pnpm.io).

```sh
pnpm install        # also installs the git hooks (lefthook)
pnpm dev            # http://localhost:4321/api-design/
pnpm build          # static site in dist/
pnpm preview        # serve the build
```

| Script             | What it does                             |
| ------------------ | ---------------------------------------- |
| `pnpm lint`        | ESLint (TypeScript, Astro, a11y)         |
| `pnpm format`      | Format with oxfmt (`format:check` in CI) |
| `pnpm check`       | `astro check` type checking              |
| `pnpm check:links` | Verify internal links in the built site  |
| `pnpm verify`      | All of the above + build                 |

Git hooks (lefthook): `pre-commit` formats and lints staged files, `pre-push` runs `astro check`.

## Project structure

```text
src/
├── content/docs/
│   ├── index.mdx                 # home page
│   ├── guide/                    # contents and Appendix A
│   ├── <section>/<topic>.mdx     # the Guide: foundations, modelling, http, …, events
│   ├── practice/                 # design-it-yourself challenges with model answers
│   ├── in-the-wild/              # teardowns of real APIs: Stripe, GitHub, Shopify, Twilio
│   ├── reference/                # tables: status codes, headers, glossary, rule index…
│   ├── guidelines/               # comparison and per-guideline pages
│   └── about/                    # about, sources, changelog, contributing, license
├── data/
│   ├── guide.ts                  # sections and topics: sidebar, numbering, contents, prev/next
│   ├── guides.ts                 # registry of company guidelines
│   └── differences.ts            # "Where guides differ" entries and the comparison matrix
├── components/                   # page kit (InBrief, Note, Compare, Rule, SelfCheck…), exported from kit.ts
│   └── overrides/                # Starlight overrides: Header, PageTitle, Footer
├── plugins/remark-base-links.ts
└── styles/                       # theme, components, print
CHANGELOG.md                      # dated changes; the home page shows the latest three
```

### Writing a chapter

1. Create `src/content/docs/<section>/<topic>.mdx` with `title`, `description`, `sources` and `related` in the frontmatter.
2. Add the topic to `src/data/guide.ts`.
3. Import components from the kit:

```mdx
import {
  InBrief,
  Note,
  Compare,
  Prefer,
  Avoid,
  Rule,
  RuleGroup,
  SelfCheck,
  Question,
  Tabs,
  TabItem,
} from "@components/kit";
```

The page shape and writing rules are on the site under [Contributing](https://daniprol.github.io/api-design/about/contributing/). Write root-relative links (`/http/errors/`); the base path is added automatically. Inside JSX components, leave a blank line around Markdown content so the formatter keeps it intact.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and deploys it to GitHub Pages. Pull requests run `.github/workflows/ci.yml` (lint, format, type check, build, link check).

## License

Text: [CC BY 4.0](LICENSE-CONTENT.md). Code: [MIT](LICENSE).
