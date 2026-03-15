'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import ArrowButton from '../ui/ArrowButton/ArrowButton';
import './style.scss';

const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Company', href: '/about-xark' },
    { label: 'Products', href: '/products' },
    { label: 'Applications', href: '/applications' },
    { label: 'News & Knowledge', href: '/blog' },
    { label: 'Careers', href: '/careers' },
];

const normalizePath = (value?: string | null) => {
    if (!value) return '/';

    const withoutIndex = value.replace(/\/index(?:\.html)?$/i, '/');
    const withoutTrailingSlash = withoutIndex.replace(/\/+$/, '');

    return withoutTrailingSlash || '/';
};

const Header = () => {
    const pathname = usePathname();
    const currentPath = normalizePath(pathname);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const backdropRef = useRef<HTMLDivElement>(null);
    const mobilePanelRef = useRef<HTMLDivElement>(null);
    const mobileLinkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

    const setMobileLinkRef = (index: number, element: HTMLAnchorElement | null) => {
        mobileLinkRefs.current[index] = element;
    };

    useEffect(() => {
        const backdrop = backdropRef.current;
        const panel = mobilePanelRef.current;
        const links = mobileLinkRefs.current.filter(Boolean);

        if (!backdrop || !panel || links.length === 0) return;

        gsap.set(backdrop, { autoAlpha: 0, display: 'none' });
        gsap.set(panel, { autoAlpha: 0, y: -14, display: 'none' });
        gsap.set(links, { autoAlpha: 0, y: 10 });
    }, []);

    useEffect(() => {
        const backdrop = backdropRef.current;
        const panel = mobilePanelRef.current;
        const links = mobileLinkRefs.current.filter(Boolean);

        if (!backdrop || !panel || links.length === 0) return;

        const timeline = gsap.timeline();

        if (isMenuOpen) {
            gsap.set([backdrop, panel], { display: 'block' });

            timeline
                .to(backdrop, { autoAlpha: 1, duration: 0.24, ease: 'power2.out' })
                .to(panel, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power3.out' }, 0)
                .to(
                    links,
                    { autoAlpha: 1, y: 0, duration: 0.26, stagger: 0.04, ease: 'power2.out' },
                    0.08
                );
        } else {
            timeline
                .to(
                    links,
                    {
                        autoAlpha: 0,
                        y: 8,
                        duration: 0.18,
                        stagger: { each: 0.03, from: 'end' },
                        ease: 'power2.in',
                    },
                    0
                )
                .to(panel, { autoAlpha: 0, y: -12, duration: 0.22, ease: 'power2.in' }, 0)
                .to(backdrop, { autoAlpha: 0, duration: 0.2, ease: 'power2.in' }, 0)
                .set([backdrop, panel], { display: 'none' });
        }

        return () => {
            timeline.kill();
        };
    }, [isMenuOpen]);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [currentPath]);

    useEffect(() => {
        const closeOnDesktop = () => {
            if (window.innerWidth > 1280) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', closeOnDesktop);
        return () => {
            window.removeEventListener('resize', closeOnDesktop);
        };
    }, []);

    const isLinkActive = (href: string) => {
        const targetPath = normalizePath(href);

        if (href === '/') {
            return currentPath === '/' || currentPath === '/home';
        }

        return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
    };

    return (
        <header className="header">
            <div className="container">
                <div className="header__inner">
                    <Link href="/" className="header__logo-link" aria-label="Xark home">
                        <Image
                            src="/images/xark-green.png"
                            alt="Xark logo"
                            width={260}
                            height={78}
                            className="header__logo"
                            priority
                        />
                    </Link>

                    <nav className="header__nav" aria-label="Main navigation">
                        <ul className="header__nav-list">
                            {navLinks.map((link) => (
                                <li key={link.label} className="header__nav-item">
                                    <Link
                                        href={link.href}
                                        className={`header__nav-link${isLinkActive(link.href) ? ' is-active' : ''}`}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="header__cta">
                        <ArrowButton label="Contact us" variant="filled" href="/contact" />
                    </div>

                    <button
                        type="button"
                        className={`header__menu-btn${isMenuOpen ? ' is-open' : ''}`}
                        aria-label="Toggle menu"
                        aria-expanded={isMenuOpen}
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                </div>
            </div>

            <div
                ref={backdropRef}
                className="header__mobile-backdrop"
                onClick={() => setIsMenuOpen(false)}
            />

            <div ref={mobilePanelRef} className="header__mobile-panel">
                <nav aria-label="Mobile navigation">
                    <ul className="header__mobile-list">
                        {navLinks.map((link, index) => (
                            <li key={`mobile-${link.label}`} className="header__mobile-item">
                                <Link
                                    ref={(el) => setMobileLinkRef(index, el)}
                                    href={link.href}
                                    className={`header__mobile-link${isLinkActive(link.href) ? ' is-active' : ''}`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="header__mobile-cta" onClick={() => setIsMenuOpen(false)}>
                    <ArrowButton label="Contact us" variant="filled" href="/contact" />
                </div>
            </div>
        </header>
    );
};

export default Header;
