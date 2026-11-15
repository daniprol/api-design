/**
 * Offset pagination drifting under concurrent writes, then a keyset cursor
 * that doesn't. Used on /collections/pagination/.
 */
import { group, line, rect, text, type Frame, type Shape, type StepFigure, type Tone } from "./svg";

const W = 360;
const H = 292;
const ROW0 = 76; // y of the first row
const RH = 26; // row pitch
const BOX = 22; // row box height
const SX = 36; // server row x
const SW = 132; // server row width
const CX = 214; // client item x
const CW = 130; // client item width

interface Row {
  id: string;
  /** new: just inserted. gone: deleted, still drawn as a ghost. */
  state?: "new" | "gone";
  /** Highlight with a tone and an optional tag on the right. */
  mark?: Tone;
}

interface Item {
  id: string;
  tone?: Tone;
  tag?: string;
  missing?: boolean;
  enter?: boolean;
}

interface Scene {
  phase: string;
  request: string;
  requestTone?: Tone;
  rows: Row[];
  /** Show offset positions next to the rows. */
  positions: boolean;
  /** Offset window, in positions (offset pagination) or display rows (keyset). */
  window?: { from: number; count: number; tone?: Tone };
  /** Draw the keyset cursor under this order id. */
  cursorAfter?: string;
  page1: Item[];
  page2?: Item[];
}

const time = (id: string) => `09:${id.slice(-2)}`;
const rowY = (i: number) => ROW0 + i * RH;
const page2Y = (i: number) => ROW0 + 3 * RH + 10 + i * RH;

function serverRow(row: Row, i: number, pos: number | undefined, showPos: boolean): Shape {
  const y = rowY(i);
  const gone = row.state === "gone";
  const tone: Tone = gone ? "bad" : (row.mark ?? (row.state === "new" ? "good" : "line"));
  const ink: Tone = gone ? "faint" : row.mark ? row.mark : row.state === "new" ? "good" : "text";
  const parts: Shape[] = [
    rect(SX, y, SW, BOX, {
      tone,
      fill: row.mark || row.state === "new" ? "tint" : "surface",
      dashed: gone,
    }),
    text(SX + 10, y + 15, row.id, { mono: true, tone: ink }),
    text(SX + SW - 8, y + 15, time(row.id), {
      mono: true,
      size: 10,
      anchor: "end",
      tone: gone ? "faint" : "muted",
    }),
  ];
  if (gone) parts.push(line(SX + 8, y + 11, SX + 56, y + 11, { tone: "bad" }));
  if (showPos && pos !== undefined) {
    parts.push(
      text(SX - 8, y + 15, String(pos), { mono: true, size: 10, anchor: "end", tone: "faint" }),
    );
  }
  return group(parts, { enter: row.state === "new" });
}

function clientItem(item: Item, y: number): Shape {
  const tone = item.tone ?? "line";
  return group(
    [
      rect(CX, y, CW, BOX, {
        tone,
        fill: item.missing ? "none" : item.tone ? "tint" : "surface",
        dashed: item.missing,
      }),
      text(CX + 10, y + 15, item.id, {
        mono: true,
        tone: item.missing ? "faint" : (item.tone ?? "text"),
      }),
      ...(item.tag
        ? [
            text(CX + CW - 8, y + 15, item.tag, {
              size: 9.5,
              anchor: "end",
              tone: item.tone ?? "muted",
              bold: true,
            }),
          ]
        : []),
    ],
    { enter: item.enter },
  );
}

