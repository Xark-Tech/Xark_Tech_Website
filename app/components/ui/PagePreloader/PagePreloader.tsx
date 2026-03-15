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
        let safetyTimer: ReturnType<typeof setTimeout> | null = null;

        document.body.style.overflow = 'hidden';
        gsap.set(root, { autoAlpha: 1 });
        gsap.set(logoWrap, { autoAlpha: 1, scale: 1 });
        gsap.set(sweep, { clipPath: 'inset(0 100% 0 0)' });

        const sweepTween = gsap.to(sweep, {
            clipPath: 'inset(0 0% 0 0)',
            duration: 1.25,
            ease: 'power2.inOut',
            repeat: -1,
            yoyo: true,
        });

        const closePreloader = () => {
            if (hasClosed) {
                return;
            }

            hasClosed = true;

            const elapsed = performance.now() - startAt;
            const delaySeconds = Math.max(0, MIN_SHOW_MS - elapsed) / 1000;

            gsap.delayedCall(delaySeconds, () => {
                sweepTween.kill();

                gsap.timeline({
                    onComplete: () => {
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

        const onWindowLoad = () => closePreloader();

        if (document.readyState === 'complete') {
            closePreloader();
        } else {
            window.addEventListener('load', onWindowLoad, { once: true });
            safetyTimer = setTimeout(closePreloader, MAX_WAIT_MS);
        }

        return () => {
            window.removeEventListener('load', onWindowLoad);
            if (safetyTimer) {
                clearTimeout(safetyTimer);
            }
            sweepTween.kill();
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
                        width={260}
                        height={78}
                        priority
                        aria-hidden="true"
                    />
                </div>
                <div className="page-preloader__logo page-preloader__logo--sweep" ref={sweepRef}>
                    <Image
                        src="/images/xark-green.png"
                        alt=""
                        width={260}
                        height={78}
                        priority
                        aria-hidden="true"
                    />
                </div>
            </div>
        </div>
    );
};

export default PagePreloader;
