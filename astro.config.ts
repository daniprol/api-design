import { unified } from "@astrojs/markdown-remark";
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import { guide } from "./src/data/guide";
import { remarkBaseLinks } from "./src/plugins/remark-base-links";

// GitHub Pages project site: https://daniprol.github.io/api-design/
const site = "https://daniprol.github.io";
const base = "/api-design";

/** Old course URLs (first edition) and where their content lives now. */
const moved: Record<string, string> = {
  "/start-here/": "/about/",
  "/course/": "/guide/",
  "/course/foundations/apis-are-products/": "/foundations/principles/",
  "/course/foundations/api-first/": "/foundations/principles/",
  "/course/foundations/rest-in-a-nutshell/": "/foundations/rest-and-alternatives/",
  "/course/resources-and-urls/thinking-in-resources/": "/modelling/resources/",
  "/course/resources-and-urls/url-style-guide/": "/modelling/urls/",
  "/course/resources-and-urls/relationships-and-nesting/": "/modelling/urls/",
  "/course/speaking-http/http-methods/": "/http/methods/",
  "/course/speaking-http/status-codes/": "/http/status-codes/",
  "/course/speaking-http/errors/": "/http/errors/",
  "/course/speaking-http/headers/": "/http/headers/",
  "/course/payloads/json-style/": "/representations/json/",
  "/course/payloads/null-absent-empty/": "/representations/json/",
  "/course/payloads/data-formats/": "/representations/data-formats/",
  "/course/collections/pagination/": "/collections/pagination/",
  "/course/collections/querying/": "/collections/filtering/",
  "/course/collections/performance-and-caching/": "/collections/caching/",
  "/course/robustness/idempotency/": "/reliability/idempotency/",
  "/course/robustness/optimistic-locking/": "/reliability/concurrency/",
  "/course/robustness/async-and-batch/": "/reliability/long-running-operations/",
  "/course/robustness/rate-limiting/": "/security/limits/",
  "/course/evolution/compatibility/": "/evolution/compatibility/",
  "/course/evolution/versioning/": "/evolution/versioning/",
  "/course/evolution/deprecation/": "/evolution/deprecation/",
  "/course/production/security/": "/security/auth/",
  "/course/production/hypermedia/": "/representations/links/",
  "/course/production/docs-and-operations/": "/evolution/specs-in-ci/",
  "/course/events/events-as-apis/": "/events/event-design/",
  "/course/events/consuming-events/": "/events/consuming-events/",
  "/guides/": "/guidelines/",
  "/guides/zalando/": "/guidelines/zalando/",
  "/guides/google-aip/": "/guidelines/",
  "/reference/cheat-sheet/": "/reference/checklist/",
};

export default defineConfig({
  site,
  base,
  trailingSlash: "always",
  redirects: Object.fromEntries(Object.entries(moved).map(([from, to]) => [from, `${base}${to}`])),
  markdown: {
    processor: unified({ remarkPlugins: [[remarkBaseLinks, { base }]] }),
  },
  integrations: [
    starlight({
      title: "HTTP API Design",
      description:
        "HTTP API Design, a practitioner's reference: resource modelling, HTTP semantics, representations, pagination, idempotency, concurrency, security, evolution and events, with primary sources and company guideline comparisons.",
      favicon: "/favicon.svg",
      head: [
        {
          tag: "meta",
          attrs: {
            property: "og:site_name",
            content: "HTTP API Design: a practitioner's reference",
          },
        },
      ],
      social: [
        {
          icon: "github",
          label: "Source on GitHub",
          href: "https://github.com/daniprol/api-design",
        },
      ],
      editLink: { baseUrl: "https://github.com/daniprol/api-design/edit/main/" },
      lastUpdated: true,
      customCss: [
        "@fontsource-variable/source-serif-4",
        "@fontsource-variable/inter",
        "@fontsource-variable/jetbrains-mono",
        "./src/styles/theme.css",
        "./src/styles/components.css",
        "./src/styles/print.css",
      ],
      expressiveCode: {
        themes: ["vitesse-dark", "vitesse-light"],
        styleOverrides: {
          borderRadius: "6px",
          borderColor: "var(--fg-hairline)",
          codeBackground: "var(--fg-surface)",
          codeFontFamily: "'JetBrains Mono Variable', ui-monospace, monospace",
          codeFontSize: "0.85rem",
          uiFontFamily: "'Inter Variable', system-ui, sans-serif",
          frames: {
            shadowColor: "transparent",
            frameBoxShadowCssValue: "none",
            terminalTitlebarDotsOpacity: "0",
            editorTabBarBackground: "var(--fg-surface)",
            editorActiveTabBackground: "var(--fg-surface)",
            terminalTitlebarBackground: "var(--fg-surface)",
            terminalBackground: "var(--fg-surface)",
          },
        },
      },
      components: {
        Header: "./src/components/overrides/Header.astro",
        PageTitle: "./src/components/overrides/PageTitle.astro",
        Footer: "./src/components/overrides/Footer.astro",
      },
      sidebar: [
        {
          label: "Guide",
          items: [
            { label: "Contents", link: "/guide/" },
            ...guide.map((section, i) => ({
              label: `${i + 1}. ${section.title}`,
              collapsed: true,
              items: section.topics.map((topic) => ({
                label: topic.title,
                link: `/${section.slug}/${topic.slug}/`,
              })),
            })),
            { label: "Appendix A. Annotated design review", link: "/guide/design-review/" },
          ],
        },
        {
          label: "Reference",
          items: [
            { label: "Overview", link: "/reference/" },
            { label: "Status codes", link: "/reference/status-codes/" },
            { label: "Headers", link: "/reference/headers/" },
            { label: "Media types", link: "/reference/media-types/" },
            { label: "Design review checklist", link: "/reference/checklist/" },
            { label: "Glossary", link: "/reference/glossary/" },
            { label: "RFC index", link: "/reference/rfcs/" },
            { label: "Rule index", link: "/reference/rules/" },
          ],
        },
        {
          label: "Guidelines",
          items: [
            { label: "Overview and comparison", link: "/guidelines/" },
            { label: "Zalando", link: "/guidelines/zalando/" },
          ],
        },
        {
          label: "About",
          items: [
            { label: "About this guide", link: "/about/" },
            { label: "Sources and method", link: "/about/sources/" },
            { label: "Changelog", link: "/about/changelog/" },
            { label: "Contributing", link: "/about/contributing/" },
            { label: "License", link: "/about/license/" },
          ],
        },
      ],
    }),
  ],
});
