/**
 * A lost update between two support agents, then the same edits guarded by
 * If-Match. Used on /reliability/concurrency/.
 */
import { group, line, rect, text, type Frame, type Shape, type StepFigure, type Tone } from "./svg";

const W = 360;
const H = 414;
const X = { alice: 36, bob: 324 } as const;
const SERVER = 180;
const ROW0 = 160;
const RH = 56;

type Who = keyof typeof X;

interface Message {
  who: Who;
  row: number;
  req: string;
  body?: string;
  res: string;
  resTone?: Tone;
  /** Highlight as the newest exchange. */
  latest?: boolean;
}

interface Field {
  value: string;
  tone?: Tone;
}

interface Scene {
  phase: string;
  holds: { alice?: string; bob?: string };
  state: { etag: Field; address: Field; gift_wrap: Field };
  messages: Message[];
}

function head(cx: number, w: number, label: string, mono = false): Shape {
  return group([
    rect(cx - w / 2, 26, w, 24, { tone: "line", fill: "surface", rx: 7 }),
    text(cx, 42, label, { anchor: "middle", mono, bold: !mono, size: mono ? 11 : 11.5 }),
  ]);
}

function message(m: Message): Shape {
  const from = X[m.who];
  const dir = Math.sign(SERVER - from);
  const start = from + dir * 5;
  const end = SERVER - dir * 5;
  const mid = (from + SERVER) / 2;
  const y = ROW0 + m.row * RH;
  const reqTone: Tone = m.latest ? "accent" : "muted";
  const resTone: Tone = m.resTone ?? (m.latest ? "text" : "muted");
  const parts: Shape[] = [
    text(mid, y - 6, m.req, {
      mono: true,
      size: 10,
      anchor: "middle",
      tone: m.latest ? "text" : "muted",
    }),
    line(start, y, end, y, { tone: reqTone, arrow: true, strong: m.latest }),
    text(mid, y + 14, m.res, {
      mono: true,
      size: m.res.length > 20 ? 9.2 : 10,
      anchor: "middle",
      tone: resTone,
      bold: m.latest,
    }),
    line(end, y + 19, start, y + 19, { tone: m.resTone ?? reqTone, arrow: true, dashed: true }),
  ];
  if (m.body)
    parts.unshift(
      text(mid, y - 18, m.body, { mono: true, size: 9, anchor: "middle", tone: "faint" }),
    );
  return group(parts, { enter: m.latest });
}

function draw(s: Scene): Shape[] {
  const shapes: Shape[] = [
    text(16, 14, s.phase, { size: 9, caps: true, tone: "muted", bold: true }),
    line(X.alice, 76, X.alice, H - 4, { tone: "line", dashed: true }),
    line(X.bob, 76, X.bob, H - 4, { tone: "line", dashed: true }),
    line(SERVER, 122, SERVER, H - 4, { tone: "line", dashed: true }),
    head(X.alice, 56, "Alice"),
    head(SERVER, 96, "ord_42", true),
    head(X.bob, 56, "Bob"),
    rect(116, 58, 128, 64, { tone: "line", fill: "surface", rx: 7 }),
  ];

  const rows: [string, Field][] = [
    ["etag", s.state.etag],
    ["address", s.state.address],
    ["gift_wrap", s.state.gift_wrap],
  ];
  rows.forEach(([key, field], i) => {
    const y = 76 + i * 17;
    shapes.push(text(126, y, key, { mono: true, size: 9.5, tone: "faint" }));
    shapes.push(
      text(190, y, field.value, {
        mono: true,
        size: 10,
        tone: field.tone ?? "text",
        bold: !!field.tone,
        enter: !!field.tone,
      }),
    );
  });

  for (const who of ["alice", "bob"] as const) {
    const held = s.holds[who];
    if (held)
      shapes.push(
        text(X[who], 68, `has ${held}`, { mono: true, size: 9.5, anchor: "middle", tone: "muted" }),
      );
  }

  s.messages.forEach((m) => shapes.push(message(m)));
  return shapes;
}

const PLAIN = "Without a precondition";
const GUARDED = "With If-Match";
const v = (n: number, tone?: Tone): Field => ({ value: `"v${n}"`, tone });

const read = (who: Who, n: number, latest = false): Message => ({
  who,
  row: 0,
  req: "GET /orders/ord_42",
  res: `200  ETag "v${n}"`,
  latest,
});