function draw(s: Scene): Shape[] {
  const shapes: Shape[] = [
    text(16, 18, s.phase, { size: 9, caps: true, tone: "muted", bold: true }),
    text(16, 40, s.request, { mono: true, size: 11, tone: s.requestTone ?? "accent" }),
    text(SX, 64, "Server, newest first", { size: 9, caps: true, tone: "faint", bold: true }),
    text(CX, 64, "Client has", { size: 9, caps: true, tone: "faint", bold: true }),
  ];

  // Positions skip deleted rows: that is the whole bug.
  let pos = 0;
  const posOf: (number | undefined)[] = s.rows.map((r) => (r.state === "gone" ? undefined : pos++));
  s.rows.forEach((row, i) => shapes.push(serverRow(row, i, posOf[i], s.positions)));

  s.page1.forEach((item, i) => shapes.push(clientItem(item, rowY(i))));
  if (s.page2?.length) {
    shapes.push(
      line(CX + 4, page2Y(0) - 6, CX + CW - 4, page2Y(0) - 6, { tone: "line", dashed: true }),
    );
    s.page2.forEach((item, i) => shapes.push(clientItem(item, page2Y(i))));
  }

  if (s.window) {
    const covered = s.rows
      .map((_, i) => i)
      .filter((i) => {
        const key = s.positions ? posOf[i] : i;
        return key !== undefined && key >= s.window!.from && key < s.window!.from + s.window!.count;
      });
    const a = covered[0];
    const b = covered.at(-1)!;
    const top = rowY(a) - 4;
    const height = rowY(b) - rowY(a) + BOX + 8;
    const tone = s.window.tone ?? "accent";
    const target = s.page2?.length ? s.page2 : s.page1;
    const targetMid =
      (s.page2?.length ? page2Y(0) : rowY(0)) + ((target.length - 1) * RH + BOX) / 2;
    shapes.push(
      group(
        [
          rect(SX - 6, top, SW + 12, height, { tone, strong: true, rx: 9 }),
          line(SX + SW + 8, top + height / 2, CX - 6, targetMid, {
            tone,
            arrow: true,
            strong: true,
          }),
        ],
        { enter: true },
      ),
    );
  }

  if (s.cursorAfter) {
    const i = s.rows.findIndex((r) => r.id === s.cursorAfter);
    const mid = rowY(i) + BOX / 2;
    // A pointer in the left gutter and a label on the right, both on the row.
    shapes.push(
      group(
        [
          line(SX - 20, mid, SX - 3, mid, { tone: "accent", arrow: true, strong: true }),
          text(SX + SW + 12, mid + 3.5, "cursor", { size: 9.5, tone: "accent", bold: true }),
        ],
        { enter: true },
      ),
    );
  }
  return shapes;
}

const ids = (...nums: number[]) => nums.map((v) => `ord_${v}`);
const rows = (...nums: number[]): Row[] => ids(...nums).map((id) => ({ id }));
const items = (...nums: number[]): Item[] => ids(...nums).map((id) => ({ id }));
const fresh = (list: Item[]) => list.map((i) => ({ ...i, enter: true }));

const OFFSET = "Offset pagination";
const KEYSET = "Keyset cursor";
const CURSOR = "eyJpZCI6Im9yZF80NCJ9"; // base64url of {"id":"ord_44"}

