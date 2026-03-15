import { defineField, defineType } from "sanity";

export const applicationType = defineType({
  name: "application",
  title: "Applications",
  type: "document",
  fields: [
    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtext",
      title: "Subtext (legacy — no longer used)",
      type: "text",
      rows: 3,
      hidden: true,
    }),
    defineField({
      name: "body",
      title: "Body Content",
      description: "Rich text content shown on the Applications detail page",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      description: "Lower numbers appear first",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "mainImage",
      subtitle: "subtext",
    },
    prepare(value) {
      const subtitle =
        typeof value.subtitle === "string" && value.subtitle.length > 72
          ? `${value.subtitle.slice(0, 72)}...`
          : value.subtitle;

      return {
        title: value.title,
        media: value.media,
        subtitle,
      };
    },
  },
});

