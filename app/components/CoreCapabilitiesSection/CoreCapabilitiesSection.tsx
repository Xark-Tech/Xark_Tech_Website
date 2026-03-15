import React from 'react';
import Image from 'next/image';
import SectionHeader from '../ui/SectionHeader/SectionHeader';
import './style.scss';

const CoreCapabilitiesSection = () => {
    return (
        <section className="capabilities-section bg-black py-[80px] md:py-[120px]">
            <div className="container">

                {/* Reusable Section Header */}
                <SectionHeader
                    label="Sectors & Applications"
                    title={<>Core <span className="text-cta-green">Capabilities</span></>}
                    description="Focused RF building blocks, engineered from MMIC design through subsystem integration and validation."
                    alignment="center"
                />

                {/* Grid Container for Capabilities Items */}
                <div className="core-items-container mt-16 md:mt-24">

                    {/* Item 1 */}
                    <div className="core-item">
                        <div className="core-item__icon">
                            <Image src="/images/icons/c1.png" alt="MMIC Design" fill style={{ objectFit: 'contain' }} />
                        </div>
                        <h3 className="core-item__title">MMIC Design</h3>
                        <p className="core-item__description">
                            High-performance GaN and GaAs MMICs across L, S, C, X, Ku, and Ka bands, engineered for power density, efficiency, linearity, and long-term reliability in demanding RF environments.
                        </p>
                    </div>

                    {/* Item 2 */}
                    <div className="core-item">
                        <div className="core-item__icon">
                            <Image src="/images/icons/c2.png" alt="Indigenous Front-End Modules" fill style={{ objectFit: 'contain' }} />
                        </div>
                        <h3 className="core-item__title">Indigenous Front-End Modules</h3>
                        <p className="core-item__description">
                            Integrated front-end modules across X, Ku, and Ka bands, designed for compact architecture, thermal robustness, and scalable deployment.
                        </p>
                    </div>

                    {/* Item 3 */}
                    <div className="core-item">
                        <div className="core-item__icon">
                            <Image src="/images/icons/c3.png" alt="Solid State Power Amplifiers" fill style={{ objectFit: 'contain' }} />
                        </div>
                        <h3 className="core-item__title">Solid State Power Amplifiers</h3>
                        <p className="core-item__description">
                            Wideband, high-power RF amplifiers across L to Ka bands, developed as high-efficiency RF subsystems for radar and communication applications.
                        </p>
                    </div>

                    {/* Item 4 */}
                    <div className="core-item">
                        <div className="core-item__icon">
                            <Image src="/images/icons/c4.png" alt="Phased Array Antenna Systems" fill style={{ objectFit: 'contain' }} />
                        </div>
                        <h3 className="core-item__title">Phased Array Antenna Systems</h3>
                        <p className="core-item__description">
                            Active electronically scanned arrays across X, Ku, and Ka bands, built for precision beam steering and modular scalability.
                        </p>
                    </div>

                    {/* Item 5 */}
                    <div className="core-item">
                        <div className="core-item__icon">
                            <Image src="/images/icons/c5.png" alt="FEM–Antenna Integration" fill style={{ objectFit: 'contain' }} />
                        </div>
                        <h3 className="core-item__title">FEM–Antenna Integration</h3>
                        <p className="core-item__description">
                            Seamless integration of front-end modules with phased array architectures, enabling optimized RF performance, compact implementation, and array-level efficiency.
                        </p>
                    </div>

                </div>

            </div>
        </section>
    );
};

export default CoreCapabilitiesSection;