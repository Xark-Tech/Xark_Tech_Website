import React from 'react';
import PageHeroSection from '../components/PageHeroSection/PageHeroSection';
import IntroSection from '../components/about/IntroSection/IntroSection';
import KeyPointsSection from '../components/about/KeyPointsSection/KeyPointsSection';
import TeamSection from '../components/TeamSection/TeamSection';
import TestimonialSection from '../components/about/TestimonialSection/TestimonialSection';
import { getLeadershipMembers, getTechnicalAdvisors } from '@/sanity/lib/teamMembers';
import { getXarkQuotes } from '@/sanity/lib/xarkQuotes';

const page = async () => {
    const [leadershipMembers, technicalAdvisors, xarkQuotes] = await Promise.all([
        getLeadershipMembers(),
        getTechnicalAdvisors(),
        getXarkQuotes(),
    ]);

    return (
        <main>
            <PageHeroSection
                title={
                    <>
                        About <span>Xark</span>
                    </>
                }
                description="System-first RF engineering for critical connectivity and sensing."
                backgroundImage="/images/about-hero.png"
                backgroundAlt="Robotics and precision engineering setup"
                primaryButtonLabel="Explore Products"
                primaryButtonHref="/products"
                secondaryButtonLabel="Talk to Engineering"
                secondaryButtonHref="/contact"
            />
            <IntroSection />
            <KeyPointsSection />
            <TeamSection
                label="Our Team"
                title="Leadership"
                members={leadershipMembers}
                emptyMessage="Leadership profiles are being updated. Please check back shortly."
            />
            <TeamSection
                label="Our Team"
                title="Technical Advisors"
                members={technicalAdvisors}
                emptyMessage="Technical advisor profiles are being updated. Please check back shortly."
            />
            <TestimonialSection testimonials={xarkQuotes} />
        </main>
    );
};

export default page;
