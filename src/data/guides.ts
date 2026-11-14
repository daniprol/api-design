/**
 * Registry of company API guidelines referenced across the course.
 *
 * Lessons use `<Rule guide="zalando" id="134" level="MUST">…</Rule>` and this
 * registry provides the name, color and the link to the original rule.
 * Adding a new company (e.g. Google AIP) is just a new entry here plus a page
 * under `src/content/docs/guides/`.
 */

export type RuleLevel = "MUST" | "SHOULD" | "MAY" | "MUST NOT" | "SHOULD NOT";

export interface Guide {
  id: string;
  name: string;
  /** Short label used on badges. */
  short: string;
  color: string;
  homepage: string;
  ruleUrl: (id: string) => string;
  status: "available" | "planned";
}

export const guides: Record<string, Guide> = {
  zalando: {
    id: "zalando",
    name: "Zalando RESTful API Guidelines",
    short: "Zalando",
    color: "#ff6900",
    homepage: "https://opensource.zalando.com/restful-api-guidelines/",
    ruleUrl: (id) => `https://opensource.zalando.com/restful-api-guidelines/#${id}`,
    status: "available",
  },
  google: {
    id: "google",
    name: "Google API Improvement Proposals (AIP)",
    short: "Google AIP",
    color: "#4285f4",
    homepage: "https://google.aip.dev/",
    ruleUrl: (id) => `https://google.aip.dev/${id}`,
    status: "planned",
  },
  microsoft: {
    id: "microsoft",
    name: "Microsoft REST API Guidelines",
    short: "Microsoft",
    color: "#00a4ef",
    homepage: "https://github.com/microsoft/api-guidelines",
    ruleUrl: () => "https://github.com/microsoft/api-guidelines",
    status: "planned",
  },
};
