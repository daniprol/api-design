import { unified } from "@astrojs/markdown-remark";
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import { curriculum } from "./src/data/curriculum";
import { remarkBaseLinks } from "./src/plugins/remark-base-links";

// GitHub Pages project site: https://daniprol.github.io/api-design/
const site = "https://daniprol.github.io";
const base = "/api-design";

export default defineConfig({
  site,
  base,
  trailingSlash: "always",
  markdown: {
    processor: unified({ remarkPlugins: [[remarkBaseLinks, { base }]] }),
  },
  integrations: [
    starlight({
      title: "API Design Dojo",
      description:
        "A fun, example-driven course on web API design: resources, HTTP, payloads, pagination, idempotency, evolution and events, with notes from real company guidelines.",
      logo: { src: "./src/assets/logo.svg", alt: "API Design Dojo" },
      favicon: "/favicon.svg",
      social: [{ icon: "github", label: "GitHub", href: "https://github.com/daniprol/api-design" }],
      editLink: { baseUrl: "https://github.com/daniprol/api-design/edit/main/" },
      lastUpdated: true,
      customCss: [
        "@fontsource-variable/bricolage-grotesque",
        "@fontsource-variable/inter",
        "@fontsource-variable/jetbrains-mono",
        "./src/styles/theme.css",
        "./src/styles/components.css",
      ],
      expressiveCode: {
        themes: ["one-dark-pro", "github-light"],
        styleOverrides: {
          borderRadius: "0.75rem",
          codeFontFamily: "'JetBrains Mono Variable', ui-monospace, monospace",
          uiFontFamily: "'Inter Variable', system-ui, sans-serif",
        },
      },
      components: {
        PageTitle: "./src/components/overrides/PageTitle.astro",
        Footer: "./src/components/overrides/Footer.astro",
      },
      sidebar: [
        {
          label: "Start here",
          items: [
            { label: "Welcome to the dojo", link: "/start-here/" },
            { label: "Course map", link: "/course/" },
          ],
        },
        ...curriculum.map((module, i) => ({
          label: `${i + 1}. ${module.title}`,
          collapsed: false,
          items: module.lessons.map((lesson) => ({
            label: lesson.title,
            link: `/course/${module.slug}/${lesson.slug}/`,
          })),
        })),
        {
          label: "Company guides",
          items: [
            { label: "How guides compare", link: "/guides/" },
            { label: "Zalando", link: "/guides/zalando/" },
            {
              label: "Google AIP",
              link: "/guides/google-aip/",
              badge: { text: "Soon", variant: "note" },
            },
          ],
        },
        {
          label: "Reference",
          items: [
            { label: "Cheat sheet", link: "/reference/cheat-sheet/" },
            { label: "Status code cheat sheet", link: "/reference/status-codes/" },
            { label: "Glossary", link: "/reference/glossary/" },
          ],
        },
      ],
    }),
  ],
});
