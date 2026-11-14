/**
 * Lesson progress, stored only in the visitor's browser (localStorage).
 */

const KEY = "api-dojo:done";
const EVENT = "api-dojo:progress";

export function getDone(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return new Set(
      Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [],
    );
  } catch {
    return new Set();
  }
}

export function setDone(id: string, done: boolean): void {
  const all = getDone();
  if (done) all.add(id);
  else all.delete(id);
  try {
    localStorage.setItem(KEY, JSON.stringify([...all]));
  } catch {
    // Storage unavailable (private mode, blocked cookies...). Progress just won't persist.
  }
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function onProgress(callback: () => void): void {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", (e) => e.key === KEY && callback());
}

/** Converts a link href into a lesson id (`course/<module>/<lesson>`). */
export function hrefToId(href: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, "");
  const path = new URL(href, location.origin).pathname;
  return path.slice(base.length).replace(/^\/+|\/+$/g, "");
}

/** Adds a ✓ next to completed lessons in the sidebar. */
export function decorateSidebar(): void {
  const done = getDone();
  for (const link of document.querySelectorAll<HTMLAnchorElement>("nav.sidebar a[href]")) {
    link.classList.toggle("dojo-done", done.has(hrefToId(link.href)));
  }
}
