import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const source = z.object({
  /** Short label for the metadata line, e.g. "RFC 9110 §9.3". */
  label: z.string(),
  /** Full title for the References list. */
  title: z.string(),
  url: z.url(),
  /** Date the source was last checked (YYYY-MM). */
  accessed: z.string().optional(),
});

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        /** Primary sources: shown under the title and as the References list. */
        sources: z.array(source).optional(),
        /** Related topic ids, e.g. `http/errors`. */
        related: z.array(z.string()).optional(),
      }),
    }),
  }),
};
