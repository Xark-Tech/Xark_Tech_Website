import React from 'react';
import SectionHeader from '../../ui/SectionHeader/SectionHeader';
import './style.scss';

const metrics = [
    { value: 1, label: 'Year of Focused Execution', hasPlus: false },
    { value: 10, label: 'Core Engineering Team', hasPlus: false },
    { value: 4, label: 'Domain Advisors (Defence, Space, Telecom, Semiconductor)', hasPlus: false },
];

const IntroSection = () => {
    return (
        <div className="intro-section-container flex items-center justify-center">
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
                    {metrics.map((item) => (
                        <div className="metrics-item" key={item.label}>
                            <h6>
                                <span className="metric-value">{item.value}</span>
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
