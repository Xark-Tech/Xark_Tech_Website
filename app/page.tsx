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
} from '@/sanity/lib/homePage';

const formatCardDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

export default async function Home() {
  const latestApplications = await getHomePageFeaturedApplications(3);
  const latestBlogPosts = await getHomePageFeaturedBlogPosts(3);
  const brandLogos = await getBrandLogos();

  const homeBlogPosts: BlogPostItem[] = latestBlogPosts.map((post) => ({
    title: post.title,
    date: formatCardDate(post.publishedAt),
    subtext: post.excerpt,
    image: post.image,
    href: `/blog/${post.slug}`,
  }));

  return (
    <main>
      <Hero />
      <AboutSection />
      <CoreCapabilitiesSection />
      <WhereWeOperateSection items={latestApplications} />
      <BlogSection posts={homeBlogPosts} maxItems={3} />
      {brandLogos.length > 0 ? <BrandsSection logos={brandLogos} /> : null}
      <BottomCtaSection />
    </main>
  );
}
