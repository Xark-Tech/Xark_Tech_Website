import { defineField, defineType } from "sanity";

export const careerType = defineType({
  name: "career",
  title: "Career",
  type: "document",
  fields: [
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
      name: "category",
      title: "Category",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "experience",
      title: "Experience",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "employmentType",
      title: "Employment Type",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "applicationEmail",
      title: "Application Email",
      type: "string",
      validation: (Rule) => Rule.email(),
      initialValue: "engineering@xark.info",
    }),
    defineField({
      name: "isActive",
      title: "Is Active",
      type: "boolean",
      initialValue: true,
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
      title: "title",
      category: "category",
      type: "employmentType",
    },
    prepare(value) {
      const category = typeof value.category === "string" ? value.category : "No category";
      const type = typeof value.type === "string" ? value.type : "No type";

      return {
        title: value.title,
        subtitle: `${category} | ${type}`,
      };
    },
  },
});
