/**
 * A tiny, declarative SVG vocabulary for step-through figures.
 *
 * A figure is a list of frames. Each frame is a caption plus the shapes to draw,
 * produced by plain functions in the figure's own file. `<Stepper>` serialises
 * the shapes to SVG; colours come from theme tokens through `tone`, so every
 * figure works in light and dark themes without per-figure CSS.
 */

/** Maps to a theme colour in Stepper.astro. */
export type Tone = "text" | "muted" | "faint" | "line" | "accent" | "good" | "bad" | "warn";

interface Common {
  tone?: Tone;
  /** Fades and slides in when its frame becomes active. */
  enter?: boolean;
}

export type Shape =
  | (Common & {
      kind: "rect";
      x: number;
      y: number;
      w: number;
      h: number;
      rx?: number;
      /** `tint` fills with a wash of the tone; `surface` with the card colour. */
      fill?: "none" | "surface" | "tint";
      dashed?: boolean;
      strong?: boolean;
    })
  | (Common & {
      kind: "text";
      x: number;
      y: number;
      text: string;
      size?: number;
      anchor?: "start" | "middle" | "end";
      mono?: boolean;
      bold?: boolean;
      caps?: boolean;
    })
  | (Common & {
      kind: "line";
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      dashed?: boolean;
      arrow?: boolean;
      strong?: boolean;
    })
  | (Common & { kind: "group"; children: Shape[] });

export interface Frame {
  /** What just happened, in the house voice. Backticks become `<code>`. */
  caption: string;
  shapes: Shape[];
}

export interface StepFigure {
  /** Accessible name for the whole figure. */
  label: string;
  width: number;
  height: number;
  frames: Frame[];
}

/* ---------- Builders ---------- */

export const rect = (
  x: number,
  y: number,
  w: number,
  h: number,
  opts: Omit<Extract<Shape, { kind: "rect" }>, "kind" | "x" | "y" | "w" | "h"> = {},
): Shape => ({ kind: "rect", x, y, w, h, ...opts });

export const text = (
  x: number,
  y: number,
  value: string,
  opts: Omit<Extract<Shape, { kind: "text" }>, "kind" | "x" | "y" | "text"> = {},
): Shape => ({ kind: "text", x, y, text: value, ...opts });

export const line = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  opts: Omit<Extract<Shape, { kind: "line" }>, "kind" | "x1" | "y1" | "x2" | "y2"> = {},
): Shape => ({ kind: "line", x1, y1, x2, y2, ...opts });

export const group = (children: Shape[], opts: Common = {}): Shape => ({
  kind: "group",
  children,
  ...opts,
});

/* ---------- Serialiser ---------- */

const esc = (s: string) =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const n = (v: number) => Math.round(v * 100) / 100;

const cls = (shape: Common, ...extra: (string | false | undefined)[]) =>
  [`t-${shape.tone ?? "text"}`, shape.enter && "is-enter", ...extra].filter(Boolean).join(" ");

function arrowHead(x1: number, y1: number, x2: number, y2: number, size = 6): string {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const p = (da: number) => `${n(x2 - size * Math.cos(a + da))},${n(y2 - size * Math.sin(a + da))}`;
  return `${n(x2)},${n(y2)} ${p(0.45)} ${p(-0.45)}`;
}

export function toSvg(shape: Shape): string {
  switch (shape.kind) {
    case "rect":
      return `<rect class="${cls(shape, "s-rect", `f-${shape.fill ?? "none"}`, shape.dashed && "is-dashed", shape.strong && "is-strong")}" x="${n(shape.x)}" y="${n(shape.y)}" width="${n(shape.w)}" height="${n(shape.h)}" rx="${shape.rx ?? 6}"/>`;
    case "text":
      return `<text class="${cls(shape, "s-text", shape.mono && "is-mono", shape.bold && "is-bold", shape.caps && "is-caps")}" x="${n(shape.x)}" y="${n(shape.y)}" font-size="${shape.size ?? 11}" text-anchor="${shape.anchor ?? "start"}">${esc(shape.caps ? shape.text.toUpperCase() : shape.text)}</text>`;
    case "line": {
      const { x1, y1, x2, y2 } = shape;
      // Stop the shaft short of the tip so the head stays sharp.
      const len = Math.hypot(x2 - x1, y2 - y1) || 1;
      const ex = shape.arrow ? x2 - ((x2 - x1) / len) * 4 : x2;
      const ey = shape.arrow ? y2 - ((y2 - y1) / len) * 4 : y2;
      const body = `<line class="s-line${shape.dashed ? " is-dashed" : ""}${shape.strong ? " is-strong" : ""}" x1="${n(x1)}" y1="${n(y1)}" x2="${n(ex)}" y2="${n(ey)}"/>`;
      const head = shape.arrow
        ? `<polygon class="s-head" points="${arrowHead(x1, y1, x2, y2)}"/>`
        : "";
      return `<g class="${cls(shape)}">${body}${head}</g>`;
    }
    case "group":
      return `<g class="${cls(shape)}">${shape.children.map(toSvg).join("")}</g>`;
  }
}
