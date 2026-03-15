'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import './style.scss';

type RouteTransitionProps = {
    children: React.ReactNode;
};

const RouteTransition = ({ children }: RouteTransitionProps) => {
    const pathname = usePathname();
    const isFirstRenderRef = useRef(true);
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const logoWrapRef = useRef<HTMLDivElement | null>(null);
    const logoSweepRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const overlay = overlayRef.current;
        const logoWrap = logoWrapRef.current;
        const logoSweep = logoSweepRef.current;
        const content = contentRef.current;

        if (!overlay || !logoWrap || !logoSweep || !content) {
            return;
        }

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        gsap.killTweensOf([overlay, logoWrap, logoSweep, content]);

        if (isFirstRenderRef.current) {
            isFirstRenderRef.current = false;
            gsap.set(overlay, { autoAlpha: 0, pointerEvents: 'none' });
            gsap.set(content, { autoAlpha: 1, y: 0, filter: 'blur(0px)' });
            return;
        }

        if (reduceMotion) {
            gsap.set(overlay, { autoAlpha: 0, pointerEvents: 'none' });
            gsap.fromTo(
                content,
                { autoAlpha: 0, y: 12 },
                { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' }
            );
            return;
        }

        const timeline = gsap.timeline();

        timeline
            .set(overlay, { autoAlpha: 1, pointerEvents: 'auto' })
            .set(content, { autoAlpha: 0, y: 18, filter: 'blur(8px)' }, 0)
            .fromTo(
                logoWrap,
                { autoAlpha: 0, scale: 0.88, y: 10 },
                { autoAlpha: 1, scale: 1, y: 0, duration: 0.42, ease: 'power3.out' },
                0.04
            )
            .fromTo(
                logoSweep,
                { clipPath: 'inset(0 100% 0 0)' },
                { clipPath: 'inset(0 0% 0 0)', duration: 0.45, ease: 'power2.inOut' },
                0.08
            )
            .to(
                logoSweep,
                { clipPath: 'inset(0 0 0 100%)', duration: 0.4, ease: 'power2.inOut' },
                0.56
            )
            .to(
                logoWrap,
                { autoAlpha: 0, scale: 1.06, duration: 0.34, ease: 'power3.inOut' },
                0.76
            )
            .to(
                content,
                { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.62, ease: 'power3.out' },
                0.72
            )
            .to(
                overlay,
                { autoAlpha: 0, pointerEvents: 'none', duration: 0.5, ease: 'power2.inOut' },
                0.78
            );

        return () => {
            timeline.kill();
        };
    }, [pathname]);

    return (
        <>
            <div className="route-transition-overlay" ref={overlayRef} aria-hidden="true">
                <div className="route-transition-logo-wrap" ref={logoWrapRef}>
                    <div className="route-transition-logo route-transition-logo--base">
                        <Image src="/images/xark-green.png" alt="" width={240} height={72} priority aria-hidden="true" />
                    </div>
                    <div className="route-transition-logo route-transition-logo--sweep" ref={logoSweepRef}>
                        <Image src="/images/xark-green.png" alt="" width={240} height={72} priority aria-hidden="true" />
                    </div>
                </div>
            </div>
            <div className="route-transition-content" ref={contentRef}>
                {children}
            </div>
        </>
    );
};

export default RouteTransition;

