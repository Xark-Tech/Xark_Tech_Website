import React from 'react';
import './SectionHeaderWithAction.scss';

interface SectionHeaderWithActionProps {
    label: string;
    title: React.ReactNode;
    description?: string;
    action?: React.ReactNode;
}

const SectionHeaderWithAction: React.FC<SectionHeaderWithActionProps> = ({
    label,
    title,
    description,
    action,
}) => {
    return (
        <div className="section-header-action">
            <div className="section-header-action__left">
                <div className="section-header-action__label">{label}</div>
                <h2 className="section-header-action__title">{title}</h2>
                {description && <p className="section-header-action__description">{description}</p>}
            </div>

            {action && <div className="section-header-action__right">{action}</div>}
        </div>
    );
};

export default SectionHeaderWithAction;
