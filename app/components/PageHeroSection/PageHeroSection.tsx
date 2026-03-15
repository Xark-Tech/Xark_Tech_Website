import React from 'react';
import Image from 'next/image';
import ArrowButton from '../ui/ArrowButton/ArrowButton';
import './style.scss';

interface PageHeroSectionProps {
    label?: string;
    title: React.ReactNode;
    description: string;
    backgroundImage: string;
    backgroundAlt?: string;
    showButtons?: boolean;
    primaryButtonLabel?: string;
    primaryButtonHref?: string;
    secondaryButtonLabel?: string;
    secondaryButtonHref?: string;
}

const PageHeroSection: React.FC<PageHeroSectionProps> = ({
    label,
    title,
    description,
    backgroundImage,
    backgroundAlt = 'Page hero background',
    showButtons = true,
    primaryButtonLabel,
    primaryButtonHref,
    secondaryButtonLabel,
    secondaryButtonHref,
}) => {
    const shouldShowButtons =
        showButtons &&
        !!primaryButtonLabel &&
        !!primaryButtonHref &&
        !!secondaryButtonLabel &&
        !!secondaryButtonHref;

    return (
        <section className="page-hero">
            <Image
                src={backgroundImage}
                alt={backgroundAlt}
                fill
                priority
                quality={95}
                sizes="100vw"
                className="page-hero__bg"
            />

            <div className="page-hero__overlay" />

            <div className="container page-hero__content-wrap">
                <div className="page-hero__content">
                    {label && <div className="page-hero__label">{label}</div>}
                    <h1 className="page-hero__title">{title}</h1>
                    <p className="page-hero__description">{description}</p>

                    {shouldShowButtons && (
                        <div className="page-hero__actions">
                            <ArrowButton label={primaryButtonLabel} variant="outline" href={primaryButtonHref} />
                            <ArrowButton
                                label={secondaryButtonLabel}
                                variant="filled"
                                href={secondaryButtonHref}
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default PageHeroSection;