const frames: Frame[] = [
  {
    caption:
      "The client asks for the first page with `offset=0&limit=3` and gets the three newest orders: `ord_46`, `ord_45` and `ord_44`. So far, so good.",
    shapes: draw({
      phase: OFFSET,
      request: "GET /orders?offset=0&limit=3",
      rows: rows(46, 45, 44, 43, 42, 41, 40),
      positions: true,
      window: { from: 0, count: 3 },
      page1: fresh(items(46, 45, 44)),
    }),
  },
  {
    caption:
      "Before the client comes back, a customer checks out and `ord_47` lands at the top. Every order below it slides down one place. Nobody tells the client.",
    shapes: draw({
      phase: OFFSET,
      request: "POST /orders  →  201 ord_47",
      requestTone: "good",
      rows: [{ id: "ord_47", state: "new" }, ...rows(46, 45, 44, 43, 42, 41)],
      positions: true,
      page1: items(46, 45, 44),
    }),
  },
  {
    caption:
      "The client asks for `offset=3`. Position 3 now holds `ord_44`, which it already has. A sync job counts it twice, or quietly writes it over itself and hides the bug.",
    shapes: draw({
      phase: OFFSET,
      request: "GET /orders?offset=3&limit=3",
      rows: [{ id: "ord_47" }, ...rows(46, 45), { id: "ord_44", mark: "bad" }, ...rows(43, 42, 41)],
      positions: true,
      window: { from: 3, count: 3 },
      page1: items(46, 45, 44),
      page2: fresh([{ id: "ord_44", tone: "bad", tag: "again" }, ...items(43, 42)]),
    }),
  },
  {
    caption:
      "Rewind and break it the other way. The client has page 1 again, and this time `ord_45` is deleted. Everything below it moves up one place, so `ord_43` is now at position 2.",
    shapes: draw({
      phase: OFFSET,
      request: "DELETE /orders/ord_45  →  204",
      requestTone: "bad",
      rows: [{ id: "ord_46" }, { id: "ord_45", state: "gone" }, ...rows(44, 43, 42, 41, 40)],
      positions: true,
      page1: items(46, 45, 44),
    }),
  },
  {
    caption:
      "Page 2 starts at position 3, which is now `ord_42`. `ord_43` slid back into page 1's range after the client had left it, so no request ever returns it. Nothing errors, and nothing in the logs says an order went missing.",
    shapes: draw({
      phase: OFFSET,
      request: "GET /orders?offset=3&limit=3",
      rows: [...rows(46, 44), { id: "ord_43", mark: "bad" }, ...rows(42, 41, 40)],
      positions: true,
      window: { from: 3, count: 3 },
      page1: items(46, 45, 44),
      page2: fresh([
        { id: "ord_43", tone: "bad", tag: "missed", missing: true },
        ...items(42, 41, 40),
      ]),
    }),
  },
  {
    caption:
      "Now the same morning with a keyset cursor. Page 1 is identical, but its `next` link encodes the last row the client saw, `ord_44` at 09:44, instead of a position.",
    shapes: draw({
      phase: KEYSET,
      request: "GET /orders?limit=3",
      rows: rows(46, 45, 44, 43, 42, 41, 40),
      positions: false,
      window: { from: 0, count: 3 },
      cursorAfter: "ord_44",
      page1: fresh(items(46, 45, 44)),
    }),
  },
  {
    caption:
      "Both accidents happen at once: `ord_47` arrives and `ord_45` is deleted. Positions shift in both directions. The cursor doesn't notice, because it is pinned to a row, not to a place in the list.",
    shapes: draw({
      phase: KEYSET,
      request: "POST ord_47  ·  DELETE ord_45",
      requestTone: "warn",
      rows: [
        { id: "ord_47", state: "new" },
        { id: "ord_46" },
        { id: "ord_45", state: "gone" },
        ...rows(44, 43, 42, 41),
      ],
      positions: false,
      cursorAfter: "ord_44",
      page1: items(46, 45, 44),
    }),
  },
  {
    caption:
      "Page 2 asks for orders older than `ord_44` and gets `ord_43`, `ord_42` and `ord_41`. No repeats, no gaps. `ord_47` turns up the next time the client syncs from the top, which is where new orders belong.",
    shapes: draw({
      phase: KEYSET,
      request: `GET /orders?limit=3&cursor=${CURSOR}`,
      rows: [
        ...rows(47, 46, 44),
        ...rows(43, 42, 41).map((r) => ({ ...r, mark: "good" as Tone })),
        ...rows(40),
      ],
      positions: false,
      window: { from: 3, count: 3, tone: "good" },
      page1: items(46, 45, 44),
      page2: fresh(items(43, 42, 41).map((i) => ({ ...i, tone: "good" as Tone }))),
    }),
  },
];

export const paginationDrift: StepFigure = {
  label: "Offset pagination drifting under inserts and deletes, then a keyset cursor that does not",
  width: W,
  height: H,
  frames,
};
