import React from 'react';
import Image from 'next/image';
import ArrowButton from '../ui/ArrowButton/ArrowButton';
import './style.scss';

const AboutSection = () => {
    return (
        <section className="about-section py-[80px] md:py-[120px] bg-black">
            <div className="container">
                <div className="about-content grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-[100px] items-center">

                    {/* Left side: Text Content */}
                    <div className="about-text flex flex-col items-start">
                        {/* Label Badge */}
                        <div className="about-label">
                            About Xark
                        </div>

                        {/* Main Title */}
                        <h2 className="about-title">
                            Engineered for RF Systems <span className="text-cta-green">Across Sectors</span>
                        </h2>

                        {/* Description Paragraph */}
                        <p className="about-description">
                            XARK Technologies is a deep-tech, fabless semiconductor RF company designing MMICs,
                            solid-state RF subsystems, phased-array antennas, and antenna-FEM integrated solutions for a
                            wide range of connectivity, sensing, and communication systems. By combining component-
                            level semiconductor design with system-level RF understanding, we help customers across
                            defence, space, telecommunications, and other performance-critical RF programs move from
                            architecture to deployment with more confidence.
                        </p>
                    </div>

                    {/* Right side: Image showcase */}
                    <div className="about-image-wrapper relative w-full aspect-[4/3] lg:aspect-[5/4] rounded-[24px] overflow-hidden">
                        <Image
                            src="/images/about-section-image.png"
                            alt="Semiconductor close-up showing RF engineering"
                            fill
                            style={{ objectFit: 'cover' }}
                            quality={90}
                        />
                        {/* Overlaid Button on Image */}
                        <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 z-10">
                            <ArrowButton label="About XARK" variant="filled" href="/about-xark" />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default AboutSection;
