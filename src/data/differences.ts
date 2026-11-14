/**
 * Where guidelines disagree. Each entry renders as a `<GuidesDiffer id="…" />`
 * table on its topic page, and all of them together form the comparison matrix
 * on the Guidelines overview.
 */

export interface Position {
  /** Guideline or reference API, as shown in the table. */
  who: string;
  decision: string;
  reason: string;
  url: string;
}

export interface Difference {
  id: string;
  question: string;
  /** Topic id where the difference is discussed. */
  topic: string;
  positions: Position[];
}

const azure = "https://github.com/microsoft/api-guidelines/blob/vNext/azure/Guidelines.md";

export const differences: Difference[] = [
  {
    id: "json-casing",
    question: "Property name casing",
    topic: "representations/json",
    positions: [
      {
        who: "Zalando",
        decision: "`snake_case`",
        reason:
          "No industry standard exists; many large APIs use it, and one consistent look matters more.",
        url: "https://opensource.zalando.com/restful-api-guidelines/#118",
      },
      {
        who: "Google AIP",
        decision: "`lowerCamelCase` in JSON",
        reason:
          "Fields are `snake_case` in protobuf; the standard proto-to-JSON mapping produces camelCase.",
        url: "https://google.aip.dev/140",
      },
      {
        who: "Microsoft Azure",
        decision: "`camelCase`",
        reason: "Matches JavaScript and C# client conventions.",
        url: azure,
      },
      {
        who: "Stripe (API)",
        decision: "`snake_case`",
        reason: "Established in 2011 and kept for compatibility.",
        url: "https://docs.stripe.com/api",
      },
    ],
  },
  {
    id: "versioning",
    question: "Where the version lives",
    topic: "evolution/versioning",
    positions: [
      {
        who: "Zalando",
        decision: "Avoid versions; if unavoidable, in the media type. Never in the URL.",
        reason: "Compatible evolution is the default; URL versions fork resource identity.",
        url: "https://opensource.zalando.com/restful-api-guidelines/#115",
      },
      {
        who: "Google AIP",
        decision: "Major version in the path: `/v1/`, `/v1beta1/`",
        reason: "Each major version is a separate, independently supported surface.",
        url: "https://google.aip.dev/185",
      },
      {
        who: "Microsoft Azure",
        decision: "Required `api-version` query parameter, a date (`2024-05-01`)",
        reason: "Every request names the contract it was written against.",
        url: azure,
      },
      {
        who: "Stripe (API)",
        decision: "Date-based version pinned per account, override with `Stripe-Version`",
        reason: "Server-side transformations keep old versions working without forking code.",
        url: "https://stripe.com/blog/api-versioning",
      },
    ],
  },
  {
    id: "custom-methods",
    question: "Operations that aren't CRUD",
    topic: "modelling/resources",
    positions: [
      {
        who: "Zalando",
        decision: "Model as resources; URLs stay verb-free",
        reason: "Keeps HTTP semantics (caching, idempotency) meaningful.",
        url: "https://opensource.zalando.com/restful-api-guidelines/#141",
      },
      {
        who: "Google AIP",
        decision: "Custom method: `POST /v1/orders/123:cancel`",
        reason: "Explicit verbs where state transitions don't map to standard methods.",
        url: "https://google.aip.dev/136",
      },
      {
        who: "Microsoft Azure",
        decision: "Action: `POST /orders/123:cancel`",
        reason: "Same colon syntax as Google; actions are rare and explicit.",
        url: azure,
      },
      {
        who: "Stripe (API)",
        decision: "Verb sub-path: `POST /v1/payment_intents/{id}/cancel`",
        reason: "Readable; treated as a fixed set of transitions per resource.",
        url: "https://docs.stripe.com/api/payment_intents/cancel",
      },
    ],
  },
  {
    id: "errors",
    question: "Error body format",
    topic: "http/errors",
    positions: [
      {
        who: "Zalando",
        decision: "Problem Details (`application/problem+json`)",
        reason: "An IETF standard that generic tooling understands.",
        url: "https://opensource.zalando.com/restful-api-guidelines/#176",
      },
      {
        who: "Google AIP",
        decision: "`google.rpc.Status`: `code`, `message`, `details` with `ErrorInfo`",
        reason: "One error model across gRPC and HTTP; `ErrorInfo.reason` is machine-readable.",
        url: "https://google.aip.dev/193",
      },
      {
        who: "Microsoft Azure",
        decision:
          '`{"error": {code, message, target, details, innererror}}` plus `x-ms-error-code` header',
        reason:
          "Codes are stable strings clients can switch on; the header allows checks without parsing.",
        url: azure,
      },
      {
        who: "Stripe (API)",
        decision: '`{"error": {type, code, message, param}}`',
        reason: "`param` points at the offending field for form-style integrations.",
        url: "https://docs.stripe.com/api/errors",
      },
    ],
  },
  {
    id: "pagination",
    question: "Pagination shape",
    topic: "collections/pagination",
    positions: [
      {
        who: "Zalando",
        decision: "Cursor-based; response page object with `next`/`prev` links",
        reason: "Stable under concurrent writes; links keep cursors opaque.",
        url: "https://opensource.zalando.com/restful-api-guidelines/#160",
      },
      {
        who: "Google AIP",
        decision: "`page_size` and `page_token`; response `next_page_token`",
        reason: "Opaque tokens let the server change strategy without breaking clients.",
        url: "https://google.aip.dev/158",
      },
      {
        who: "Microsoft Azure",
        decision: "`value` array with `nextLink`",
        reason: "Server-driven paging: the client follows a URL and never builds one.",
        url: azure,
      },
      {
        who: "Stripe (API)",
        decision: "`limit`, `starting_after`/`ending_before` object IDs; `has_more`",
        reason: "Keyset on the object ID; cursors are readable resource IDs.",
        url: "https://docs.stripe.com/api/pagination",
      },
    ],
  },
];

export function findDifference(id: string): Difference {
  const d = differences.find((x) => x.id === id);
  if (!d) throw new Error(`Unknown difference "${id}"`);
  return d;
}
