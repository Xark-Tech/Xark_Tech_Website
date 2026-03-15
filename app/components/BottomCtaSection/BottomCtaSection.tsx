import React from 'react';
import Image from 'next/image';
import ArrowButton from '../ui/ArrowButton/ArrowButton';
import SectionHeaderWithAction from '../ui/SectionHeaderWithAction/SectionHeaderWithAction';
import './style.scss';

const BottomCtaSection = () => {
    return (
        <section className="bottom-cta-section">
            <div className="container">
                <div className="bottom-cta-card">
                    <Image
                        src="/images/bottom-cta-image.png"
                        alt="Satellite communication infrastructure"
                        fill
                        quality={95}
                        sizes="100vw"
                        className="bottom-cta-card__bg"
                    />

                    <div className="bottom-cta-card__overlay" />

                    <div className="bottom-cta-card__content">
                        <SectionHeaderWithAction
                            label="Get In Touch"
                            title={
                                <>
                                    Let&apos;s build With <span>Xark.</span>
                                </>
                            }
                            description="Whether you&apos;re evaluating a front-end, planning an antenna system, or translating a complex requirement into deployable hardware, we&apos;ll support your architecture and integration from day one."
                            action={
                                <div className="bottom-cta-card__actions">
                                    <ArrowButton
                                        label="Explore Solutions"
                                        variant="outline"
                                        href="/products"
                                    />
                                    <ArrowButton label="Contact us" variant="filled" href="/contact" />
                                </div>
                            }
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BottomCtaSection;
