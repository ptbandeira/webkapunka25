import { z } from 'zod';

export const AlignEnum = z.enum(['left', 'center', 'right']);

export const HeroSchema = z.object({
  type: z.literal('hero'),
  title: z.string(),
  subtitle: z.string().optional(),
  align: AlignEnum.default('left').optional(),
  background_image: z.string().optional(),
  cta_label: z.string().optional(),
  cta_link: z.string().optional(),
});
export type Hero = z.infer<typeof HeroSchema>;

export const TextBlockSchema = z.object({
  type: z.literal('text'),
  heading: z.string(),
  body: z.string(),
  align: AlignEnum.default('left').optional(),
});
export type TextBlock = z.infer<typeof TextBlockSchema>;

export const ProductGridSchema = z.object({
  type: z.literal('productGrid'),
  title: z.string(),
  source: z.string().default('products.json').optional(),
  count: z.number().int().min(1).max(50).optional(),
});
export type ProductGrid = z.infer<typeof ProductGridSchema>;

export const FAQsSchema = z.object({
  type: z.literal('faqs'),
  title: z.string(),
  source: z.string().default('faqs.json').optional(),
});
export type FAQs = z.infer<typeof FAQsSchema>;

export const BannerSchema = z.object({
  type: z.literal('banner'),
  heading: z.string(),
  button_label: z.string().optional(),
  button_link: z.string().optional(),
  background_image: z.string().optional(),
});
export type Banner = z.infer<typeof BannerSchema>;

export const VideoSchema = z.object({
  type: z.literal('video'),
  youtube_url: z.string(),
  caption: z.string().optional(),
});
export type Video = z.infer<typeof VideoSchema>;

export const MetaSectionSchema = z.object({
  type: z.literal('meta'),
  title: z.string().optional(),
  description: z.string().optional(),
  ogImage: z.string().optional(),
});
export type MetaSection = z.infer<typeof MetaSectionSchema>;

export const SectionSchema = z.discriminatedUnion('type', [
  HeroSchema,
  TextBlockSchema,
  ProductGridSchema,
  FAQsSchema,
  BannerSchema,
  VideoSchema,
  MetaSectionSchema,
]);
export type Section = z.infer<typeof SectionSchema>;

export const PageSchema = z.object({
  status: z.union([z.string(), z.boolean()]).optional(),
  updatedAt: z.string().optional(),
  author: z.string().optional(),
  takeover: z.boolean().optional(),
  sections: z.array(SectionSchema).default([]),
});
export type Page = z.infer<typeof PageSchema>;
