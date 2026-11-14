/**
 * Structure of the Guide: sections and topics in recommended reading order.
 *
 * Drives the sidebar, the contents page, the home index and prev/next order.
 * A topic's page lives at `src/content/docs/<section>/<topic>.mdx`.
 */

export interface Topic {
  slug: string;
  title: string;
  /** One line shown in the contents. */
  summary: string;
}

export interface Section {
  slug: string;
  title: string;
  /** One factual sentence about the section. */
  summary: string;
  topics: Topic[];
}

export const guide: Section[] = [
  {
    slug: "foundations",
    title: "Foundations",
    summary: "What a good API optimises for, and where REST sits among the alternatives.",
    topics: [
      {
        slug: "principles",
        title: "Principles",
        summary: "APIs as products, contract-first design, OpenAPI.",
      },
      {
        slug: "rest-and-alternatives",
        title: "REST and alternatives",
        summary: "REST constraints, maturity levels, RPC, GraphQL, gRPC, async.",
      },
    ],
  },
  {
    slug: "modelling",
    title: "Modelling",
    summary: "Turning a domain into resources and URLs that stay stable.",
    topics: [
      {
        slug: "resources",
        title: "Resources and actions",
        summary: "Nouns, sub-resources, modelling state transitions.",
      },
      { slug: "urls", title: "URL design", summary: "Naming, casing, nesting depth, identifiers." },
    ],
  },
  {
    slug: "http",
    title: "HTTP",
    summary: "Using the protocol's semantics instead of reinventing them.",
    topics: [
      { slug: "methods", title: "Methods", summary: "Safety, idempotency, PUT vs PATCH, QUERY." },
      {
        slug: "status-codes",
        title: "Status codes",
        summary: "Classes, specificity, end-to-end semantics.",
      },
      {
        slug: "errors",
        title: "Errors",
        summary: "Problem Details (RFC 9457), validation errors, leakage.",
      },
      {
        slug: "headers",
        title: "Headers and content negotiation",
        summary: "Standard headers, Prefer, tracing, Accept, i18n.",
      },
    ],
  },
  {
    slug: "representations",
    title: "Representations",
    summary: "The shape of payloads: conventions, formats, links and binary data.",
    topics: [
      {
        slug: "json",
        title: "JSON conventions",
        summary: "Casing, envelopes, enums, null versus absent.",
      },
      {
        slug: "data-formats",
        title: "Data formats",
        summary: "Time, money, numbers, identifiers, standard codes.",
      },
      {
        slug: "links",
        title: "Links",
        summary: "Absolute URIs, link objects, hypermedia in practice.",
      },
      {
        slug: "files",
        title: "Files and large payloads",
        summary: "Multipart, presigned uploads, ranges, resumable uploads.",
      },
    ],
  },
  {
    slug: "collections",
    title: "Collections",
    summary: "Serving large result sets predictably.",
    topics: [
      {
        slug: "pagination",
        title: "Pagination",
        summary: "Keyset over offset, page objects, counts.",
      },
      {
        slug: "filtering",
        title: "Filtering and sorting",
        summary: "Conventional parameters, search resources.",
      },
      {
        slug: "caching",
        title: "Caching",
        summary: "Compression, partial responses, validators, Cache-Control.",
      },
    ],
  },
  {
    slug: "reliability",
    title: "Reliability",
    summary: "Retries, concurrent writers and work that outlives a request.",
    topics: [
      {
        slug: "idempotency",
        title: "Idempotency and retries",
        summary: "Idempotency keys, natural keys, retry policy.",
      },
      {
        slug: "concurrency",
        title: "Concurrency control",
        summary: "Lost updates, ETag and If-Match, 412 and 428.",
      },
      {
        slug: "long-running-operations",
        title: "Long-running operations and batches",
        summary: "202 and job resources, 207 for partial success.",
      },
    ],
  },
  {
    slug: "security",
    title: "Security",
    summary: "Who may call what, on which object, and how often.",
    topics: [
      {
        slug: "auth",
        title: "Authentication and authorization",
        summary: "OAuth 2.0, scopes, object-level checks.",
      },
      {
        slug: "limits",
        title: "Abuse and resource limits",
        summary: "Rate limits, 429, quotas, OWASP API Top 10.",
      },
    ],
  },
  {
    slug: "evolution",
    title: "Evolution",
    summary: "Changing a published contract without breaking its consumers.",
    topics: [
      {
        slug: "compatibility",
        title: "Compatibility",
        summary: "Breaking changes, tolerant readers, extensible enums.",
      },
      {
        slug: "versioning",
        title: "Versioning",
        summary: "URL, media type, header and date-based strategies.",
      },
      {
        slug: "deprecation",
        title: "Deprecation",
        summary: "Deprecation and Sunset headers, usage-driven removal.",
      },
      {
        slug: "specs-in-ci",
        title: "Specs in CI",
        summary: "Metadata, linting, breaking-change detection, contract tests.",
      },
    ],
  },
  {
    slug: "events",
    title: "Events",
    summary: "When the API speaks first: event contracts and delivery.",
    topics: [
      {
        slug: "event-design",
        title: "Event design",
        summary: "Event types, metadata, categories, ordering, outbox.",
      },
      {
        slug: "consuming-events",
        title: "Consuming events",
        summary: "Duplicates, reordering, personal data.",
      },
      {
        slug: "webhooks",
        title: "Webhooks",
        summary: "Signing, delivery IDs, retries, receiver obligations.",
      },
    ],
  },
];

export interface FlatTopic extends Topic {
  section: Section;
  sectionIndex: number;
  topicIndex: number;
  /** Content id, e.g. `http/methods`. */
  id: string;
  /** Display number, e.g. `3.1`. */
  number: string;
}

export const topics: FlatTopic[] = guide.flatMap((section, sectionIndex) =>
  section.topics.map((topic, topicIndex) => ({
    ...topic,
    section,
    sectionIndex,
    topicIndex,
    id: `${section.slug}/${topic.slug}`,
    number: `${sectionIndex + 1}.${topicIndex + 1}`,
  })),
);

export function findTopic(id: string): FlatTopic | undefined {
  const clean = id.replace(/^\/+|\/+$/g, "");
  return topics.find((t) => t.id === clean);
}
