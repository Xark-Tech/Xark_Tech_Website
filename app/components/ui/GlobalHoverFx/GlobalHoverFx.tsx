'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';

const CARD_TARGETS = [
    '.blog-item',
    '.operate-item',
    '.applications-operate-item',
    '.product-item',
    '.career-item',
    '.team-item-card',
    '.product-fit-card',
    '.map-card',
    '.testimonial-card',
].join(',');

const MICRO_INTERACTIVE_TARGETS = [
    'button:not(.header__menu-toggle):not(.arrow-btn-wrapper):not(.blog-detail-hero-media__frame):not(.blog-detail-gallery-arrow):not(.blog-gallery-lightbox__close)',
    '.career-items__filter',
    '.filter-item',
    '.career-item__apply',
    '.product-item__link',
    '.blog-item__arrow-link',
    '.footer__social-link',
    '.blog-pagination button',
    '.applications-operate-pagination button',
].join(',');

const MEDIA_INSIDE_CARD_TARGETS = [
    '.blog-item__image-container img',
    '.operate-item__image-container img',
    '.applications-operate-item__image-container img',
    '.product-fit-card__image img',
    '.team-item-card__image',
    '.map-frame iframe',
].join(',');

const GlobalHoverFx = () => {
    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

        if (prefersReducedMotion || !supportsHover) {
            return;
        }

        const cleanups: Array<() => void> = [];

        const addListener = <K extends keyof HTMLElementEventMap>(
            element: HTMLElement,
            eventName: K,
            listener: (event: HTMLElementEventMap[K]) => void
        ) => {
            element.addEventListener(eventName, listener as EventListener);
            cleanups.push(() => {
                element.removeEventListener(eventName, listener as EventListener);
            });
        };

        gsap.utils.toArray<HTMLElement>(CARD_TARGETS).forEach((card) => {
            const media = card.querySelector<HTMLElement>(MEDIA_INSIDE_CARD_TARGETS);
            const toX = gsap.quickTo(card, 'x', { duration: 0.45, ease: 'power3.out' });
            const toY = gsap.quickTo(card, 'y', { duration: 0.45, ease: 'power3.out' });
            const toRotateX = gsap.quickTo(card, 'rotateX', { duration: 0.5, ease: 'power3.out' });
            const toRotateY = gsap.quickTo(card, 'rotateY', { duration: 0.5, ease: 'power3.out' });

            gsap.set(card, { transformPerspective: 1000, transformStyle: 'preserve-3d', willChange: 'transform' });
            if (media) {
                gsap.set(media, { willChange: 'transform' });
            }

            const onEnter = () => {
                gsap.to(card, { scale: 1.014, duration: 0.42, ease: 'power2.out' });
                if (media) {
                    gsap.to(media, { scale: 1.065, duration: 0.7, ease: 'power3.out' });
                }
            };

            const onMove = (event: MouseEvent) => {
                const rect = card.getBoundingClientRect();
                const xRatio = (event.clientX - rect.left) / rect.width - 0.5;
                const yRatio = (event.clientY - rect.top) / rect.height - 0.5;

                toX(xRatio * 8);
                toY(yRatio * 8);
                toRotateY(xRatio * 4);
                toRotateX(yRatio * -4);
            };

            const onLeave = () => {
                toX(0);
                toY(0);
                toRotateX(0);
                toRotateY(0);
                gsap.to(card, { scale: 1, duration: 0.5, ease: 'power3.out' });
                if (media) {
                    gsap.to(media, { scale: 1, duration: 0.55, ease: 'power3.out' });
                }
            };

            addListener(card, 'mouseenter', onEnter);
            addListener(card, 'mousemove', onMove);
            addListener(card, 'mouseleave', onLeave);
        });

        gsap.utils.toArray<HTMLElement>(MICRO_INTERACTIVE_TARGETS).forEach((item) => {
            const icon = item.querySelector<HTMLElement>('img, svg');

            gsap.set(item, { willChange: 'transform' });
            if (icon) {
                gsap.set(icon, { willChange: 'transform' });
            }

            const onEnter = () => {
                gsap.to(item, { y: -2, duration: 0.28, ease: 'power2.out' });
                if (icon) {
                    gsap.to(icon, { x: 2, rotate: -12, duration: 0.35, ease: 'power2.out' });
                }
            };

            const onLeave = () => {
                gsap.to(item, { y: 0, duration: 0.32, ease: 'power2.out' });
                if (icon) {
                    gsap.to(icon, { x: 0, rotate: 0, duration: 0.35, ease: 'power2.out' });
                }
            };

            addListener(item, 'mouseenter', onEnter);
            addListener(item, 'mouseleave', onLeave);
            addListener(item, 'focusin', onEnter);
            addListener(item, 'focusout', onLeave);
        });

        return () => {
            cleanups.forEach((cleanup) => cleanup());
            gsap.killTweensOf(CARD_TARGETS);
            gsap.killTweensOf(MICRO_INTERACTIVE_TARGETS);
        };
    }, []);

    return null;
};

export default GlobalHoverFx;
