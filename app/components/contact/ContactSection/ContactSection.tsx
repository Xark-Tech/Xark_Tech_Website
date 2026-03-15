'use client';

import React, { useState } from 'react';
import SectionHeader from '../../ui/SectionHeader/SectionHeader';
import './style.scss';

const addressBlocks = [
    {
        title: 'Headquarters Address',
        icon: 'building',
        lines: [
            'AK Tower, Mini Bypass Rd Products',
            'Kalluthankadavu, Puthiyara Applications',
            'Kozhikode, Kerala, India, 673004',
        ],
    },
    {
        title: 'Engineering / R&D Office',
        icon: 'settings',
        lines: [
            'Xark Technologies Pvt. Ltd',
            'TC 1/3215/1, Laham Complex, Vettu Road',
            'Kazhakootam',
            'Thiruvananthapuram, Kerala, 695582',
        ],
    },
];

const socialLinks = [
    {
        name: 'LinkedIn',
        href: 'https://www.linkedin.com/company/xark-technologies/',
        modifier: 'linkedin',
    },
];

const EmailIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
            d="M3.75 6.75h16.5c.41 0 .75.34.75.75v9a.75.75 0 0 1-.75.75H3.75a.75.75 0 0 1-.75-.75v-9c0-.41.34-.75.75-.75Zm0 0 8.25 6 8.25-6"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
        />
    </svg>
);

type ContactFormValues = {
    name: string;
    phone: string;
    companyName: string;
    city: string;
    streetAddress: string;
    postalCode: string;
    country: string;
    interestedProduct: string;
    email: string;
    message: string;
};

const initialFormValues: ContactFormValues = {
    name: '',
    phone: '',
    companyName: '',
    city: '',
    streetAddress: '',
    postalCode: '',
    country: '',
    interestedProduct: '',
    email: '',
    message: '',
};

