import React from 'react';
import ArrowButton from '../../ui/ArrowButton/ArrowButton';
import SectionHeader from '../../ui/SectionHeader/SectionHeader';
import './style.scss';

const howWeWorkPoints = [
    'First-principles thinking',
    'Clean architecture and structured design reviews',
    'Measurement over assumption',
    'Ownership over hierarchy',
    'Systems mindset from day one',
    'Customer-driven performance targets',
];

const whatToExpectPoints = [
    'Real technical responsibility from day one',
    'Structured technical training and strong mentorship',
    'Exposure to microwave and mmWave system development',
    'Direct involvement in silicon, board-level, and system validation',
    'High engineering standards',
    'Merit-based growth driven by performance',
    'A focused, serious engineering culture',
];

const principleTags = [
    'GaN and GaAs design',
    'Real hardware, not deckware',
    'Measured performance',
    'System-first engineering',
];

const CareersIntroSection = () => {
    return (
        <section className="careers-intro-section">
            <div className="container">
                <div className="careers-intro-section__top">
                    <div className="careers-intro-section__lead">
                        <SectionHeader
                            label="Careers at XARK"
                            title="Hello, Engineer."
                            description="If you chose RF, microwave engineering, or semiconductor design, you already understand this is not an easy field. It demands rigor, precision, respect for physics, and discipline in execution. That is exactly what we stand for."
                            alignment="left"
                        />

                        <div className="careers-intro-section__copy">
                            <p>
                                XARK is a deep-tech, fabless RF company building high-performance MMICs,
                                Front-End Modules (FEMs), and phased-array systems for performance-critical
                                applications across defence, space, telecommunications, and advanced sensing.
                            </p>
                            <p>
                                We design in GaN and GaAs. We build real hardware. We measure what we ship. And
                                we design with the end system in mind.
                            </p>
                            <p>
                                This is an engineering environment where fundamentals matter, measured behavior
                                matters, and performance in deployment matters.
                            </p>
                        </div>
                    </div>

                    <aside className="careers-intro-section__principles">
                        <span className="careers-intro-section__eyebrow">What Defines The Work</span>
                        <div className="careers-intro-section__tag-grid">
                            {principleTags.map((tag) => (
                                <div className="careers-intro-section__tag" key={tag}>
                                    {tag}
                                </div>
                            ))}
                        </div>

                        <p className="careers-intro-section__principles-copy">
                            Performance-critical design across defence, space, telecommunications, and advanced
                            sensing demands engineers who respect the full chain from device physics to
                            integration.
                        </p>
                    </aside>
                </div>

                <div className="careers-intro-section__cards">
                    <article className="careers-intro-card">
                        <h3>How We Work</h3>
                        <p>
                            Our engineering culture is built on fundamentals:
                        </p>
                        <ul>
                            {howWeWorkPoints.map((point) => (
                                <li key={point}>{point}</li>
                            ))}
                        </ul>
                        <div className="careers-intro-card__footer">
                            <p>
                                Every design decision is guided by real deployment conditions: thermal limits,
                                integration constraints, reliability, and system-level performance.
                            </p>
                            <p>We do not design in isolation. We design for integration.</p>
                        </div>
                    </article>

                    <article className="careers-intro-card">
                        <h3>What You Can Expect</h3>
                        <p>
                            You will not be confined to a narrow role. Your work moves from simulation to layout
                            to fabrication to validation to system-level verification.
                        </p>
                        <ul>
                            {whatToExpectPoints.map((point) => (
                                <li key={point}>{point}</li>
                            ))}
                        </ul>
                        <div className="careers-intro-card__footer">
                            <p>
                                You will see the full engineering cycle and how your work impacts real customer
                                deployments.
                            </p>
                        </div>
                    </article>
                </div>

                <div className="careers-intro-section__cta">
                    <div>
                        <p className="careers-intro-section__cta-title">
                            We are building RF technology that must perform, not just in simulations, but in
                            demanding real-world environments.
                        </p>
                        <p className="careers-intro-section__cta-copy">
                            If you want to build hardware that matters and grow as a serious RF engineer, write to
                            us at:
                        </p>
                        <a href="mailto:recruitment@xark.info" className="careers-intro-section__cta-email">
                            recruitment@xark.info
                        </a>
                    </div>

                    <ArrowButton label="Write to Recruitment" variant="filled" href="mailto:recruitment@xark.info" />
                </div>
            </div>
        </section>
    );
};

export default CareersIntroSection;
