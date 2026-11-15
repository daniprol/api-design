/**
 * Company API guidelines cited on this site.
 *
 * Pages cite a rule with `<Rule guide="zalando" id="134" level="MUST" title="…" />`;
 * this registry supplies the name and the link to the original rule.
 * Adding a guideline is a new entry here plus a page under `guidelines/`.
 */

export type RuleLevel = "MUST" | "SHOULD" | "MAY" | "MUST NOT" | "SHOULD NOT";

export interface Guide {
  id: string;
  name: string;
  /** Short label used in rule rows and tables. */
  short: string;
  homepage: string;
  ruleUrl: (id: string) => string;
  /** `covered`: has its own Guidelines page and rule rows. `compared`: appears only in comparisons. */
  status: "covered" | "compared";
}

export const guides = {
  zalando: {
    id: "zalando",
    name: "Zalando RESTful API and Event Guidelines",
    short: "Zalando",
    homepage: "https://opensource.zalando.com/restful-api-guidelines/",
    ruleUrl: (id) => `https://opensource.zalando.com/restful-api-guidelines/#${id}`,
    status: "covered",
  },
  google: {
    id: "google",
    name: "Google API Improvement Proposals (AIP)",
    short: "Google AIP",
    homepage: "https://google.aip.dev/",
    ruleUrl: (id) => `https://google.aip.dev/${id}`,
    status: "covered",
  },
  microsoft: {
    id: "microsoft",
    name: "Microsoft Azure REST API Guidelines",
    short: "Microsoft Azure",
    homepage: "https://github.com/microsoft/api-guidelines/blob/vNext/azure/Guidelines.md",
    ruleUrl: () => "https://github.com/microsoft/api-guidelines/blob/vNext/azure/Guidelines.md",
    status: "compared",
  },
} satisfies Record<string, Guide>;

export type GuideId = keyof typeof guides;
