/**
 * Everything a lesson needs, in one import:
 *
 *   import { Hook, Story, DoDont, Do, Dont, Rule, Quiz, Takeaways, Status, Tabs, TabItem } from "@components/lesson";
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
export { default as Do } from "./Do.astro";
export { default as DoDont } from "./DoDont.astro";
export { default as Dont } from "./Dont.astro";
export { default as Hook } from "./Hook.astro";
export { default as Quiz } from "./Quiz.astro";
export { default as Rule } from "./Rule.astro";
export { default as Status } from "./Status.astro";
export { default as Story } from "./Story.astro";
export { default as Takeaways } from "./Takeaways.astro";
