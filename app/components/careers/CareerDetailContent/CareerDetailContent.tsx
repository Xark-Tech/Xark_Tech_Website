'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import { gsap } from 'gsap';
import ArrowButton from '../../ui/ArrowButton/ArrowButton';
import './style.scss';

const MAX_CV_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_CV_FILE_TYPES = new Set([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const formatFileSize = (sizeInBytes: number) => {
    if (sizeInBytes < 1024 * 1024) {
        return `${Math.max(1, Math.round(sizeInBytes / 1024))} KB`;
    }

    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
};

interface CareerDetailContentProps {
    careerId: string;
    title: string;
    experience: string;
    location: string;
    employmentType: string;
    summary: string;
    body: PortableTextBlock[];
    applicationEmail?: string;
}

const portableTextComponents = {
    block: {
        normal: ({ children }: { children?: React.ReactNode }) => <p>{children}</p>,
        h2: ({ children }: { children?: React.ReactNode }) => <p>{children}</p>,
        h3: ({ children }: { children?: React.ReactNode }) => <p>{children}</p>,
    },
    list: {
        bullet: ({ children }: { children?: React.ReactNode }) => <ul>{children}</ul>,
        number: ({ children }: { children?: React.ReactNode }) => <ol>{children}</ol>,
    },
    marks: {
        strong: ({ children }: { children?: React.ReactNode }) => <strong>{children}</strong>,
        em: ({ children }: { children?: React.ReactNode }) => <em>{children}</em>,
    },
};

const CareerDetailContent: React.FC<CareerDetailContentProps> = ({
    careerId,
    title,
    experience,
    location,
    employmentType,
    summary,
    body,
    applicationEmail = 'recruitment@xark.info',
}) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [shouldRenderForm, setShouldRenderForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionState, setSubmissionState] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);
    const [selectedFileName, setSelectedFileName] = useState('');
    const [fileError, setFileError] = useState('');
    const [isDragActive, setIsDragActive] = useState(false);
    const formWrapRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleToggleForm = () => {
        setSubmissionState(null);

        if (!isFormOpen) {
            setShouldRenderForm(true);
            setIsFormOpen(true);
            return;
        }

        setIsFormOpen(false);
    };

    useEffect(() => {
        const wrap = formWrapRef.current;
        if (!wrap || !shouldRenderForm) return;

        gsap.killTweensOf(wrap);

        if (isFormOpen) {
            gsap.set(wrap, { display: 'block', height: 'auto' });
            const nextHeight = wrap.offsetHeight;

            gsap.fromTo(
                wrap,
                { height: 0, autoAlpha: 0, y: -8 },
                {
                    height: nextHeight,
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.45,
                    ease: 'power2.out',
                    onComplete: () => {
                        gsap.set(wrap, { height: 'auto' });
                    },
                },
            );

            gsap.fromTo(
                wrap.querySelectorAll('.career-form-row, .career-form-submit, .career-form-state'),
                { autoAlpha: 0, y: 10 },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.28,
                    stagger: 0.04,
                    ease: 'power2.out',
                    delay: 0.08,
                },
            );

            return;
        }

        gsap.set(wrap, { height: wrap.offsetHeight });
        gsap.to(wrap, {
            height: 0,
            autoAlpha: 0,
            y: -6,
            duration: 0.34,
            ease: 'power2.inOut',
            onComplete: () => {
                setShouldRenderForm(false);
                gsap.set(wrap, { clearProps: 'all' });
            },
        });
    }, [isFormOpen, shouldRenderForm]);

    const applySelectedFile = (file: File | null) => {
        if (!file) {
            setSelectedFileName('');
            setFileError('');
            return;
        }

        if (!ALLOWED_CV_FILE_TYPES.has(file.type)) {
            setSelectedFileName('');
            setFileError('Please upload a PDF, DOC, or DOCX file.');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        if (file.size > MAX_CV_FILE_SIZE) {
            setSelectedFileName('');
            setFileError('CV file is too large. Maximum allowed size is 2MB.');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        setSelectedFileName(`${file.name} (${formatFileSize(file.size)})`);
        setFileError('');
        setSubmissionState(null);
    };

    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        applySelectedFile(event.target.files?.[0] ?? null);
    };

    const handleFileDrop = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setIsDragActive(false);

        const droppedFile = event.dataTransfer.files?.[0] ?? null;
        if (!droppedFile) {
            return;
        }

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(droppedFile);

        if (fileInputRef.current) {
            fileInputRef.current.files = dataTransfer.files;
        }

        applySelectedFile(droppedFile);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        const cvFile = formData.get('cvFile');

        if (!(cvFile instanceof File) || cvFile.size === 0) {
            setSubmissionState({
                type: 'error',
                message: 'Please upload your CV before submitting.',
            });
            return;
        }

        if (!ALLOWED_CV_FILE_TYPES.has(cvFile.type)) {
            setFileError('Please upload a PDF, DOC, or DOCX file.');
            setSubmissionState({
                type: 'error',
                message: 'Please upload a valid CV file.',
            });
            return;
        }

        if (cvFile.size > MAX_CV_FILE_SIZE) {
            setFileError('CV file is too large. Maximum allowed size is 2MB.');
            setSubmissionState({
                type: 'error',
                message: 'Please upload a CV that is 2MB or smaller.',
            });
            return;
        }

        formData.set('careerId', careerId);
        formData.set('careerTitle', title);
        setIsSubmitting(true);
        setSubmissionState(null);
        setFileError('');

        try {
            const response = await fetch('/api/career-applications', {
                method: 'POST',
                body: formData,
            });

            const responseBody = (await response.json()) as { message?: string };

            if (!response.ok) {
                setSubmissionState({
                    type: 'error',
                    message: responseBody.message || 'Submission failed. Please try again.',
                });
                return;
            }

            form.reset();
            setSelectedFileName('');
            setFileError('');
            setSubmissionState({
                type: 'success',
                message: 'Application submitted successfully. Our team will review and contact you.',
            });
        } catch {
            setSubmissionState({
                type: 'error',
                message: 'Network error while submitting your application. Please retry.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="career-detail-page-container">
            <section className="career-detail-section">
                <div className="container">
                    <div className="career-detail-content">
                        <h1>{title}</h1>

                        <div className="career-detail-meta">
                            <p>
                                <strong>Experience:</strong> {experience}
                            </p>
                            <p>
                                <strong>Location:</strong> {location}
                            </p>
                            <p>
                                <strong>Type:</strong> {employmentType}
                            </p>
                            <p>
                                <strong>Summary:</strong> {summary}
                            </p>
                        </div>

                        {body.length > 0 && (
                            <div className="career-detail-block">
                                <div className="career-detail-richtext">
                                    <PortableText value={body} components={portableTextComponents} />
                                </div>
                            </div>
                        )}

                        <div className="career-detail-block career-detail-block--apply">
                            <h2>Apply</h2>
                            <p>
                                Submit your resume through the application form or send it to the
                                specified email in career detail page.
                            </p>

                            <div className="career-detail-apply-btn">
                                <ArrowButton
                                    label={isFormOpen ? 'Close Form' : 'Apply Now'}
                                    variant="filled"
                                    onClick={handleToggleForm}
                                />
                            </div>
                        </div>

                        {shouldRenderForm && (
                            <div ref={formWrapRef} className="career-apply-form-wrap">
                                <form className="career-apply-form" onSubmit={handleSubmit}>
                                    <div className="career-form-row career-form-row--two">
                                        <label className="career-form-field">
                                            <span>Name</span>
                                            <input name="name" type="text" placeholder="Enter your full name" required />
                                        </label>
                                        <label className="career-form-field">
                                            <span>Phone</span>
                                            <input
                                                name="phone"
                                                type="tel"
                                                inputMode="tel"
                                                placeholder="Enter your phone number"
                                                required
                                            />
                                        </label>
                                    </div>

                                    <div className="career-form-row">
                                        <label className="career-form-field">
                                            <span>Email</span>
                                            <input name="email" type="email" placeholder="Enter your email" required />
                                        </label>
                                    </div>

                                    <div className="career-form-row">
                                        <div className="career-form-field">
                                            <span>CV Upload</span>
                                            <label
                                                className={`career-file-dropzone${isDragActive ? ' career-file-dropzone--active' : ''}${fileError ? ' career-file-dropzone--error' : ''}`}
                                                onDragOver={(event) => {
                                                    event.preventDefault();
                                                    setIsDragActive(true);
                                                }}
                                                onDragLeave={(event) => {
                                                    event.preventDefault();
                                                    setIsDragActive(false);
                                                }}
                                                onDrop={handleFileDrop}
                                            >
                                                <input
                                                    ref={fileInputRef}
                                                    name="cvFile"
                                                    type="file"
                                                    accept=".pdf,.doc,.docx"
                                                    className="career-file-input"
                                                    required
                                                    onChange={handleFileInputChange}
                                                />
                                                <span className="career-file-dropzone__title">
                                                    Drag and drop your CV here
                                                </span>
                                                <span className="career-file-dropzone__meta">
                                                    Or click to browse. PDF, DOC, DOCX up to 2MB.
                                                </span>
                                                {selectedFileName ? (
                                                    <span className="career-file-dropzone__file">
                                                        {selectedFileName}
                                                    </span>
                                                ) : null}
                                            </label>
                                            {fileError ? <p className="career-file-error">{fileError}</p> : null}
                                        </div>
                                    </div>

                                    <button type="submit" className="career-form-submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                                    </button>

                                    {submissionState && (
                                        <p
                                            className={`career-form-state ${submissionState.type === 'success'
                                                ? 'career-form-state--success'
                                                : 'career-form-state--error'
                                                }`}
                                        >
                                            {submissionState.message}
                                        </p>
                                    )}
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default CareerDetailContent;
