'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import './style.scss';

const MAX_WAIT_MS = 7000;
const MIN_SHOW_MS = 900;

const PagePreloader = () => {
    const [isVisible, setIsVisible] = useState(true);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const logoWrapRef = useRef<HTMLDivElement | null>(null);
    const sweepRef = useRef<HTMLDivElement | null>(null);
    const shouldRender = typeof window === 'undefined' || isVisible;

    useEffect(() => {
        const root = rootRef.current;
        const logoWrap = logoWrapRef.current;
        const sweep = sweepRef.current;

        if (!root || !logoWrap || !sweep) {
            return;
        }

        const startAt = performance.now();
        let hasClosed = false;
        let isPageReady = false;
        let isSweepComplete = false;
        let safetyTimer: ReturnType<typeof setTimeout> | null = null;
        let closeDelayCall: gsap.core.Tween | null = null;

        document.body.style.overflow = 'hidden';
        gsap.set(root, { autoAlpha: 1 });
        gsap.set(logoWrap, { autoAlpha: 1, scale: 1 });
        gsap.set(sweep, { clipPath: 'inset(0 101% 0 0)' });

        const closePreloader = () => {
            const elapsed = performance.now() - startAt;
            const delaySeconds = Math.max(0, MIN_SHOW_MS - elapsed) / 1000;

            closeDelayCall = gsap.delayedCall(delaySeconds, () => {
                gsap.timeline({
                    onComplete: () => {
                        (window as Window & { __xarkPreloaderComplete?: boolean }).__xarkPreloaderComplete = true;
                        window.dispatchEvent(new CustomEvent('xark:preloader-complete'));
                        document.body.style.overflow = '';
                        setIsVisible(false);
                    },
                })
                    .to(logoWrap, {
                        autoAlpha: 0,
                        scale: 0.94,
                        filter: 'blur(5px)',
                        duration: 0.45,
                        ease: 'power3.inOut',
                    })
                    .to(
                        root,
                        {
                            autoAlpha: 0,
                            duration: 0.55,
                            ease: 'power2.inOut',
                        },
                        0.14
                    );
            });
        };

        const maybeClosePreloader = () => {
            if (hasClosed || !isPageReady || !isSweepComplete) {
                return;
            }

            hasClosed = true;
            closePreloader();
        };

        const sweepTween = gsap.to(sweep, {
            clipPath: 'inset(0 -1% 0 0)',
            duration: 1.2,
            ease: 'power2.inOut',
            onComplete: () => {
                isSweepComplete = true;
                maybeClosePreloader();
            },
        });

        const onWindowLoad = () => {
            isPageReady = true;
            maybeClosePreloader();
        };

        if (document.readyState === 'complete') {
            isPageReady = true;
            maybeClosePreloader();
        } else {
            window.addEventListener('load', onWindowLoad, { once: true });
            safetyTimer = setTimeout(() => {
                isPageReady = true;
                maybeClosePreloader();
            }, MAX_WAIT_MS);
        }

        return () => {
            window.removeEventListener('load', onWindowLoad);
            if (safetyTimer) {
                clearTimeout(safetyTimer);
            }
            sweepTween.kill();
            closeDelayCall?.kill();
            document.body.style.overflow = '';
        };
    }, []);

    if (!shouldRender) {
        return null;
    }

    return (
        <div className="page-preloader" ref={rootRef} aria-hidden="true">
            <div className="page-preloader__logo-wrap" ref={logoWrapRef}>
                <div className="page-preloader__logo page-preloader__logo--base">
                    <Image
                        src="/images/xark-green.png"
                        alt=""
                        width={381}
                        height={69}
                        priority
                        aria-hidden="true"
                    />
                </div>
                <div className="page-preloader__logo page-preloader__logo--sweep" ref={sweepRef}>
                    <Image
                        src="/images/xark-green.png"
                        alt=""
                        width={381}
                        height={69}
                        priority
                        aria-hidden="true"
                    />
                </div>
            </div>
        </div>
    );
};

export default PagePreloader;
