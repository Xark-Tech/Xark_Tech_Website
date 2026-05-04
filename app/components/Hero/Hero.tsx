'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import ArrowButton from '../ui/ArrowButton/ArrowButton';
import './style.scss';

const HERO_VIDEO_SOURCES = {
    mp4: '/video/video-new-compressed.mp4',
    webm: '/video/video-new.webm',
} as const;
const HERO_COPY_HIDE_START = 26.5;
const HERO_COPY_HIDE_END = 31;

type XarkWindow = Window & { __xarkPreloaderComplete?: boolean };

const Hero = () => {
    const heroRef = useRef<HTMLElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isMuted, setIsMuted] = useState(true);
    const [hasVideoError, setHasVideoError] = useState(false);
    const [videoSource, setVideoSource] = useState<string | null>(null);
    const [isHeroCopyHidden, setIsHeroCopyHidden] = useState(false);

    // Pick the best supported video format once on mount
    useEffect(() => {
        let isMounted = true;
        const probe = document.createElement('video');

        const src =
            probe.canPlayType('video/mp4') !== ''
                ? HERO_VIDEO_SOURCES.mp4
                : probe.canPlayType('video/webm') !== ''
                  ? HERO_VIDEO_SOURCES.webm
                  : null;

        if (isMounted) {
            if (src) {
                setVideoSource(src);
            } else {
                setHasVideoError(true);
            }
        }

        return () => {
            isMounted = false;
        };
    }, []);

    // Imperatively set muted on the DOM node (React's `muted` prop is broken
    // in many versions and the browser won't autoplay un-muted video).
    // Also directly wire up play() once the preloader signals it's done.
    useEffect(() => {
        const video = videoRef.current;
        if (!video || hasVideoError || !videoSource) return;

        // Ensure the video is truly muted at the DOM level so autoplay is allowed
        video.muted = true;

        const tryPlay = () => {
            if (!videoRef.current) return;
            videoRef.current.muted = true; // re-assert in case browser reset it
            videoRef.current.play().catch(() => {});
        };

        // If the preloader already finished (e.g. navigating back to home),
        // start playing immediately.
        if ((window as XarkWindow).__xarkPreloaderComplete) {
            tryPlay();
            return;
        }

        // Otherwise wait for the preloader to finish, then play.
        window.addEventListener('xark:preloader-complete', tryPlay, { once: true });

        return () => {
            window.removeEventListener('xark:preloader-complete', tryPlay);
        };
    }, [hasVideoError, videoSource]);

    // Pause when scrolled out of view; resume when back in view
    useEffect(() => {
        const hero = heroRef.current;
        if (!hero || typeof IntersectionObserver === 'undefined') return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const video = videoRef.current;
                if (!video) return;
                if (entry.isIntersecting && entry.intersectionRatio > 0.28) {
                    video.play().catch(() => {});
                } else {
                    video.pause();
                }
            },
            { threshold: [0, 0.28, 0.45] },
        );

        observer.observe(hero);
        return () => observer.disconnect();
    }, []);

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

        setIsHeroCopyHidden(currentTime >= HERO_COPY_HIDE_START && currentTime < hideEndTime);
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
                        autoPlay
                        playsInline
                        preload="auto"
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
                                RF Semiconductor Design For Radar.
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