const frames: Frame[] = [
  {
    caption:
      'Alice, on Fernhill\'s support desk, opens `ord_42` to fix the delivery address. The server sends the order with `ETag: "v1"`.',
    shapes: draw({
      phase: PLAIN,
      holds: { alice: '"v1"' },
      state: { etag: v(1), address: { value: "Mill Ln" }, gift_wrap: { value: "false" } },
      messages: [read("alice", 1, true)],
    }),
  },
  {
    caption:
      'A minute later Bob opens the same order to add gift wrap. He gets the same representation and the same `"v1"`. Two people now hold private copies of one order.',
    shapes: draw({
      phase: PLAIN,
      holds: { alice: '"v1"', bob: '"v1"' },
      state: { etag: v(1), address: { value: "Mill Ln" }, gift_wrap: { value: "false" } },
      messages: [read("alice", 1), read("bob", 1, true)],
    }),
  },
  {
    caption:
      'Alice saves. Her `PUT` replaces the order with her copy, the address becomes Elm Row, and the version moves to `"v2"`.',
    shapes: draw({
      phase: PLAIN,
      holds: { alice: '"v2"', bob: '"v1"' },
      state: {
        etag: v(2, "accent"),
        address: { value: "Elm Row", tone: "good" },
        gift_wrap: { value: "false" },
      },
      messages: [
        read("alice", 1),
        read("bob", 1),
        {
          who: "alice",
          row: 1,
          body: "address: Elm Row",
          req: "PUT /orders/ord_42",
          res: '200  ETag "v2"',
          latest: true,
        },
      ],
    }),
  },
  {
    caption:
      "Bob saves his copy, which still says Mill Lane. The server accepts it with `200`, Alice's fix vanishes, and the parcel goes to the old house. Both agents saw success; nobody saw an error.",
    shapes: draw({
      phase: PLAIN,
      holds: { alice: '"v2"', bob: '"v3"' },
      state: {
        etag: v(3, "accent"),
        address: { value: "Mill Ln", tone: "bad" },
        gift_wrap: { value: "true" },
      },
      messages: [
        read("alice", 1),
        read("bob", 1),
        {
          who: "alice",
          row: 1,
          body: "address: Elm Row",
          req: "PUT /orders/ord_42",
          res: '200  ETag "v2"',
        },
        {
          who: "bob",
          row: 2,
          body: "Mill Ln + gift_wrap",
          req: "PUT /orders/ord_42",
          res: '200  ETag "v3"',
          resTone: "bad",
          latest: true,
        },
      ],
    }),
  },
  {
    caption:
      'Replay the morning with one rule: every write carries `If-Match` with the ETag it was based on. Both agents read `"v1"`, exactly as before.',
    shapes: draw({
      phase: GUARDED,
      holds: { alice: '"v1"', bob: '"v1"' },
      state: { etag: v(1), address: { value: "Mill Ln" }, gift_wrap: { value: "false" } },
      messages: [read("alice", 1, true), read("bob", 1, true)],
    }),
  },
  {
    caption:
      'Alice\'s `PUT` sends `If-Match: "v1"`. The order is still at `"v1"`, so the precondition holds, the write goes through and the version becomes `"v2"`.',
    shapes: draw({
      phase: GUARDED,
      holds: { alice: '"v2"', bob: '"v1"' },
      state: {
        etag: v(2, "accent"),
        address: { value: "Elm Row", tone: "good" },
        gift_wrap: { value: "false" },
      },
      messages: [
        read("alice", 1),
        read("bob", 1),
        {
          who: "alice",
          row: 1,
          body: "address: Elm Row",
          req: 'PUT  If-Match: "v1"',
          res: '200  ETag "v2"',
          resTone: "good",
          latest: true,
        },
      ],
    }),
  },
  {
    caption:
      "Bob's `PUT` also sends `If-Match: \"v1\"`, but the order has moved on. The server refuses with `412 Precondition Failed` and changes nothing. Alice's address survives.",
    shapes: draw({
      phase: GUARDED,
      holds: { alice: '"v2"', bob: '"v1"' },
      state: {
        etag: v(2),
        address: { value: "Elm Row", tone: "good" },
        gift_wrap: { value: "false" },
      },
      messages: [
        read("alice", 1),
        read("bob", 1),
        {
          who: "alice",
          row: 1,
          body: "address: Elm Row",
          req: 'PUT  If-Match: "v1"',
          res: '200  ETag "v2"',
        },
        {
          who: "bob",
          row: 2,
          body: "Mill Ln + gift_wrap",
          req: 'PUT  If-Match: "v1"',
          res: "412 Precondition Failed",
          resTone: "bad",
          latest: true,
        },
      ],
    }),
  },
  {
    caption:
      'Bob\'s client re-reads and gets `"v2"` with the new address, reapplies his one change, and retries with `If-Match: "v2"`. `"v3"` has both edits. The conflict cost one round trip instead of a parcel.',
    shapes: draw({
      phase: GUARDED,
      holds: { alice: '"v2"', bob: '"v3"' },
      state: {
        etag: v(3, "accent"),
        address: { value: "Elm Row", tone: "good" },
        gift_wrap: { value: "true", tone: "good" },
      },
      messages: [
        read("alice", 1),
        read("bob", 1),
        {
          who: "alice",
          row: 1,
          body: "address: Elm Row",
          req: 'PUT  If-Match: "v1"',
          res: '200  ETag "v2"',
        },
        {
          who: "bob",
          row: 2,
          body: "Mill Ln + gift_wrap",
          req: 'PUT  If-Match: "v1"',
          res: "412 Precondition Failed",
          resTone: "bad",
        },
        { who: "bob", row: 3, req: "GET /orders/ord_42", res: '200  ETag "v2"', latest: true },
        {
          who: "bob",
          row: 4,
          body: "Elm Row + gift_wrap",
          req: 'PUT  If-Match: "v2"',
          res: '200  ETag "v3"',
          resTone: "good",
          latest: true,
        },
      ],
    }),
  },
];

export const lostUpdate: StepFigure = {
  label:
    "Two support agents edit ord_42: a lost update without a precondition, then If-Match turning the second write into 412",
  width: W,
  height: H,
  frames,
};
