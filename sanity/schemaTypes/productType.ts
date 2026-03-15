import { defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Product",
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
      name: "enableDetailPage",
      title: "Enable Product Detail Page",
      type: "boolean",
      description:
        "If disabled, this product will stay visible in listing cards but will not open its detail page.",
      initialValue: true,
    }),
    defineField({
      name: "productTypeRef",
      title: "Product Type",
      type: "reference",
      to: [{ type: "productTypeOption" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "productApplicationRef",
      title: "Product Applications",
      type: "array",
      of: [{ type: "reference", to: [{ type: "productApplicationOption" }] }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "cardIcon",
      title: "Card Icon",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "cardSubtext",
      title: "Card Subtext",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "keyPoints",
      title: "Card Key Points",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(3).max(3),
    }),
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "string",
    }),
    defineField({
      name: "heroSubtext",
      title: "Hero Subtext",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "introductionTitle",
      title: "Introduction Title",
      type: "string",
    }),
    defineField({
      name: "introductionSubtext",
      title: "Introduction Subtext",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "datasheetPdf",
      title: "Datasheet PDF",
      type: "file",
      options: {
        accept: ".pdf",
      },
    }),
    defineField({
      name: "drawingPdf",
      title: "Drawing PDF",
      type: "file",
      options: {
        accept: ".pdf",
      },
    }),
    defineField({
      name: "modelPdf",
      title: "3D Model PDF",
      type: "file",
      options: {
        accept: ".pdf",
      },
    }),
    defineField({
      name: "overview",
      title: "Overview",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "specColumnOneTitle",
      title: "Specifications Column 1 Title",
      type: "string",
      initialValue: "Specification",
    }),
    defineField({
      name: "specColumnTwoTitle",
      title: "Specifications Column 2 Title",
      type: "string",
      initialValue: "Details",
    }),
    defineField({
      name: "specRows",
      title: "Specifications Rows",
      type: "array",
      of: [
        defineField({
          name: "row",
          title: "Row",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Column 1 Value",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "value",
              title: "Column 2 Value",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "whereFitsTitle",
      title: "Application Section Title",
      type: "string",
    }),
    defineField({
      name: "whereFitsSubtext",
      title: "Application Section Subtext",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "whereFitsItems",
      title: "Application Items",
      type: "array",
      of: [
        defineField({
          name: "item",
          title: "Application Item",
          type: "object",
          fields: [
            defineField({
              name: "image",
              title: "Image",
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
        }),
      ],
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(160),
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "cardIcon",
      typeTitle: "productTypeRef.title",
      enableDetailPage: "enableDetailPage",
    },
    prepare(value) {
      const typeTitle = typeof value.typeTitle === "string" ? value.typeTitle : "No type";
      const detailStatus =
        typeof value.enableDetailPage === "boolean" ? value.enableDetailPage : true;

      return {
        title: value.title,
        media: value.media,
        subtitle: `${typeTitle} | Detail ${detailStatus ? "On" : "Off"}`,
      };
    },
  },
});
