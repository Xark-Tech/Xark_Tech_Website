import React from 'react';
import PageHeroSection from '../components/PageHeroSection/PageHeroSection';
import ApplicationsOperateSection from '../components/applications/ApplicationsOperateSection/ApplicationsOperateSection';
import { getApplications } from '@/sanity/lib/applications';

const page = async () => {
    const applications = await getApplications();

    return (
        <main>
            <PageHeroSection
                title={
                    <>
                        Our <span>Applications</span>
                    </>
                }
                description="MMICs, FEMs, LNAs, PAs, switches, and antennas engineered to perform inside real RF chains."
                backgroundImage="/images/applications-herio.png"
                backgroundAlt="RF infrastructure application background"
                showButtons={false}
            />
            <ApplicationsOperateSection items={applications} />
        </main>
    );
};

export default page;
