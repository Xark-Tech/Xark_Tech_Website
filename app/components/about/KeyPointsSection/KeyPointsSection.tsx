import React from 'react';
import Image from 'next/image';
import './style.scss';

const columns = [
    {
        title: (
            <>
                Why <span>Choose Us</span>
            </>
        ),
        points: [
            'System-level RF understanding from MMICs to phased-array and front-end integration',
            'End-to-end chip-to-array capability',
            'Simulation-driven engineering',
        ],
    },
    {
        title: (
            <>
                Our <span>Mission</span>
            </>
        ),
        points: [
            'Build high-performance RF semiconductor technologies for defense, space, telecom, aerospace, and emerging high-frequency sectors',
            'Enable reliable next-generation communication and sensing systems',
            'Build globally competitive deep-tech innovation with world-class engineering discipline',
        ],
    },
    {
        title: (
            <>
                What <span>We Do</span>
            </>
        ),
        points: [
            'Design GaN/GaAs MMICs (PA, LNA, FEM)',
            'Develop phased-array architectures',
            'Provide RF system & EM design support',
        ],
    },
];

const KeyPointsSection = () => {
    return (
        <div className="keypoints-section-container flex items-center justify-center">
            <div className="keypoints-section container">
                {columns.map((column, columnIndex) => (
                    <div className="keypoints-column" key={`column-${columnIndex}`}>
                        <h5>{column.title}</h5>
                        <div className="points-container">
                            {column.points.map((point) => (
                                <div className="point-item" key={point}>
                                    <Image
                                        src="/images/icons/green-tick.png"
                                        alt=""
                                        width={19}
                                        height={19}
                                        aria-hidden="true"
                                    />
                                    <p>{point}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KeyPointsSection;
