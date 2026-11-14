/**
 * Single source of truth for the course structure.
 *
 * The sidebar, the home page map, the lesson header and the progress tracker
 * are all generated from this file. To add a lesson: create the MDX file in
 * `src/content/docs/course/<module>/<lesson>.mdx` and add an entry here.
 */

export interface Lesson {
  slug: string;
  title: string;
  /** Estimated reading time, in minutes. */
  minutes: number;
}

export interface Module {
  slug: string;
  title: string;
  emoji: string;
  /** A short, catchy one-liner shown on the course map. */
  tagline: string;
  /** CSS color (any format) used for the module accent. */
  color: string;
  lessons: Lesson[];
}

export const curriculum: Module[] = [
  {
    slug: "foundations",
    title: "Foundations",
    emoji: "🧭",
    tagline: "Why API design matters, and the mindset that makes great APIs.",
    color: "#8b5cf6",
    lessons: [
      { slug: "apis-are-products", title: "APIs are products", minutes: 7 },
      { slug: "api-first", title: "API first & contracts", minutes: 9 },
      { slug: "rest-in-a-nutshell", title: "REST in a nutshell", minutes: 10 },
    ],
  },
  {
    slug: "resources-and-urls",
    title: "Resources & URLs",
    emoji: "🗺️",
    tagline: "Nouns, not verbs. Designing the map of your domain.",
    color: "#06b6d4",
    lessons: [
      { slug: "thinking-in-resources", title: "Thinking in resources", minutes: 9 },
      { slug: "url-style-guide", title: "The URL style guide", minutes: 8 },
      { slug: "relationships-and-nesting", title: "Relationships & nesting", minutes: 8 },
    ],
  },
  {
    slug: "speaking-http",
    title: "Speaking HTTP",
    emoji: "📡",
    tagline: "Methods, status codes, errors and headers: the protocol is your API.",
    color: "#f97316",
    lessons: [
      { slug: "http-methods", title: "HTTP methods", minutes: 10 },
      { slug: "status-codes", title: "Status codes", minutes: 10 },
      { slug: "errors", title: "Errors people can debug", minutes: 8 },
      { slug: "headers", title: "Headers", minutes: 8 },
    ],
  },
  {
    slug: "payloads",
    title: "Payloads & Data",
    emoji: "📦",
    tagline: "JSON that is boring in the best possible way.",
    color: "#22c55e",
    lessons: [
      { slug: "json-style", title: "JSON style", minutes: 8 },
      { slug: "null-absent-empty", title: "null, absent & empty", minutes: 7 },
      { slug: "data-formats", title: "Dates, money & other formats", minutes: 10 },
    ],
  },
  {
    slug: "collections",
    title: "Collections at Scale",
    emoji: "📚",
    tagline: "Pagination, querying and performance for when there is a lot of stuff.",
    color: "#eab308",
    lessons: [
      { slug: "pagination", title: "Pagination", minutes: 10 },
      { slug: "querying", title: "Filtering, sorting & fields", minutes: 9 },
      { slug: "performance-and-caching", title: "Performance & caching", minutes: 10 },
    ],
  },
  {
    slug: "robustness",
    title: "Robustness",
    emoji: "🛡️",
    tagline: "Networks fail. Clients retry. Two people click Save at once.",
    color: "#ef4444",
    lessons: [
      { slug: "idempotency", title: "Idempotency & safe retries", minutes: 10 },
      { slug: "optimistic-locking", title: "Optimistic locking", minutes: 8 },
      { slug: "async-and-batch", title: "Async jobs & batch requests", minutes: 9 },
      { slug: "rate-limiting", title: "Rate limiting", minutes: 7 },
    ],
  },
  {
    slug: "evolution",
    title: "Evolution",
    emoji: "🧬",
    tagline: "Changing an API without breaking the world.",
    color: "#ec4899",
    lessons: [
      { slug: "compatibility", title: "Backward compatibility", minutes: 10 },
      { slug: "versioning", title: "Versioning", minutes: 9 },
      { slug: "deprecation", title: "Deprecation & sunset", minutes: 7 },
    ],
  },
  {
    slug: "production",
    title: "Production Ready",
    emoji: "🚀",
    tagline: "Security, hypermedia, metadata and running APIs for real.",
    color: "#3b82f6",
    lessons: [
      { slug: "security", title: "Securing APIs", minutes: 9 },
      { slug: "hypermedia", title: "Links & hypermedia", minutes: 8 },
      { slug: "docs-and-operations", title: "Docs, metadata & operations", minutes: 8 },
    ],
  },
  {
    slug: "events",
    title: "Event-Driven APIs",
    emoji: "⚡",
    tagline: "When your API talks first: events are APIs too.",
    color: "#14b8a6",
    lessons: [
      { slug: "events-as-apis", title: "Events are APIs too", minutes: 10 },
      { slug: "consuming-events", title: "Consuming events safely", minutes: 8 },
    ],
  },
];

export interface FlatLesson extends Lesson {
  module: Module;
  moduleIndex: number;
  lessonIndex: number;
  /** 1-based position across the whole course. */
  number: number;
  /** Content slug, e.g. `course/foundations/api-first`. */
  id: string;
}

export const lessons: FlatLesson[] = curriculum.flatMap((module, moduleIndex) =>
  module.lessons.map((lesson, lessonIndex) => ({
    ...lesson,
    module,
    moduleIndex,
    lessonIndex,
    number: 0,
    id: `course/${module.slug}/${lesson.slug}`,
  })),
);
lessons.forEach((lesson, i) => (lesson.number = i + 1));

export const totalMinutes = lessons.reduce((sum, l) => sum + l.minutes, 0);

export function findLesson(id: string): FlatLesson | undefined {
  const clean = id.replace(/^\/+|\/+$/g, "");
  return lessons.find((l) => l.id === clean);
}
