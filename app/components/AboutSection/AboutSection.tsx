import React, { type ReactNode } from 'react';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import ArrowButton from '../ui/ArrowButton/ArrowButton';
import './style.scss';

interface AboutSectionProps {
    aboutSectionTitle?: unknown[] | null;
    aboutSectionDescription?: string;
}

const portableTextComponents = {
    block: {
        normal: ({ children }: { children?: ReactNode }) => <>{children}</>,
    },
    marks: {
        greenHighlight: ({ children }: { children?: ReactNode }) => (
            <span className="text-cta-green">{children}</span>
        ),
    },
};

const DEFAULT_ABOUT_TITLE: unknown[] = [
    {
        _type: 'block',
        _key: 'default',
        style: 'normal',
        children: [
            { _type: 'span', _key: 'a', text: 'Engineered for RF Systems ', marks: [] },
            { _type: 'span', _key: 'b', text: 'Across Sectors', marks: ['greenHighlight'] },
        ],
        markDefs: [],
    },
];

const DEFAULT_ABOUT_DESCRIPTION =
    'XARK Technologies is a deep-tech fabless RF semiconductor company designing MMICs, solid-state RF subsystems, phased array antennas, and antenna-FEM solutions for defence, space, and SatCom.';

const AboutSection = ({
    aboutSectionTitle,
    aboutSectionDescription,
}: AboutSectionProps) => {
    const hasCmsTitle =
        Array.isArray(aboutSectionTitle) && aboutSectionTitle.length > 0;
    const titleBlocks = hasCmsTitle ? aboutSectionTitle : DEFAULT_ABOUT_TITLE;
    const description = aboutSectionDescription || DEFAULT_ABOUT_DESCRIPTION;

    return (
        <section className="about-section pt-[24px] pb-[44px] md:py-[104px] bg-black">
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
                            <PortableText
                                value={titleBlocks}
                                components={portableTextComponents}
                            />
                        </h2>

                        {/* Description Paragraph */}
                        <p className="about-description">
                            {description}
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
