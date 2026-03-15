'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './style.scss';

export interface CareerItem {
    id: string;
    slug: string;
    title: string;
    category: string;
    experience: string;
    location: string;
    type: string;
    summary: string;
}

interface CareerItemsSectionProps {
    filters?: string[];
    jobs?: CareerItem[];
}

const CareerItemsSection: React.FC<CareerItemsSectionProps> = ({
    filters = [],
    jobs = [],
}) => {
    const [activeFilter, setActiveFilter] = useState('All');

    const filterOptions = useMemo(() => ['All', ...filters], [filters]);

    const filteredJobs = useMemo(() => {
        if (activeFilter === 'All') {
            return jobs;
        }

        return jobs.filter((job) => job.category === activeFilter);
    }, [activeFilter, jobs]);

    return (
        <section className="career-items-section">
            <div className="career-items container">
                <div className="career-items__filters" role="tablist" aria-label="Career category filters">
                    {filterOptions.map((filter) => (
                        <button
                            key={filter}
                            type="button"
                            role="tab"
                            aria-selected={activeFilter === filter}
                            className={`career-items__filter${activeFilter === filter ? ' is-active' : ''}`}
                            onClick={() => setActiveFilter(filter)}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                <div className="career-items__list">
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map((job) => (
                            <article className="career-item" key={job.id}>
                                <div className="career-item__content">
                                    <h3>{job.title}</h3>

                                    <div className="career-item__details">
                                        <p>
                                            <span>Experience required :</span> {job.experience}
                                        </p>
                                        <p>
                                            <span>Location :</span> {job.location}
                                        </p>
                                        <p>
                                            <span>Type :</span> {job.type}
                                        </p>
                                        <p>
                                            <span>Summary :</span> {job.summary}
                                        </p>
                                    </div>
                                </div>

                                <Link href={`/careers/${job.slug}`} className="career-item__apply">
                                    <span>Apply</span>
                                    <Image
                                        src="/images/icons/green-top-tick-arrow.png"
                                        alt=""
                                        width={30}
                                        height={30}
                                        aria-hidden="true"
                                    />
                                </Link>
                            </article>
                        ))
                    ) : (
                        <p className="career-items__empty">No openings in this category right now.</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CareerItemsSection;
