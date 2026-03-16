'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
    hasRecentSiteAccessGrant,
    SITE_ACCESS_STORAGE_KEY,
} from '@/lib/siteAccess';
import './style.scss';

const CLOSE_ANIMATION_MS = 420;
const PHONE_COUNTRY_CODES = [
    { value: '+91', flag: '🇮🇳' },
    { value: '+1', flag: '🇺🇸' },
    { value: '+44', flag: '🇬🇧' },
    { value: '+49', flag: '🇩🇪' },
    { value: '+65', flag: '🇸🇬' },
    { value: '+81', flag: '🇯🇵' },
    { value: '+61', flag: '🇦🇺' },
    { value: '+971', flag: '🇦🇪' },
    { value: '+966', flag: '🇸🇦' },
];

type GateValues = {
    name: string;
    email: string;
    phoneCountryCode: string;
    phoneNumber: string;
};

const initialValues: GateValues = {
    name: '',
    email: '',
    phoneCountryCode: '+91',
    phoneNumber: '',
};

type SiteAccessGateProps = {
    initialHasRecentSiteAccess: boolean;
};

const SiteAccessGate = ({ initialHasRecentSiteAccess }: SiteAccessGateProps) => {
    const [isLocked, setIsLocked] = useState(!initialHasRecentSiteAccess);
    const [isClosing, setIsClosing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [values, setValues] = useState<GateValues>(initialValues);
    const closeTimerRef = useRef<number | null>(null);

    useEffect(() => {
        if (initialHasRecentSiteAccess || typeof window === 'undefined') {
            return;
        }

        const rawValue = window.localStorage.getItem(SITE_ACCESS_STORAGE_KEY);
        if (!hasRecentSiteAccessGrant(rawValue)) {
            window.localStorage.removeItem(SITE_ACCESS_STORAGE_KEY);
            return;
        }

        setIsLocked(false);
    }, [initialHasRecentSiteAccess]);

    useEffect(() => {
        document.body.style.overflow = isLocked || isClosing ? 'hidden' : '';

        return () => {
            document.body.style.overflow = '';
        };
    }, [isClosing, isLocked]);

    useEffect(() => {
        return () => {
            if (closeTimerRef.current) {
                window.clearTimeout(closeTimerRef.current);
            }
        };
    }, []);

    const canRender = isLocked || isClosing;
    const helperText = useMemo(
        () => 'Share your details to continue. We only ask again after 3 days.',
        [],
    );
    const selectedPhoneOption =
        PHONE_COUNTRY_CODES.find((option) => option.value === values.phoneCountryCode) || PHONE_COUNTRY_CODES[0];

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        const fieldName = name as keyof GateValues;

        setValues((current) => ({
            ...current,
            [fieldName]: value,
        }));

        if (submitError) {
            setSubmitError('');
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setIsSubmitting(true);
        setSubmitError('');

        try {
            const phoneNumber = values.phoneNumber.trim();
            const formattedPhone = phoneNumber ? `${values.phoneCountryCode} ${phoneNumber}`.trim() : '';

            const response = await fetch('/api/site-access-submissions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: values.name,
                    email: values.email,
                    phone: formattedPhone,
                }),
            });

            const payload = (await response.json()) as { message?: string };

            if (!response.ok) {
                setSubmitError(payload.message || 'Unable to continue right now.');
                return;
            }

            window.localStorage.setItem(SITE_ACCESS_STORAGE_KEY, String(Date.now()));
            setValues({ ...initialValues });
            setIsClosing(true);
            closeTimerRef.current = window.setTimeout(() => {
                setIsClosing(false);
                setIsLocked(false);
            }, CLOSE_ANIMATION_MS);
        } catch {
            setSubmitError('Unable to continue right now.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!canRender) {
        return null;
    }

    return (
        <div
            className={`site-access-gate${isClosing ? ' site-access-gate--closing' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="site-access-title"
        >
            <div className="site-access-gate__backdrop" />
            <div className="site-access-gate__panel">
                <p className="site-access-gate__eyebrow">Welcome to XARK</p>
                <h2 id="site-access-title" className="site-access-gate__title">
                    Access The Site
                </h2>
                <p className="site-access-gate__description">{helperText}</p>

                <form className="site-access-gate__form" onSubmit={handleSubmit}>
                    <label className="site-access-gate__field">
                        <span>Name</span>
                        <input
                            type="text"
                            name="name"
                            autoComplete="name"
                            placeholder="Enter your full name"
                            value={values.name}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label className="site-access-gate__field">
                        <span>Email</span>
                        <input
                            type="email"
                            name="email"
                            autoComplete="email"
                            placeholder="Enter your email"
                            value={values.email}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label className="site-access-gate__field">
                        <span>Phone</span>
                        <div className="site-access-gate__phone-row">
                            <div className="site-access-gate__country-select">
                                <span className="site-access-gate__country-flag" aria-hidden="true">
                                    {selectedPhoneOption.flag}
                                </span>
                                <select
                                    name="phoneCountryCode"
                                    aria-label="Country code"
                                    value={values.phoneCountryCode}
                                    onChange={handleChange}
                                >
                                    {PHONE_COUNTRY_CODES.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.value}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <input
                                type="tel"
                                name="phoneNumber"
                                autoComplete="tel-national"
                                inputMode="tel"
                                placeholder="Enter your phone number"
                                value={values.phoneNumber}
                                onChange={handleChange}
                            />
                        </div>
                    </label>

                    <button
                        type="submit"
                        className="site-access-gate__submit"
                        disabled={isSubmitting || isClosing}
                    >
                        {isSubmitting ? 'Submitting...' : isClosing ? 'Opening Website...' : 'Continue To Website'}
                    </button>

                    {submitError ? (
                        <p className="site-access-gate__status site-access-gate__status--error" role="alert">
                            {submitError}
                        </p>
                    ) : null}
                </form>
            </div>
        </div>
    );
};

export default SiteAccessGate;
