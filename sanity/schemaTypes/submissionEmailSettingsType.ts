import { defineField, defineType } from "sanity";

export const submissionEmailSettingsType = defineType({
  name: "submissionEmailSettings",
  title: "Submission Email IDs",
  type: "document",
  fields: [
    defineField({
      name: "recipientEmail",
      title: "Fallback Recipient Email",
      description: "Optional fallback email used when a form-specific recipient is not configured.",
      type: "string",
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: "siteAccessRecipientEmail",
      title: "Initial Popup Recipient Email",
      description: "Site-access popup submissions will be forwarded here.",
      type: "string",
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: "contactRecipientEmail",
      title: "Contact Form Recipient Email",
      description: "Contact form submissions will be forwarded here.",
      type: "string",
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: "careerRecipientEmail",
      title: "Career Form Recipient Email",
      description: "Career application submissions will be forwarded here.",
      type: "string",
      validation: (Rule) => Rule.email(),
    }),
  ],
  preview: {
    select: {
      fallback: "recipientEmail",
      siteAccess: "siteAccessRecipientEmail",
      contact: "contactRecipientEmail",
      career: "careerRecipientEmail",
    },
    prepare({ fallback, siteAccess, contact, career }) {
      return {
        title: "Submission Email IDs",
        subtitle:
          [
            siteAccess ? `Popup: ${siteAccess}` : null,
            contact ? `Contact: ${contact}` : null,
            career ? `Career: ${career}` : null,
            fallback ? `Fallback: ${fallback}` : null,
          ]
            .filter(Boolean)
            .join(" • ") || "No recipient emails configured",
      };
    },
  },
});
