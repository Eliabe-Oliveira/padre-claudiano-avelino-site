import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import {
  AUTHOR_NAME,
  CLOSING_TYPES,
  CONTENT_STATUSES,
  EDITORIAL_THEMES,
  VIDEO_SERIES_NAME,
} from "./config/editorial";
import { SLUG_PATTERN } from "./lib/slugs";

const requiredText = z.string().trim().min(1);
const identifier = z.string().trim().regex(SLUG_PATTERN);
const youtubeId = z.string().regex(/^[A-Za-z0-9_-]{11}$/);
const duration = z.string().regex(/^(?:\d{1,2}:\d{2}|\d+:\d{2}:\d{2})$/);

const reflections = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/data/reflections",
    generateId: ({ data, entry }) =>
      typeof data.slug === "string" ? data.slug : entry.replace(/\.md$/i, ""),
  }),
  schema: ({ image }) =>
    z
      .object({
        title: requiredText,
        slug: identifier,
        excerpt: requiredText,
        publishedAt: z.coerce.date(),
        theme: z.enum(EDITORIAL_THEMES),
        status: z.enum(CONTENT_STATUSES),
        author: z.literal(AUTHOR_NAME),
        updatedAt: z.coerce.date().optional(),
        scriptureReference: requiredText.optional(),
        cover: image().optional(),
        coverAlt: requiredText.optional(),
        featured: z.boolean().default(false),
        closingType: z.enum(CLOSING_TYPES).optional(),
        relatedVideo: reference("videos").optional(),
        relatedReflections: z.array(reference("reflections")).default([]),
        seoTitle: requiredText.optional(),
        seoDescription: requiredText.optional(),
        socialImage: image().optional(),
      })
      .superRefine((data, context) => {
        if (data.cover && !data.coverAlt) {
          context.addIssue({
            code: "custom",
            path: ["coverAlt"],
            message: "coverAlt é obrigatório quando cover existir.",
          });
        }
        if (!data.cover && data.coverAlt) {
          context.addIssue({
            code: "custom",
            path: ["coverAlt"],
            message: "coverAlt não deve existir sem cover.",
          });
        }
        if (data.updatedAt && data.updatedAt < data.publishedAt) {
          context.addIssue({
            code: "custom",
            path: ["updatedAt"],
            message: "updatedAt não pode ser anterior a publishedAt.",
          });
        }

        const relatedIds = data.relatedReflections.map(
          (referenceValue) => referenceValue.id,
        );
        if (relatedIds.includes(data.slug)) {
          context.addIssue({
            code: "custom",
            path: ["relatedReflections"],
            message: "Uma reflexão não pode se relacionar consigo mesma.",
          });
        }
        if (new Set(relatedIds).size !== relatedIds.length) {
          context.addIssue({
            code: "custom",
            path: ["relatedReflections"],
            message: "relatedReflections não pode conter valores duplicados.",
          });
        }
      }),
});

const videos = defineCollection({
  loader: glob({
    pattern: "**/*.{yaml,yml}",
    base: "./src/data/videos",
  }),
  schema: ({ image }) =>
    z
      .object({
        title: requiredText,
        id: identifier,
        series: z.literal(VIDEO_SERIES_NAME),
        youtubeId,
        description: requiredText,
        scriptureReference: requiredText,
        status: z.enum(CONTENT_STATUSES),
        publishedAt: z.coerce.date().optional(),
        duration: duration.optional(),
        featured: z.boolean().default(false),
        thumbnail: image().optional(),
        thumbnailAlt: requiredText.optional(),
        relatedReflection: reference("reflections").optional(),
        sourceUrl: z.url().optional(),
        unlisted: z.boolean().default(false),
        sortOrder: z.number().int().optional(),
      })
      .superRefine((data, context) => {
        if (data.thumbnail && !data.thumbnailAlt) {
          context.addIssue({
            code: "custom",
            path: ["thumbnailAlt"],
            message: "thumbnailAlt é obrigatório quando thumbnail existir.",
          });
        }
        if (!data.thumbnail && data.thumbnailAlt) {
          context.addIssue({
            code: "custom",
            path: ["thumbnailAlt"],
            message: "thumbnailAlt não deve existir sem thumbnail.",
          });
        }
      }),
});

export const collections = {
  reflections,
  videos,
};
