import { defineField, defineType } from "sanity";

export const homePageSettingsType = defineType({
  name: "homePageSettings",
  title: "Home Page Settings",
  type: "document",
  fields: [
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      description: "Main headline on the homepage hero. Falls back to default if left empty.",
      type: "string",
    }),
    defineField({
      name: "heroSubtext",
      title: "Hero Subtext",
      description: "Short paragraph below the hero title. Falls back to default if left empty.",
      type: "string",
    }),
    defineField({
      name: "aboutSectionTitle",
      title: "About Section Title",
      description:
        "Title for the About section on the homepage. Use the 'Green Highlight' decorator to color part of the text green.",
      type: "array",
      of: [
        defineField({
          name: "block",
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
              { title: "Green Highlight", value: "greenHighlight" },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: "aboutSectionDescription",
      title: "About Section Description",
      description: "Paragraph text for the About section. Falls back to default if left empty.",
      type: "text",
    }),
    defineField({
      name: "featuredApplications",
      title: "Featured Application Cards",
      description:
        "Select up to 3 applications to show in the homepage Where We Operate section. The order here is the display order.",
      type: "array",
      of: [
        defineField({
          name: "applicationReference",
          title: "Application",
          type: "reference",
          to: [{ type: "application" }],
          options: {
            disableNew: true,
          },
        }),
      ],
      validation: (Rule) => Rule.max(3).unique(),
    }),
    defineField({
      name: "featuredBlogPosts",
      title: "Featured News Cards",
      description:
        "Select up to 3 blog posts to show in the homepage News & Knowledge section. The order here is the display order.",
      type: "array",
      of: [
        defineField({
          name: "blogPostReference",
          title: "Blog Post",
          type: "reference",
          to: [{ type: "blogPost" }],
          options: {
            disableNew: true,
          },
        }),
      ],
      validation: (Rule) => Rule.max(3).unique(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Home Page Settings",
        subtitle: "Homepage featured content controls",
      };
    },
  },
});