const ContactSection = () => {
    const [formValues, setFormValues] = useState<ContactFormValues>(initialFormValues);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [submitError, setSubmitError] = useState('');

    const handleFieldChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = event.target;
        const fieldName = name as keyof ContactFormValues;

        setFormValues((current) => ({
            ...current,
            [fieldName]: value,
        }));

        if (submitMessage) {
            setSubmitMessage('');
        }

        if (submitError) {
            setSubmitError('');
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setIsSubmitting(true);
        setSubmitMessage('');
        setSubmitError('');

        try {
            const response = await fetch('/api/contact-submissions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formValues),
            });

            const payload = (await response.json()) as { message?: string };

            if (!response.ok) {
                setSubmitError(payload.message || 'Unable to send your message right now.');
                return;
            }

            setFormValues({ ...initialFormValues });
            setSubmitMessage(payload.message || 'Message submitted successfully.');
        } catch {
            setSubmitError('Unable to send your message right now.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="contact-section-container flex items-center justify-center">
            <div className="contact-section container">
                <div className="contact-section__left contact-info-section">
                    <div className="contact-section__title">
                        <SectionHeader
                            alignment="left"
                            title={
                                <>
                                    Start the <span>Conversation</span>
                                </>
                            }
                            description="For design services, partnerships, or general inquiries, reach us here. We’ll route you to the right team."
                        />
                    </div>

                    <div className="contact-section__email-row">
                        <div className="contact-section__email-icon">
                            <EmailIcon />
                        </div>
                        <div className="contact-section__email-groups">
                            <div className="contact-section__email-item">
                                <p className="contact-section__email-label">Business and Partnership</p>
                                <a href="mailto:growth@xark.info" className="contact-section__email-value">
                                    growth@xark.info
                                </a>
                            </div>
                            <div className="contact-section__email-item">
                                <p className="contact-section__email-label">Design Services</p>
                                <a href="mailto:engineering@xark.info" className="contact-section__email-value">
                                    engineering@xark.info
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="contact-info-container">
                        {addressBlocks.map((block) => (
                            <div className="contact-item" key={block.title}>
                                <span
                                    className={`contact-item__icon contact-item__icon--${block.icon}`}
                                    aria-hidden="true"
                                />

                                <div className="contact-item__info">
                                    <h4>{block.title}</h4>
                                    {block.lines.map((line) => (
                                        <p key={line}>{line}</p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="contact-section__socials">
                        {socialLinks.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                aria-label={item.name}
                                className={`social-link social-link--${item.modifier}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <span
                                    className={`social-link__icon social-link__icon--${item.modifier}`}
                                    aria-hidden="true"
                                />
                            </a>
                        ))}
                    </div>
                </div>

                <div className="contact-section__right contact-form-section">
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="contact-form__row contact-form__row--two">
                            <label className="contact-form__field">
                                <span>Name</span>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your full name"
                                    autoComplete="name"
                                    required
                                    value={formValues.name}
                                    onChange={handleFieldChange}
                                />
                            </label>
                            <label className="contact-form__field">
                                <span>Phone</span>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Enter your phone number"
                                    autoComplete="tel"
                                    value={formValues.phone}
                                    onChange={handleFieldChange}
                                />
                            </label>
                        </div>

                        <div className="contact-form__row contact-form__row--two">
                            <label className="contact-form__field">
                                <span>Company Name</span>
                                <input
                                    type="text"
                                    name="companyName"
                                    placeholder="Enter your company name"
                                    autoComplete="organization"
                                    value={formValues.companyName}
                                    onChange={handleFieldChange}
                                />
                            </label>
                            <label className="contact-form__field">
                                <span>City</span>
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="Enter your city"
                                    autoComplete="address-level2"
                                    value={formValues.city}
                                    onChange={handleFieldChange}
                                />
                            </label>
                        </div>

                        <div className="contact-form__row">
                            <label className="contact-form__field">
                                <span>Street Address</span>
                                <input
                                    type="text"
                                    name="streetAddress"
                                    placeholder="Enter street address"
                                    autoComplete="street-address"
                                    value={formValues.streetAddress}
                                    onChange={handleFieldChange}
                                />
                            </label>
                        </div>

                        <div className="contact-form__row contact-form__row--two">
                            <label className="contact-form__field">
                                <span>Postal Code</span>
                                <input
                                    type="text"
                                    name="postalCode"
                                    placeholder="Enter your postal code"
                                    autoComplete="postal-code"
                                    value={formValues.postalCode}
                                    onChange={handleFieldChange}
                                />
                            </label>
                            <label className="contact-form__field">
                                <span>Country</span>
                                <input
                                    type="text"
                                    name="country"
                                    placeholder="Enter your country"
                                    autoComplete="country-name"
                                    value={formValues.country}
                                    onChange={handleFieldChange}
                                />
                            </label>
                        </div>

                        <div className="contact-form__row">
                            <label className="contact-form__field">
                                <span>Interested Product</span>
                                <input
                                    type="text"
                                    name="interestedProduct"
                                    placeholder="Mention the product or category"
                                    value={formValues.interestedProduct}
                                    onChange={handleFieldChange}
                                />
                            </label>
                        </div>

                        <div className="contact-form__row">
                            <label className="contact-form__field">
                                <span>Email</span>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                    required
                                    value={formValues.email}
                                    onChange={handleFieldChange}
                                />
                            </label>
                        </div>

                        <div className="contact-form__row">
                            <label className="contact-form__field">
                                <span>Message</span>
                                <textarea
                                    name="message"
                                    placeholder="Tell us what you are building or what support you need"
                                    required
                                    value={formValues.message}
                                    onChange={handleFieldChange}
                                />
                            </label>
                        </div>

                        <div className="contact-form__footer">
                            <button type="submit" className="contact-form__submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Sending...' : 'Send'}
                            </button>

                            <p className="contact-form__meta">Required fields: Name, Email, Message</p>
                        </div>

                        {(submitMessage || submitError) && (
                            <p
                                className={`contact-form__status${
                                    submitError ? ' contact-form__status--error' : ' contact-form__status--success'
                                }`}
                                role="status"
                                aria-live="polite"
                            >
                                {submitError || submitMessage}
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
