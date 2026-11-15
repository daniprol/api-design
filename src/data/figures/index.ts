/**
 * Step-through figures, by name. Each is rendered by `<Stepper figure="…" />`.
 * Add a figure by writing its frames in its own file and registering it here.
 */
import { lostUpdate } from "./concurrency";
import { paginationDrift } from "./pagination";
import type { StepFigure } from "./svg";

export const figures = {
  "pagination-drift": paginationDrift,
  "lost-update": lostUpdate,
} satisfies Record<string, StepFigure>;

export type FigureName = keyof typeof figures;
export { toSvg, type Frame, type Shape, type StepFigure, type Tone } from "./svg";
