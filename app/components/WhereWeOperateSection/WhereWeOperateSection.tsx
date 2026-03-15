import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SectionHeader from '../ui/SectionHeader/SectionHeader';
import ArrowButton from '../ui/ArrowButton/ArrowButton';
import './style.scss';

export interface WhereWeOperateItem {
    title: string;
    previewText: string;
    image: string;
}

interface WhereWeOperateSectionProps {
    items?: WhereWeOperateItem[];
}

const WhereWeOperateSection: React.FC<WhereWeOperateSectionProps> = ({ items }) => {
    const displayItems = items && items.length > 0 ? items.slice(0, 6) : [];
    const hasItems = displayItems.length > 0;

    return (
        <section className="where-we-operate-section bg-black py-[80px] md:py-[120px]">
            <div className="container">

                <SectionHeader
                    label="Sectors & Applications"
                    title={<>Where We <span className="text-cta-green">Operate</span></>}
                    description="Performance-critical environments where RF accuracy and system reliability are essential, guided by system-level requirements and real deployment conditions."
                    alignment="center"
                />

                {hasItems ? (
                    <div className="operate-items-container mt-16 md:mt-24">
                        {displayItems.map((item, index) => (
                            <Link href="/applications" className="operate-item" key={index}>
                                <div className="operate-item__image-container">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                                <div className="operate-item__content">
                                    <h3 className="operate-item__title">{item.title}</h3>
                                    <p className="operate-item__subtext">{item.previewText}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="operate-empty-state mt-16 md:mt-24" role="status" aria-live="polite">
                        Fresh sectors and applications are being mapped right now. Check back shortly for updates.
                    </div>
                )}

                {hasItems && (
                    <div className="operate-button-row mt-16 md:mt-20 flex justify-center">
                        <ArrowButton label="Explore Products" variant="filled" href="/products" />
                    </div>
                )}

            </div>
        </section>
    );
};

export default WhereWeOperateSection;
