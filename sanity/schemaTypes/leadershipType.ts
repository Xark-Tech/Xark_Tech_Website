import { defineField, defineType } from "sanity";

export const leadershipType = defineType({
  name: "leadershipMember",
  title: "Leadership",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "designation",
      title: "Designation",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "linkedinUrl",
      title: "LinkedIn URL",
      type: "url",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "imagePosition",
      title: "Image Position",
      type: "string",
      description: 'Optional CSS object-position value, e.g. "center top".',
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      validation: (Rule) => Rule.integer().min(0),
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "designation",
      media: "photo",
    },
  },
});

