import { defineField, defineType } from "sanity";

export const submissionEmailSettingsType = defineType({
  name: "submissionEmailSettings",
  title: "Submission Email ID",
  type: "document",
  fields: [
    defineField({
      name: "recipientEmail",
      title: "Recipient Email",
      description: "Form submissions will be forwarded to this email address.",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
  ],
  preview: {
    select: {
      subtitle: "recipientEmail",
    },
    prepare({ subtitle }) {
      return {
        title: "Submission Email ID",
        subtitle: subtitle || "No recipient email configured",
      };
    },
  },
});
