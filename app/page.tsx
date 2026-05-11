import Hero from './components/Hero/Hero';
import AboutSection from './components/AboutSection/AboutSection';
import CoreCapabilitiesSection from './components/CoreCapabilitiesSection/CoreCapabilitiesSection';
import WhereWeOperateSection from './components/WhereWeOperateSection/WhereWeOperateSection';
import BlogSection, { BlogPostItem } from './components/BlogSection/BlogSection';
import BrandsSection from './components/BrandsSection/BrandsSection';
import BottomCtaSection from './components/BottomCtaSection/BottomCtaSection';
import { getBrandLogos } from '@/sanity/lib/brandLogos';
import {
  getHomePageFeaturedApplications,
  getHomePageFeaturedBlogPosts,
  getHomePageSettings,
} from '@/sanity/lib/homePage';

const formatCardDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

export default async function Home() {
  const [settings, latestApplications, latestBlogPosts, brandLogos] =
    await Promise.all([
      getHomePageSettings(),
      getHomePageFeaturedApplications(3),
      getHomePageFeaturedBlogPosts(3),
      getBrandLogos(),
    ]);

  const homeBlogPosts: BlogPostItem[] = latestBlogPosts.map((post) => ({
    title: post.title,
    date: formatCardDate(post.publishedAt),
    subtext: post.excerpt,
    image: post.image,
    href: `/blog/${post.slug}`,
  }));

  return (
    <main>
      <Hero heroTitle={settings.heroTitle} heroSubtext={settings.heroSubtext} />
      <AboutSection
        aboutSectionTitle={settings.aboutSectionTitle}
        aboutSectionDescription={settings.aboutSectionDescription}
      />
      <CoreCapabilitiesSection />
      <WhereWeOperateSection items={latestApplications} />
      <BlogSection posts={homeBlogPosts} maxItems={3} />
      {brandLogos.length > 0 ? <BrandsSection logos={brandLogos} /> : null}
      <BottomCtaSection />
    </main>
  );
}
