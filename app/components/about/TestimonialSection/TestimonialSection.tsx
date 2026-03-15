"use client";
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import SectionHeader from '../../ui/SectionHeader/SectionHeader';
import './style.scss';
import type { XarkQuote } from '@/sanity/lib/xarkQuotes';

const cultureIntro =
    'At Xark, we are driven by engineering excellence, ownership, and measurable performance. We believe in merit-based growth, disciplined execution, and continuous learning, building high-frequency semiconductor and RF technologies with long-term vision, technical rigor, and global standards.';

interface TestimonialSectionProps {
    testimonials?: XarkQuote[];
}

const TestimonialSection = ({ testimonials = [] }: TestimonialSectionProps) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const active = testimonials[activeIndex] ?? testimonials[0];
    const quoteIconRef = useRef<HTMLImageElement | null>(null);
    const quoteTextRef = useRef<HTMLParagraphElement | null>(null);
    const authorRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!active) return;

        const icon = quoteIconRef.current;
        const quote = quoteTextRef.current;
        const author = authorRef.current;

        if (!icon || !quote || !author) return;

        const timeline = gsap.timeline();
        timeline
            .fromTo(
                icon,
                { autoAlpha: 0, y: 10, scale: 0.92 },
                { autoAlpha: 1, y: 0, scale: 1, duration: 0.36, ease: 'power3.out' }
            )
            .fromTo(
                quote,
                { autoAlpha: 0, y: 14 },
                { autoAlpha: 1, y: 0, duration: 0.44, ease: 'power3.out' },
                0.06
            )
            .fromTo(
                author,
                { autoAlpha: 0, y: 10 },
                { autoAlpha: 1, y: 0, duration: 0.36, ease: 'power3.out' },
                0.14
            );

        return () => {
            timeline.kill();
        };
    }, [active, activeIndex]);

    useEffect(() => {
        if (isPaused || testimonials.length <= 1) return;

        const intervalId = window.setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % testimonials.length);
        }, 5200);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [isPaused, testimonials.length]);

    const handlePrev = () => {
        if (testimonials.length <= 1) return;
        setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    };

    const handleNext = () => {
        if (testimonials.length <= 1) return;
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
    };

    return (
        <section className="testimonial-section-container-main flex items-center justify-center">
            <div className="testimonial-section container">
                <SectionHeader
                    title={
                        <>
                            Xark <span>Culture</span>
                        </>
                    }
                    description={cultureIntro}
                    alignment="center"
                />

                {active ? (
                    <div
                        className="testimonial-slider"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                        onTouchStart={() => setIsPaused(true)}
                        onTouchEnd={() => setIsPaused(false)}
                    >
                        <button
                            type="button"
                            className="testimonial-arrow testimonial-arrow--left"
                            onClick={handlePrev}
                            aria-label="Previous testimonial"
                            disabled={testimonials.length <= 1}
                        >
                            <Image
                                src="/images/icons/green-left-arrow.png"
                                alt=""
                                width={21}
                                height={40}
                                aria-hidden="true"
                            />
                        </button>

                        <article className="testimonial-card" key={`${active.id}-${activeIndex}`}>
                            <Image
                                src="/images/icons/quote-green.png"
                                alt=""
                                width={66}
                                height={53}
                                ref={quoteIconRef}
                                className="testimonial-card__quote-icon"
                                aria-hidden="true"
                            />

                            <p className="testimonial-card__quote" ref={quoteTextRef}>
                                {active.quote}
                            </p>

                            <div className="testimonial-card__author" ref={authorRef}>
                                <h6>{active.name}</h6>
                                <p>{active.role}</p>
                            </div>
                        </article>

                        <button
                            type="button"
                            className="testimonial-arrow testimonial-arrow--right"
                            onClick={handleNext}
                            aria-label="Next testimonial"
                            disabled={testimonials.length <= 1}
                        >
                            <Image
                                src="/images/icons/green-left-arrow.png"
                                alt=""
                                width={21}
                                height={40}
                                aria-hidden="true"
                            />
                        </button>
                    </div>
                ) : (
                    <div className="testimonial-empty-state" role="status" aria-live="polite">
                        The next chapter of XARK culture is being written. Fresh voices, founder notes, and field
                        reflections will appear here soon.
                    </div>
                )}
            </div>
        </section>
    );
};

export default TestimonialSection;
