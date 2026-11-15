/** Glossary terms, rendered by `Glossary.astro` on /reference/glossary/. Definitions allow `code` only. */

export interface Term {
  term: string;
  definition: string;
  /** Root-relative path of the chapter that explains it. */
  see: string;
}

export const glossary: Term[] = [
  {
    term: "At-least-once delivery",
    definition:
      "A delivery guarantee under which every message arrives, possibly more than once. Pair it with idempotent consumers.",
    see: "/events/consuming-events/",
  },
  {
    term: "BOLA",
    definition:
      "Broken Object Level Authorization: reaching someone else's object by changing an ID in the request. First in the OWASP API Security Top 10 (2023).",
    see: "/security/attacks/",
  },
  {
    term: "Brownout",
    definition:
      "A short, announced period during which a deprecated endpoint already fails, so remaining callers notice before the sunset.",
    see: "/evolution/deprecation/",
  },
  {
    term: "Collection",
    definition: "A resource that contains other resources, such as `/orders`.",
    see: "/modelling/resources/",
  },
  {
    term: "Conditional request",
    definition:
      "A request that applies only if a precondition on the resource's current state holds, via `If-Match`, `If-None-Match` and related headers.",
    see: "/reliability/concurrency/",
  },
  {
    term: "Content negotiation",
    definition:
      "Choosing a representation (format, language, version) from the request's `Accept` headers.",
    see: "/http/headers/",
  },
  {
    term: "Contract-first",
    definition:
      "Designing and reviewing the API description before implementing it. Also called API first.",
    see: "/foundations/principles/",
  },
  {
    term: "Cursor pagination",
    definition:
      "Pagination by an opaque pointer to where the last page ended, rather than a numeric offset. Also called keyset pagination when the cursor encodes sort-key values.",
    see: "/collections/pagination/",
  },
  {
    term: "Data change event",
    definition:
      "An event that records a mutation of a resource, usually with a snapshot, so other services can keep a copy.",
    see: "/events/event-design/",
  },
  {
    term: "Deprecation",
    definition:
      "Marking part of an API as still working but scheduled for removal. Signalled with the `Deprecation` header (RFC 9745).",
    see: "/evolution/deprecation/",
  },
  {
    term: "Dual write",
    definition:
      "Updating a database and publishing an event as two separate steps, so a crash between them loses or invents an event. Fixed with a transactional outbox.",
    see: "/events/event-design/",
  },
  {
    term: "ETag",
    definition:
      "An opaque validator for one representation of a resource, used for caching (`If-None-Match`) and for optimistic concurrency (`If-Match`).",
    see: "/collections/caching/",
  },
  {
    term: "HATEOAS",
    definition:
      "Hypermedia as the engine of application state: responses carry links that tell the client what it can do next.",
    see: "/representations/links/",
  },
  {
    term: "Hyrum's Law",
    definition:
      "With enough users, every observable behaviour of an API will be depended on by somebody, whatever the documentation says.",
    see: "/evolution/compatibility/",
  },
  {
    term: "Idempotency key",
    definition:
      "A client-generated unique key that lets the server recognise a retry of the same unsafe request and return the original result.",
    see: "/reliability/idempotency/",
  },
  {
    term: "Idempotent method",
    definition:
      "A method whose intended effect is the same whether a request is sent once or many times. `PUT` and `DELETE` are; `POST` and `PATCH` aren't by definition.",
    see: "/http/methods/",
  },
  {
    term: "JSON Merge Patch",
    definition:
      "RFC 7396. A partial document for `PATCH`: present fields are set, `null` removes a field, and absent fields are untouched.",
    see: "/http/methods/",
  },
  {
    term: "Long-running operation",
    definition:
      "Work that outlives a request. The API answers `202 Accepted` and exposes a resource the client can poll for status and result.",
    see: "/reliability/long-running-operations/",
  },
  {
    term: "Media type",
    definition:
      "The identifier of a payload format, such as `application/json` or `application/problem+json`.",
    see: "/http/headers/",
  },
  {
    term: "OpenAPI",
    definition: "The standard machine-readable description format for HTTP APIs, formerly Swagger.",
    see: "/foundations/principles/",
  },
  {
    term: "Optimistic concurrency",
    definition:
      "Letting clients edit without locks but rejecting a write if the resource changed since they read it. In HTTP: `ETag`, `If-Match` and `412`.",
    see: "/reliability/concurrency/",
  },
  {
    term: "Problem Details",
    definition:
      "RFC 9457. A JSON (or XML) format for error responses with `type`, `title`, `status`, `detail` and `instance`, served as `application/problem+json`.",
    see: "/http/errors/",
  },
  {
    term: "Representation",
    definition:
      "A concrete form of a resource's state sent over the wire, such as a JSON document.",
    see: "/representations/json/",
  },
  {
    term: "Resource",
    definition: "Anything important enough to be named and addressed by a URL.",
    see: "/modelling/resources/",
  },
  {
    term: "Richardson Maturity Model",
    definition:
      "Leonard Richardson's four-level scale of REST adoption: one endpoint, resources, HTTP methods, hypermedia.",
    see: "/foundations/rest-and-alternatives/",
  },
  {
    term: "Safe method",
    definition:
      "A method the client uses without asking for any state change: `GET`, `HEAD`, `OPTIONS`, `TRACE`, `QUERY`.",
    see: "/http/methods/",
  },
  {
    term: "Scope",
    definition: "A named permission attached to an access token, such as `orders:read`.",
    see: "/security/auth/",
  },
  {
    term: "Semantic versioning",
    definition:
      "`MAJOR.MINOR.PATCH`: breaking, compatible addition, fix. Used for the API description, not in URLs.",
    see: "/evolution/versioning/",
  },
  {
    term: "SSRF",
    definition:
      "Server-side request forgery: making a server send requests to a URL the attacker chooses, often an internal one. The main risk of accepting webhook URLs.",
    see: "/security/attacks/",
  },
  {
    term: "Sub-resource",
    definition: "A resource that exists only within a parent, such as `/orders/ord_42/line-items`.",
    see: "/modelling/urls/",
  },
  {
    term: "Sunset",
    definition:
      "The date after which a deprecated resource is expected to stop responding, sent in the `Sunset` header (RFC 8594).",
    see: "/evolution/deprecation/",
  },
  {
    term: "Thin event",
    definition:
      "An event that carries only the type and the affected resource's ID; consumers fetch the current state from the API.",
    see: "/events/webhooks/",
  },
  {
    term: "Token bucket",
    definition:
      "A rate-limiting algorithm that refills tokens at a steady rate up to a burst size; each request takes one.",
    see: "/security/limits/",
  },
  {
    term: "Tolerant reader",
    definition:
      "A client that ignores unknown fields, maps unknown enum values to a fallback, and never depends on field order.",
    see: "/evolution/compatibility/",
  },
  {
    term: "Transactional outbox",
    definition:
      "Writing outgoing events to a table in the same transaction as the data change, and publishing them from there.",
    see: "/events/event-design/",
  },
  {
    term: "Webhook",
    definition: "An event delivered by an HTTP `POST` to a URL the receiver registered.",
    see: "/events/webhooks/",
  },
  {
    term: "Backpressure",
    definition:
      "A consumer's way of telling a producer to slow down, or a server's policy for slow clients: buffer up to a limit, then drop or disconnect.",
    see: "/events/streaming/",
  },
  {
    term: "Bulk operation",
    definition:
      "One request that creates, updates or reads many items, with a documented maximum and a result for each item.",
    see: "/collections/bulk/",
  },
  {
    term: "Canonical log line",
    definition:
      "One structured log line per request that carries everything worth knowing about it: route, client, status, duration, trace ID.",
    see: "/reliability/observability/",
  },
  {
    term: "Egress proxy",
    definition:
      "A proxy that every outbound request passes through, which checks the IP it actually connects to. The standard defence against SSRF through webhook URLs.",
    see: "/security/attacks/",
  },
  {
    term: "Error budget",
    definition:
      "The amount of failure an SLO allows over its window, such as 0.1% of requests in 30 days. Spent budget slows releases down.",
    see: "/reliability/observability/",
  },
  {
    term: "Last-Event-ID",
    definition:
      "The header a Server-Sent Events client sends when it reconnects, so the server can resume the stream after the last event the client saw.",
    see: "/events/streaming/",
  },
  {
    term: "Long polling",
    definition:
      "A request the server holds open until there is something new or a timeout passes; the client then asks again.",
    see: "/events/streaming/",
  },
  {
    term: "Lost update",
    definition:
      "Two clients read the same version, both write, and the second write silently erases the first. Prevented with `If-Match`.",
    see: "/reliability/concurrency/",
  },
  {
    term: "Mass assignment",
    definition:
      "Binding a request body straight onto a model, so a client can set fields it should never write, such as `role` or `total`.",
    see: "/security/attacks/",
  },
  {
    term: "Multi-tenancy",
    definition:
      "Serving many customer organisations from one deployment, with each tenant's data, limits and events isolated from the others.",
    see: "/security/multi-tenancy/",
  },
  {
    term: "Noisy neighbour",
    definition:
      "A tenant whose load degrades service for everyone else on shared infrastructure. Countered with per-tenant limits.",
    see: "/security/multi-tenancy/",
  },
  {
    term: "Row-level security",
    definition:
      "A database feature that filters every query by a policy, such as the current tenant, so a forgotten `WHERE` can't leak rows.",
    see: "/security/multi-tenancy/",
  },
  {
    term: "Server-Sent Events",
    definition:
      "A one-way stream of events from server to client over a plain HTTP response with media type `text/event-stream`, with built-in reconnect and resume.",
    see: "/events/streaming/",
  },
  {
    term: "SLO",
    definition:
      "Service level objective: a target for a measured indicator (an SLI), such as 99.9% of requests succeeding over 30 days.",
    see: "/reliability/observability/",
  },
  {
    term: "Trace context",
    definition:
      "The W3C standard `traceparent` and `tracestate` headers that carry a trace ID across every hop of a request.",
    see: "/reliability/observability/",
  },
  {
    term: "WebSocket",
    definition:
      "A two-way, message-based connection upgraded from HTTP. Worth its operational cost only for genuinely bidirectional, low-latency traffic.",
    see: "/events/streaming/",
  },
  {
    term: "AIP",
    definition:
      "API Improvement Proposal: one of Google's numbered API design guidelines, published at google.aip.dev.",
    see: "/guidelines/google/",
  },
  {
    term: "Field mask",
    definition:
      "A list of field paths that says which fields a request reads or updates, as in Google's `update_mask`. This guide uses JSON Merge Patch instead.",
    see: "/guidelines/google/",
  },
];
