import React from 'react';
import PageHeroSection from '../components/PageHeroSection/PageHeroSection';
import './style.scss';
import ContactSection from '../components/contact/ContactSection/ContactSection';
import MapSection from '../components/contact/MapSection/MapSection';

const page = () => {
    return (
        <main>
            <PageHeroSection
                title={
                    <>
                        Contact <span>Xark</span>
                    </>
                }
                description="MMICs, FEMs, LNAs, PAs, switches, and antennas engineered to perform inside real RF chains."
                backgroundImage="/images/hero-image.png"
                backgroundAlt="RF technology background for contact page"
                showButtons={false}
            />
            <ContactSection />
            <MapSection />
            {/* <FaqSection/> */}
        </main>
    );
};

export default page;
