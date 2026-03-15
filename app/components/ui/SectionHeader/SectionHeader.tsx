import React from 'react';
import './SectionHeader.scss';

interface SectionHeaderProps {
    label?: string;
    title: React.ReactNode;
    description?: string;
    alignment?: 'left' | 'center';
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
    label,
    title,
    description,
    alignment = 'center',
}) => {
    return (
        <div className={`section-header align-${alignment}`}>
            {label && <div className="section-header__label">{label}</div>}
            <h2 className="section-header__title">{title}</h2>
            {description && <p className="section-header__description">{description}</p>}
        </div>
    );
};

export default SectionHeader;
