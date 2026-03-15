import Hero from './components/Hero/Hero';
import AboutSection from './components/AboutSection/AboutSection';
import CoreCapabilitiesSection from './components/CoreCapabilitiesSection/CoreCapabilitiesSection';
import WhereWeOperateSection from './components/WhereWeOperateSection/WhereWeOperateSection';
import BlogSection, { BlogPostItem } from './components/BlogSection/BlogSection';
import BrandsSection from './components/BrandsSection/BrandsSection';
import BottomCtaSection from './components/BottomCtaSection/BottomCtaSection';
import { getApplications } from '@/sanity/lib/applications';
import { getBrandLogos } from '@/sanity/lib/brandLogos';
import { getHomePageFeaturedBlogPosts } from '@/sanity/lib/homePage';

const formatCardDate = (date: string) =>
  new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }).replace(/\//g, '-');

export default async function Home() {
  const latestApplications = await getApplications(3);
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
      <BrandsSection logos={brandLogos} />
      <BottomCtaSection />
    </main>
  );
}
