'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import SectionHeader from '../../ui/SectionHeader/SectionHeader';
import './style.scss';

const metrics = [
    { value: 1, label: 'Year of Focused Execution', hasPlus: false },
    { value: 10, label: 'Core Engineering Team', hasPlus: false },
    { value: 4, label: 'Domain Advisors (Defence, Space, Telecom, Semiconductor)', hasPlus: false },
    { value: 150, label: 'Years of RF Experience', hasPlus: false },
];

const IntroSection = () => {
    const sectionRef = useRef<HTMLDivElement | null>(null);
    const valueRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const headingRefs = useRef<(HTMLHeadingElement | null)[]>([]);

    useEffect(() => {
        const section = sectionRef.current;
        let timeline: gsap.core.Timeline | null = null;
        let observer: IntersectionObserver | null = null;
        let hasStartedObserving = false;

        if (!section) {
            return;
        }

        let hasAnimated = false;

        const runAnimation = () => {
            if (hasAnimated) {
                return;
            }

            hasAnimated = true;

            headingRefs.current.forEach((heading) => {
                if (!heading) {
                    return;
                }

                gsap.set(heading, {
                    y: 24,
                    autoAlpha: 0,
                    filter: 'blur(8px)',
                });
            });

            timeline = gsap.timeline();

            headingRefs.current.forEach((heading, index) => {
                const valueNode = valueRefs.current[index];
                const metric = metrics[index];

                if (!heading || !valueNode || !metric) {
                    return;
                }

                const counter = { value: 0 };

                timeline.to(
                    heading,
                    {
                        y: 0,
                        autoAlpha: 1,
                        filter: 'blur(0px)',
                        duration: 0.75,
                        ease: 'power3.out',
                    },
                    index * 0.14
                );

                timeline.to(
                    counter,
                    {
                        value: metric.value,
                        duration: 1.6,
                        ease: 'power2.out',
                        snap: { value: 1 },
                        onUpdate: () => {
                            valueNode.textContent = String(Math.round(counter.value));
                        },
                    },
                    index * 0.14 + 0.04
                );
            });
        };

        const startObserving = () => {
            if (hasStartedObserving) {
                return;
            }

            hasStartedObserving = true;

            observer = new IntersectionObserver(
                (entries) => {
                    const shouldAnimate = entries.some(
                        (entry) =>
                            entry.isIntersecting &&
                            entry.intersectionRatio >= 0.45 &&
                            entry.boundingClientRect.top <= window.innerHeight * 0.82
                    );

                    if (shouldAnimate) {
                        runAnimation();
                        observer?.disconnect();
                    }
                },
                {
                    threshold: [0.45, 0.6],
                }
            );

            observer.observe(section);
        };

        const handleScrollStart = () => {
            if (window.scrollY > 48) {
                startObserving();
                window.removeEventListener('scroll', handleScrollStart);
            }
        };

        if (window.scrollY > 48) {
            startObserving();
        } else {
            window.addEventListener('scroll', handleScrollStart, { passive: true });
        }

        return () => {
            observer?.disconnect();
            window.removeEventListener('scroll', handleScrollStart);
            timeline?.kill();
        };
    }, []);

    return (
        <div className="intro-section-container flex items-center justify-center" ref={sectionRef}>
            <div className="intro-section container">
                <SectionHeader
                    label="About Xark"
                    title={
                        <>
                            Engineered for <span>RF Systems Across Sectors</span>
                        </>
                    }
                    alignment="left"
                />

                <p className="intro-section__description">
                    XARK is a deep-tech, fabless RF company designing MMICs, RF subsystems, and antenna
                    systems for performance-critical wireless and sensing applications. We work with a
                    system-first mindset, so every design is guided by integration needs, validation
                    discipline, and real deployment conditions across defence, space, telecommunications,
                    and smart infrastructure.
                </p>

                <div className="metrics-section">
                    {metrics.map((item, index) => (
                        <div className="metrics-item" key={item.label}>
                            <h6 ref={(node) => {
                                headingRefs.current[index] = node;
                            }}>
                                <span
                                    className="metric-value"
                                    ref={(node) => {
                                        valueRefs.current[index] = node;
                                    }}
                                >
                                    0
                                </span>
                                {item.hasPlus && <span className="metric-plus">+</span>}
                            </h6>
                            <p>{item.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default IntroSection;
