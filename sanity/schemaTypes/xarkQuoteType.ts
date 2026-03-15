import { defineField, defineType } from "sanity";

export const xarkQuoteType = defineType({
  name: "xarkQuote",
  title: "Xark Quotes",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 6,
      validation: (Rule) => Rule.required().min(20).max(600),
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      validation: (Rule) => Rule.integer().min(0),
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "role",
      quote: "quote",
    },
    prepare(value) {
      const quote = typeof value.quote === "string" ? value.quote : "";

      return {
        title: value.title,
        subtitle: value.subtitle,
        media: undefined,
        description: quote.length > 96 ? `${quote.slice(0, 96)}...` : quote,
      };
    },
  },
});
