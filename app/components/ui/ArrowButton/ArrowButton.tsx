'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import './ArrowButton.scss';

interface ArrowButtonProps {
    label: string;
    variant?: 'outline' | 'filled';
    onClick?: () => void;
    href?: string;
}

const ArrowButton: React.FC<ArrowButtonProps> = ({
    label,
    variant = 'outline',
    onClick,
    href,
}) => {
    const isExternalHref = href ? /^(https?:\/\/|mailto:|tel:)/i.test(href) : false;

    const interactiveRef = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null);
    const buttonRef = useRef<HTMLSpanElement | null>(null);
    const fillRef = useRef<HTMLSpanElement | null>(null);
    const labelRef = useRef<HTMLSpanElement | null>(null);
    const iconRef = useRef<HTMLSpanElement | null>(null);
    const iconImageRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        const interactive = interactiveRef.current;
        const button = buttonRef.current;
        const fill = fillRef.current;
        const text = labelRef.current;
        const icon = iconRef.current;
        const iconImage = iconImageRef.current;

        if (!interactive || !button || !fill || !text || !icon || !iconImage) {
            return;
        }

        const isFilled = variant === 'filled';

        gsap.set(fill, { scaleX: 0, transformOrigin: 'left center' });
        gsap.set(button, { y: 0, boxShadow: '0 0 0 rgba(0, 0, 0, 0)' });
        gsap.set(text, { color: isFilled ? '#000000' : '#ffffff' });
        gsap.set(icon, { backgroundColor: '#ffffff' });
        gsap.set(iconImage, { filter: 'invert(0)' });

        const enterTl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out', duration: 0.55 } });
        enterTl
            .to(fill, { scaleX: 1 }, 0)
            .to(button, { y: -2, boxShadow: '0 10px 26px rgba(0, 0, 0, 0.28)' }, 0)
            .to(
                text,
                { color: isFilled ? '#ffffff' : '#000000', duration: 0.34, ease: 'power2.out' },
                0.08
            )
            .to(
                icon,
                { backgroundColor: isFilled ? '#a6ea18' : '#000000', duration: 0.36, ease: 'power2.out' },
                0.08
            )
            .to(iconImage, { filter: 'invert(1)', duration: 0.36 }, 0.08)
            .to(icon, { x: 2, duration: 0.35, ease: 'power2.out' }, 0.06);

        const leaveTl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out', duration: 0.5 } });
        leaveTl
            .to(fill, { scaleX: 0, transformOrigin: 'right center' }, 0)
            .to(button, { y: 0, boxShadow: '0 0 0 rgba(0, 0, 0, 0)' }, 0)
            .to(
                text,
                { color: isFilled ? '#000000' : '#ffffff', duration: 0.32, ease: 'power2.out' },
                0.04
            )
            .to(icon, { backgroundColor: '#ffffff', duration: 0.32, ease: 'power2.out' }, 0.04)
            .to(iconImage, { filter: 'invert(0)', duration: 0.32 }, 0.04)
            .to(icon, { x: 0, duration: 0.32, ease: 'power2.out' }, 0.04);

        const handleEnter = () => {
            leaveTl.pause(0);
            enterTl.restart();
        };

        const handleLeave = () => {
            enterTl.pause(0);
            leaveTl.restart();
        };

        interactive.addEventListener('mouseenter', handleEnter);
        interactive.addEventListener('mouseleave', handleLeave);
        interactive.addEventListener('focusin', handleEnter);
        interactive.addEventListener('focusout', handleLeave);

        return () => {
            interactive.removeEventListener('mouseenter', handleEnter);
            interactive.removeEventListener('mouseleave', handleLeave);
            interactive.removeEventListener('focusin', handleEnter);
            interactive.removeEventListener('focusout', handleLeave);
            enterTl.kill();
            leaveTl.kill();
        };
    }, [variant]);

    const content = (
        <span className={`arrow-btn arrow-btn--${variant}`} ref={buttonRef}>
            <span className="arrow-btn__fill" ref={fillRef} aria-hidden="true" />
            <span className="arrow-btn__label" ref={labelRef}>{label}</span>
            <span className="arrow-btn__icon" ref={iconRef}>
                <Image
                    src="/images/up-arrow-icon.png"
                    alt="arrow"
                    width={20}
                    height={20}
                    ref={iconImageRef}
                />
            </span>
        </span>
    );

    if (href) {
        if (isExternalHref) {
            return (
                <a href={href} className="arrow-btn-wrapper" ref={interactiveRef}>
                    {content}
                </a>
            );
        }

        return (
            <Link href={href} className="arrow-btn-wrapper" ref={interactiveRef}>
                {content}
            </Link>
        );
    }

    return (
        <button className="arrow-btn-wrapper" onClick={onClick} type="button" ref={interactiveRef}>
            {content}
        </button>
    );
};

export default ArrowButton;
