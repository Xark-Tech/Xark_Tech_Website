import { defineField, defineType } from "sanity";

export const operateItemType = defineType({
  name: "operateItem",
  title: "Operate Item",
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
      title: "Subtext",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
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
