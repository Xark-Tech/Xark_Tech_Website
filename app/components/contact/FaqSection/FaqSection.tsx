'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import SectionHeader from '../../ui/SectionHeader/SectionHeader';
import './style.scss';

interface FaqItem {
    question: string;
    answer: string;
}

const faqItems: FaqItem[] = [
    {
        question: 'Do you support custom variants for space terminals and link requirements?',
        answer:
            'Yes. We can tailor RF front-end configurations around your link budget, frequency plan, and integration constraints.',
    },
    {
        question: 'How early should we involve XARK in a space program?',
        answer:
            'Engaging during early architecture is ideal. It helps us optimize subsystem boundaries and reduce redesign cycles later.',
    },
    {
        question: 'Can you share detailed specs, models, or test data?',
        answer:
            'We share detailed technical data under the right engagement model, including key performance metrics and validation context.',
    },
    {
        question: 'How do you approach validation for space-relevant RF front-ends?',
        answer:
            'Our flow combines simulation correlation, bench characterization, and application-focused validation to de-risk deployment.',
    },
    {
        question: 'What information should we send to get a fast, useful response?',
        answer:
            'Please include target frequency range, power/noise goals, interface constraints, and expected deployment conditions.',
    },
    {
        question: 'Can you collaborate with our existing RF or system teams?',
        answer:
            'Absolutely. We commonly work as an extension of internal engineering teams with structured technical handoffs.',
    },
];

const FaqSection = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const answerRefs = useRef<(HTMLDivElement | null)[]>([]);
    const iconRefs = useRef<(HTMLSpanElement | null)[]>([]);

    useEffect(() => {
        answerRefs.current.forEach((answer, index) => {
            const icon = iconRefs.current[index];

            if (!answer || !icon) {
                return;
            }

            const isOpen = index === openIndex;

            gsap.killTweensOf(answer);
            gsap.killTweensOf(icon);

            if (isOpen) {
                gsap.to(answer, {
                    height: answer.scrollHeight,
                    autoAlpha: 1,
                    duration: 0.42,
                    ease: 'power2.out',
                });

                gsap.to(icon, {
                    rotate: 180,
                    duration: 0.35,
                    ease: 'power2.out',
                });
            } else {
                gsap.to(answer, {
                    height: 0,
                    autoAlpha: 0,
                    duration: 0.34,
                    ease: 'power2.inOut',
                });

                gsap.to(icon, {
                    rotate: 0,
                    duration: 0.3,
                    ease: 'power2.out',
                });
            }
        });
    }, [openIndex]);

    return (
        <section className="faq-section-container flex items-center justify-center">
            <div className="faq-section container">
                <div className="faq-section__title">
                    <SectionHeader
                        alignment="left"
                        title={
                            <>
                                Common <span>Questions</span>
                            </>
                        }
                        description="Quick answers to common questions."
                    />
                </div>

                <div className="faq-containers-section">
                    {faqItems.map((item, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <article
                                className={`faq-item${isOpen ? ' is-open' : ''}`}
                                key={item.question}
                            >
                                <button
                                    type="button"
                                    className="faq-item__trigger"
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    aria-expanded={isOpen}
                                    aria-controls={`faq-answer-${index}`}
                                >
                                    <span className="faq-item__question">{item.question}</span>
                                    <span
                                        className="faq-item__icon"
                                        ref={(node) => {
                                            iconRefs.current[index] = node;
                                        }}
                                        aria-hidden="true"
                                    >
                                        <svg viewBox="0 0 12 8">
                                            <path
                                                d="M1 1.25 6 6.25l5-5"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1.8"
                                            />
                                        </svg>
                                    </span>
                                </button>

                                <div
                                    id={`faq-answer-${index}`}
                                    className="faq-item__answer-wrap"
                                    ref={(node) => {
                                        answerRefs.current[index] = node;
                                    }}
                                >
                                    <div className="faq-item__answer">
                                        <p>{item.answer}</p>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FaqSection;
