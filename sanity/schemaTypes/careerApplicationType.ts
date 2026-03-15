import { defineField, defineType } from "sanity";

export const careerApplicationType = defineType({
  name: "careerApplication",
  title: "Career Application",
  type: "document",
  fields: [
    defineField({
      name: "career",
      title: "Career",
      type: "reference",
      to: [{ type: "career" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "careerTitle",
      title: "Career Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "cvFile",
      title: "CV File",
      type: "file",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Reviewed", value: "reviewed" },
          { title: "Shortlisted", value: "shortlisted" },
          { title: "Rejected", value: "rejected" },
        ],
      },
      initialValue: "new",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "careerTitle",
    },
  },
});
