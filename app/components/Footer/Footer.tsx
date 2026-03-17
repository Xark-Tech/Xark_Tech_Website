'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ArrowButton from '../ui/ArrowButton/ArrowButton';
import './style.scss';

const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'Company', href: '/about-xark' },
    { label: 'Products', href: '/products' },
    { label: 'Applications', href: '/applications' },
    { label: 'News & Knowledge', href: '/blog' },
    { label: 'Careers', href: '/careers' },
];

const socialLinks = [
    {
        name: 'LinkedIn',
        href: 'https://www.linkedin.com/company/xark-technologies/',
        icon: '/images/icons/Vector-2.svg',
    },
    {
        name: 'X',
        href: 'https://x.com/XarkTech',
        icon: null,
    },
];

const XIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
            d="M17.86 3H21l-6.86 7.84L22 21h-6.17l-4.83-6.32L5.47 21H2.33l7.33-8.38L2 3h6.33l4.36 5.76L17.86 3Zm-1.08 16.15h1.74L7.38 4.76H5.51l11.27 14.39Z"
            fill="currentColor"
        />
    </svg>
);

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__top">
                    <div className="footer__address-col">
                        <div className="footer__address-block">
                            <div className="footer__heading-row">
                                <Image
                                    src="/images/icons/building.png"
                                    alt=""
                                    width={35}
                                    height={35}
                                    aria-hidden="true"
                                />
                                <h4>Headquarters Address</h4>
                            </div>
                            <p>AK Tower, Mini Bypass Rd Products</p>
                            <p>Kalluthankadavu, Puthiyara Applications</p>
                            <p>Kozhikode, Kerala, India, 673004</p>
                        </div>

                        <div className="footer__address-block">
                            <div className="footer__heading-row">
                                <Image
                                    src="/images/icons/settings-icon.png"
                                    alt=""
                                    width={35}
                                    height={35}
                                    aria-hidden="true"
                                />
                                <h4>Engineering / R&amp;D Office</h4>
                            </div>
                            <p>Xark Technologies Pvt. Ltd</p>
                            <p>TC 1/3215/1, Laham Complex, Vettu Road</p>
                            <p>Kazhakootam</p>
                            <p>Thiruvananthapuram, Kerala, 695582</p>
                        </div>
                    </div>

                    <div className="footer__links-col">
                        <h4>Quick Links</h4>
                        <ul>
                            {quickLinks.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="footer__cta-col">
                        <div className="footer__socials">
                            {socialLinks.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    aria-label={item.name}
                                    className="footer__social-link"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {item.icon ? (
                                        <Image src={item.icon} alt="" width={20} height={20} aria-hidden="true" />
                                    ) : (
                                        <span className="footer__social-icon footer__social-icon--x">
                                            <XIcon />
                                        </span>
                                    )}
                                </a>
                            ))}
                        </div>

                        <ArrowButton label="Contact us" variant="filled" href="/contact" />
                        <div className="footer__brand-wrap">
                            <Link href="/" aria-label="Go to home">
                                <Image
                                    src="/images/xark-green.png"
                                    alt="Xark logo"
                                    width={373}
                                    height={112}
                                    className="footer__brand"
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
