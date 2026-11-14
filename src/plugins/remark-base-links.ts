import type { Root } from "mdast";
import type {} from "mdast-util-mdx-jsx";
import { visit } from "unist-util-visit";

/**
 * Prefixes root-relative links (`/course/...`) in Markdown/MDX with Astro's
 * `base`, so content can be written without caring where the site is hosted
 * (GitHub Pages project sites live under `/<repo>/`).
 *
 * Handles plain Markdown links and `href` attributes on MDX components
 * such as `<LinkCard href="/course/..." />`.
 */
export function remarkBaseLinks(options: { base: string }) {
  const base = options.base.replace(/\/+$/, "");
  const fix = (url: string) =>
    base && url.startsWith("/") && !url.startsWith("//") && !url.startsWith(`${base}/`)
      ? `${base}${url}`
      : url;

  return (tree: Root) => {
    if (!base) return;
    visit(tree, (node) => {
      if (node.type === "link" || node.type === "definition") {
        node.url = fix(node.url);
        return;
      }
      if (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") {
        for (const attr of node.attributes) {
          if (
            attr.type === "mdxJsxAttribute" &&
            attr.name === "href" &&
            typeof attr.value === "string"
          ) {
            attr.value = fix(attr.value);
          }
        }
      }
    });
  };
}
