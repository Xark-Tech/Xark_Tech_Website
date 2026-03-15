import React from 'react';
import PageHeroSection from '../components/PageHeroSection/PageHeroSection';
import CareersIntroSection from '../components/careers/CareersIntroSection/CareersIntroSection';
import CareerItemsSection, {
    CareerItem,
} from '../components/careers/CareerItemsSection/CareerItemsSection';
import { getCareerList } from '@/sanity/lib/careers';

const page = async () => {
    const careers = await getCareerList();

    const careerFilters = Array.from(
        new Set(careers.map((career) => career.category).filter((category) => category.length > 0)),
    );

    const careerJobs: CareerItem[] = careers.map((career) => ({
        id: career.id,
        slug: career.slug,
        title: career.title,
        category: career.category,
        experience: career.experience,
        location: career.location,
        type: career.employmentType,
        summary: career.summary,
    }));

    return (
        <main>
            <PageHeroSection
                label="Careers"
                title={
                    <>
                        Careers at <span>XARK</span>
                    </>
                }
                description="If you like hard RF problems, clean trade-offs, and repeatable measurement, you’ll fit in here."
                backgroundImage="/images/careers-hero.png"
                backgroundAlt="Engineering professionals working in an RF testing environment"
                showButtons={false}
            />

            <CareersIntroSection />
            <CareerItemsSection filters={careerFilters} jobs={careerJobs} />
        </main>
    );
};

export default page;
