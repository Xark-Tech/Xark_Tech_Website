'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import SectionHeader from '../ui/SectionHeader/SectionHeader';
import './style.scss';

export interface ClientLogo {
    src: string;
    alt: string;
}

interface BrandsSectionProps {
    logos?: ClientLogo[];
}

const BrandsSection: React.FC<BrandsSectionProps> = ({ logos = [] }) => {
    const sliderRef = useRef<HTMLDivElement>(null);
    const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isPaused, setIsPaused] = useState(false);
    const hasLogos = logos.length > 0;
    const shouldRenderStaticGrid = logos.length > 0 && logos.length <= 3;
    const slidingLogos: ClientLogo[] = hasLogos ? [...logos, ...logos] : [];

    const pauseAutoslideTemporarily = () => {
        setIsPaused(true);

        if (resumeTimerRef.current) {
            clearTimeout(resumeTimerRef.current);
        }

        resumeTimerRef.current = setTimeout(() => {
            setIsPaused(false);
        }, 1400);
    };

    const handleWheelScroll = (event: React.WheelEvent<HTMLDivElement>) => {
        const slider = sliderRef.current;
        if (!slider) return;

        if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
            event.preventDefault();
            slider.scrollLeft += event.deltaY;
            pauseAutoslideTemporarily();
        }
    };

    useEffect(() => {
        if (!hasLogos || shouldRenderStaticGrid) return;

        const slider = sliderRef.current;
        if (!slider) return;

        let animationFrameId = 0;
        const scrollSpeedPerFrame = 0.55;

        const animate = () => {
            if (!isPaused) {
                slider.scrollLeft += scrollSpeedPerFrame;

                const loopPoint = slider.scrollWidth / 2;
                if (slider.scrollLeft >= loopPoint) {
                    slider.scrollLeft -= loopPoint;
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [isPaused, hasLogos, shouldRenderStaticGrid]);

    useEffect(() => {
        return () => {
            if (resumeTimerRef.current) {
                clearTimeout(resumeTimerRef.current);
            }
        };
    }, []);

    return (
        <section className="brands-section bg-black py-[80px] md:py-[120px]">
            <div className="container">
                <SectionHeader
                    label="Clients"
                    title={
                        <>
                            Built <span>With</span>
                        </>
                    }
                    alignment="center"
                />

                {hasLogos ? (
                    shouldRenderStaticGrid ? (
                        <div className="brands-static-grid" aria-label="Client logos">
                            {logos.map((logo) => (
                                <div className="brands-static-grid__item" key={`${logo.alt}-${logo.src}`}>
                                    <div className="brands-slider__logo-box">
                                        <Image
                                            src={logo.src}
                                            alt={logo.alt}
                                            fill
                                            sizes="(max-width: 768px) 220px, 320px"
                                            style={{ objectFit: 'contain', objectPosition: 'center' }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                    <div className="brands-slider-wrapper">
                        <div
                            ref={sliderRef}
                            className="brands-slider"
                            aria-label="Client logos slider"
                            onWheel={handleWheelScroll}
                            onMouseEnter={() => setIsPaused(true)}
                            onMouseLeave={() => setIsPaused(false)}
                            onTouchStart={pauseAutoslideTemporarily}
                            onTouchMove={pauseAutoslideTemporarily}
                            onTouchEnd={pauseAutoslideTemporarily}
                        >
                            <div className="brands-slider__track">
                                {slidingLogos.map((logo, index) => (
                                    <div className="brands-slider__item" key={`${logo.alt}-${index}`}>
                                        <div className="brands-slider__logo-box">
                                            <Image
                                                src={logo.src}
                                                alt={logo.alt}
                                                fill
                                                sizes="(max-width: 768px) 220px, (max-width: 1200px) 280px, 320px"
                                                style={{ objectFit: 'contain', objectPosition: 'center' }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    )
                ) : (
                    <div className="brands-empty-state" role="status" aria-live="polite">
                        Brand logos will appear here once they are published in Studio.
                    </div>
                )}
            </div>
        </section>
    );
};

export default BrandsSection;
