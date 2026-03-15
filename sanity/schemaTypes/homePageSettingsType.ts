import { defineField, defineType } from "sanity";

export const homePageSettingsType = defineType({
  name: "homePageSettings",
  title: "Home Page Settings",
  type: "document",
  fields: [
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
