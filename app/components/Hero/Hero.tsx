'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import ArrowButton from '../ui/ArrowButton/ArrowButton';
import { hasRecentSiteAccessClientGrant } from '@/lib/siteAccess';
import './style.scss';

const HERO_VIDEO_SOURCES = {
    mp4: '/video/xark-final-2.mp4',
    webm: '/video/xark-final-2.webm',
} as const;
const HERO_COPY_HIDE_START = 26.5;
const HERO_COPY_HIDE_END = 31;

const Hero = () => {
    const heroRef = useRef<HTMLElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isMuted, setIsMuted] = useState(true);
    const [hasVideoError, setHasVideoError] = useState(false);
    const [videoSource, setVideoSource] = useState<string | null>(null);
    const [isHeroCopyHidden, setIsHeroCopyHidden] = useState(false);
    const [hasSiteAccess, setHasSiteAccess] = useState(false);
    const [isHeroInView, setIsHeroInView] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const pickVideoSource = async () => {
            const probe = document.createElement('video');
            const candidates = [
                {
                    src: HERO_VIDEO_SOURCES.mp4,
                    type: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
                },
                {
                    src: HERO_VIDEO_SOURCES.webm,
                    type: 'video/webm; codecs="vp8, vorbis"',
                },
            ];

            for (const candidate of candidates) {
                if (!probe.canPlayType(candidate.type)) {
                    continue;
                }

                try {
                    const response = await fetch(candidate.src, {
                        method: 'HEAD',
                        cache: 'no-store',
                    });

                    if (response.ok) {
                        if (isMounted) {
                            setVideoSource(candidate.src);
                        }
                        return;
                    }
                } catch {}
            }

            if (isMounted) {
                setHasVideoError(true);
            }
        };

        pickVideoSource();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const syncSiteAccess = () => {
            setHasSiteAccess(hasRecentSiteAccessClientGrant());
        };

        syncSiteAccess();
        window.addEventListener('xark:site-access-granted', syncSiteAccess);

        return () => {
            window.removeEventListener('xark:site-access-granted', syncSiteAccess);
        };
    }, []);

    useEffect(() => {
        const hero = heroRef.current;
        if (!hero || typeof IntersectionObserver === 'undefined') {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsHeroInView(entry.isIntersecting && entry.intersectionRatio > 0.28);
            },
            {
                threshold: [0, 0.28, 0.45],
            },
        );

        observer.observe(hero);

        return () => {
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        if (hasVideoError || !videoSource) {
            setIsHeroCopyHidden(false);
        }
    }, [hasVideoError, videoSource]);

    useEffect(() => {
        const video = videoRef.current;

        if (!video || hasVideoError || !videoSource) {
            return;
        }

        if (!hasSiteAccess || !isHeroInView) {
            video.pause();
            return;
        }

        video.play().catch(() => {});
    }, [hasSiteAccess, hasVideoError, isHeroInView, videoSource]);

    const handleToggleMute = () => {
        setIsMuted((current) => {
            const nextMuted = !current;

            if (videoRef.current) {
                videoRef.current.muted = nextMuted;
                if (!nextMuted) {
                    videoRef.current.play().catch(() => {});
                }
            }

            return nextMuted;
        });
    };

    const handleVideoError = () => {
        if (videoSource === HERO_VIDEO_SOURCES.mp4) {
            setVideoSource(HERO_VIDEO_SOURCES.webm);
            return;
        }

        setHasVideoError(true);
    };

    const syncHeroCopyVisibility = () => {
        const video = videoRef.current;

        if (!video) {
            setIsHeroCopyHidden(false);
            return;
        }

        if (window.innerWidth <= 768) {
            setIsHeroCopyHidden(false);
            return;
        }

        const currentTime = video.currentTime || 0;
        const hideEndTime =
            Number.isFinite(video.duration) && video.duration > 0
                ? Math.min(HERO_COPY_HIDE_END, video.duration)
                : HERO_COPY_HIDE_END;
        const shouldHideCopy =
            currentTime >= HERO_COPY_HIDE_START &&
            currentTime < hideEndTime;

        setIsHeroCopyHidden(shouldHideCopy);
    };

    return (
        <section className="hero" ref={heroRef}>
            <div className="hero__bg">
                {hasVideoError || !videoSource ? (
                    <Image
                        src="/images/hero-fall-back-image.png"
                        alt="Hero background"
                        fill
                        priority
                        quality={95}
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                    />
                ) : (
                    <video
                        key={videoSource}
                        ref={videoRef}
                        className="hero__video"
                        loop
                        muted={isMuted}
                        playsInline
                        preload="auto"
                        defaultMuted
                        poster="/images/hero-fall-back-image.png"
                        disablePictureInPicture
                        onTimeUpdate={syncHeroCopyVisibility}
                        onLoadedMetadata={syncHeroCopyVisibility}
                        onSeeked={syncHeroCopyVisibility}
                        onError={handleVideoError}
                    >
                        <source
                            src={videoSource}
                            type={videoSource.endsWith('.mp4') ? 'video/mp4' : 'video/webm'}
                        />
                    </video>
                )}

                <div className="hero__gradient" />

                <button
                    type="button"
                    className="hero__sound-toggle"
                    onClick={handleToggleMute}
                    aria-pressed={!isMuted}
                    aria-label={isMuted ? 'Unmute hero video' : 'Mute hero video'}
                >
                    <span className="hero__sound-toggle-icon" aria-hidden="true">
                        {isMuted ? (
                            <svg viewBox="0 0 24 24" focusable="false">
                                <path
                                    d="M5 10h3l4-4v12l-4-4H5zM16 9l5 5M21 9l-5 5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.8"
                                />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" focusable="false">
                                <path
                                    d="M5 10h3l4-4v12l-4-4H5zM16 9.5a4.5 4.5 0 0 1 0 5M18.8 7a8 8 0 0 1 0 10"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.8"
                                />
                            </svg>
                        )}
                    </span>
                    <span className="hero__sound-toggle-label">{isMuted ? 'Muted' : 'Sound On'}</span>
                </button>
            </div>

            <div className="hero__inner container h-full w-full relative z-10 flex items-end">
                <div className="hero__content w-full flex flex-col xl:flex-row xl:items-end justify-between gap-10">
                    <div className="hero__text">
                        <div className={`hero__copy${isHeroCopyHidden ? ' hero__copy--hidden' : ''}`}>
                            <h1 className="hero__title">
                                GaN RF design for radar, SatCom, and telecom infrastructure.
                            </h1>
                            <p className="hero__subtext">
                                From MMICs to phased arrays-engineered for performance, scalability, and
                                reliability.
                            </p>
                        </div>
                    </div>

                    <div className="hero__buttons">
                        <ArrowButton label="Explore Products" variant="outline" href="/products" />
                        <ArrowButton label="Contact us" variant="filled" href="/contact" />
                    </div>
                </div>
            </div>

        </section>
    );
};

export default Hero;
