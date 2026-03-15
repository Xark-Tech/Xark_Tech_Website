'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PortableText } from '@portabletext/react';
import { gsap } from 'gsap';

interface ProductDetailTabsProps {
    overview: unknown[];
    specColumnOneTitle?: string;
    specColumnTwoTitle?: string;
    specRows: Array<{ label: string; value: string }>;
}

type TabKey = 'overview' | 'specifications';

const portableTextComponents = {
    block: {
        normal: ({ children }: { children?: React.ReactNode }) => <p>{children}</p>,
        h2: ({ children }: { children?: React.ReactNode }) => <p>{children}</p>,
        h3: ({ children }: { children?: React.ReactNode }) => <p>{children}</p>,
    },
    list: {
        bullet: ({ children }: { children?: React.ReactNode }) => <ul>{children}</ul>,
        number: ({ children }: { children?: React.ReactNode }) => <ol>{children}</ol>,
    },
    marks: {
        strong: ({ children }: { children?: React.ReactNode }) => <strong>{children}</strong>,
        em: ({ children }: { children?: React.ReactNode }) => <em>{children}</em>,
    },
};

const ProductDetailTabs: React.FC<ProductDetailTabsProps> = ({
    overview,
    specColumnOneTitle,
    specColumnTwoTitle,
    specRows,
}) => {
    const hasSpecifications = specRows.length > 0;
    const [activeTab, setActiveTab] = useState<TabKey>('overview');
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!contentRef.current) return;

        gsap.fromTo(
            contentRef.current,
            { autoAlpha: 0, y: 12 },
            { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' },
        );
    }, [activeTab]);

    return (
        <div className="product-overview-card">
            {hasSpecifications && (
                <div className="product-overview-tabs">
                    <button
                        type="button"
                        className={activeTab === 'overview' ? 'is-active' : ''}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button
                        type="button"
                        className={activeTab === 'specifications' ? 'is-active' : ''}
                        onClick={() => setActiveTab('specifications')}
                    >
                        Technical Specifications
                    </button>
                </div>
            )}

            <h3>{activeTab === 'overview' || !hasSpecifications ? 'Overview' : 'Technical Specifications'}</h3>

            <div ref={contentRef} className="product-overview-content">
                {activeTab === 'overview' || !hasSpecifications ? (
                    <PortableText value={overview} components={portableTextComponents} />
                ) : (
                    <div className="product-spec-table-wrap">
                        <table className="product-spec-table">
                            <thead>
                                <tr>
                                    <th>{specColumnOneTitle || 'Specification'}</th>
                                    <th>{specColumnTwoTitle || 'Details'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {specRows.map((row) => (
                                    <tr key={`${row.label}-${row.value}`}>
                                        <td>{row.label}</td>
                                        <td>{row.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetailTabs;
