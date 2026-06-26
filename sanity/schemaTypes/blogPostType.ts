import { defineField, defineType } from "sanity";
import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

export const blogPostType = defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "blogPost" }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "useHtmlFile",
      title: "Use HTML File",
      type: "boolean",
      description:
        "Turn ON to upload a custom .html file instead of using the body editor. When ON, the HTML File field is shown and the Body field is hidden.",
      initialValue: false,
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "blogCategory" }],
      description: "Optional category for the blog post",
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description: "Short description shown on the listing card.",
      validation: (Rule) => Rule.required().max(220),
    }),
    defineField({
      name: "publishedAt",
      title: "Published Date",
      type: "date",
      options: {
        dateFormat: "YYYY-MM-DD",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      description: "Cover image shown on the listing card.",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "additionalImages",
      title: "Additional Images",
      description: "Extra images shown in the blog detail gallery.",
      type: "array",
      hidden: ({ document }) => document?.useHtmlFile === true,
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
              description: "Describe the image for accessibility.",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "htmlFile",
      title: "HTML File",
      type: "file",
      description: "Upload a .html file. This replaces the body content on the detail page.",
      options: { accept: ".html,.htm" },
      hidden: ({ document }) => document?.useHtmlFile !== true,
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document?.useHtmlFile === true && !value) {
            return "HTML File is required when 'Use HTML File' is turned on";
          }
          return true;
        }),
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      hidden: ({ document }) => document?.useHtmlFile === true,
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
              description: "Describe the image for accessibility and SEO.",
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
        },
        {
          type: "object",
          name: "video",
          title: "Video",
          fields: [
            defineField({
              name: "url",
              title: "Video URL",
              type: "url",
              description:
                "YouTube or Vimeo embed URL (e.g. https://www.youtube.com/embed/VIDEO_ID).",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
          preview: {
            select: { title: "caption", subtitle: "url" },
          },
        },
      ],
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document?.useHtmlFile !== true && (!value || value.length === 0)) {
            return "Body is required for normal blog posts";
          }
          return true;
        }),
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "mainImage",
      subtitle: "slug.current",
    },
  },
});
