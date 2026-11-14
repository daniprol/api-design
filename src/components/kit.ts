/**
 * Everything a page needs, in one import:
 *
 *   import { InBrief, Note, Compare, Prefer, Avoid, Rule, RuleGroup, SelfCheck, Question,
 *            WorkedProblem, Solution, GuidesDiffer, Figure, Status, Tabs, TabItem } from "@components/kit";
 */
export {
  Aside,
  Badge,
  Card,
  CardGrid,
  LinkCard,
  Steps,
  TabItem,
  Tabs,
} from "@astrojs/starlight/components";
export { default as Avoid } from "./Avoid.astro";
export { default as Compare } from "./Compare.astro";
export { default as Figure } from "./Figure.astro";
export { default as GuidesDiffer } from "./GuidesDiffer.astro";
export { default as InBrief } from "./InBrief.astro";
export { default as Note } from "./Note.astro";
export { default as Prefer } from "./Prefer.astro";
export { default as Question } from "./Question.astro";
export { default as Rule } from "./Rule.astro";
export { default as RuleGroup } from "./RuleGroup.astro";
export { default as SelfCheck } from "./SelfCheck.astro";
export { default as Solution } from "./Solution.astro";
export { default as Status } from "./Status.astro";
export { default as WorkedProblem } from "./WorkedProblem.astro";
