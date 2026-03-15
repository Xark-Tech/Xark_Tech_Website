import React from 'react';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import SectionHeader from '../../ui/SectionHeader/SectionHeader';
import './style.scss';

export interface ApplicationsOperateItem {
    title: string;
    previewText: string;
    image: string;
    body?: unknown[];
}

interface ApplicationsOperateSectionProps {
    items?: ApplicationsOperateItem[];
}

const EMPTY_ITEMS: ApplicationsOperateItem[] = [];

const ApplicationsOperateSection: React.FC<ApplicationsOperateSectionProps> = ({ items }) => {
    const displayItems = items ?? EMPTY_ITEMS;
    const hasItems = displayItems.length > 0;

    return (
        <section className="applications-operate-section">
            <div className="container">
                <SectionHeader
                    alignment="center"
                        title={
                            <>
                                Where We <span>Operate</span>
                            </>
                        }
                    description="Performance-critical environments where RF accuracy and system reliability are essential, guided by system-level requirements and real deployment conditions."
                />

                {hasItems ? (
                    <div className="applications-operate-list">
                        {displayItems.map((item, index) => {
                            const isReversed = index % 2 !== 0;
                            return (
                                <article
                                    className={`applications-operate-row${isReversed ? ' applications-operate-row--reversed' : ''}`}
                                    key={`${item.title}-${index}`}
                                >
                                    {/* Image side */}
                                    <div className="applications-operate-row__image-wrap">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>

                                    {/* Content side */}
                                    <div className="applications-operate-row__content">
                                        <h3 className="applications-operate-row__title">{item.title}</h3>
                                        {item.body && item.body.length > 0 ? (
                                            <div className="applications-operate-row__body">
                                                <PortableText value={item.body as Parameters<typeof PortableText>[0]['value']} />
                                            </div>
                                        ) : (
                                            <p className="applications-operate-row__subtext">{item.previewText}</p>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <div className="applications-operate-empty-state" role="status" aria-live="polite">
                        No application sectors published yet. We are curating this section and it will appear here soon.
                    </div>
                )}
            </div>
        </section>
    );
};

export default ApplicationsOperateSection;
