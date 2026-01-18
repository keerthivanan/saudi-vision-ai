'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register standard plugins
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export interface SplitTextProps {
    text: string;
    className?: string;
    delay?: number;
    duration?: number;
    ease?: string | ((t: number) => number);
    splitType?: 'chars' | 'words' | 'lines' | 'words, chars'; // Mapped to logic
    from?: gsap.TweenVars; // standard gsap from vars
    to?: gsap.TweenVars; // standard gsap to vars
    threshold?: number;
    rootMargin?: string;
    tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
    textAlign?: React.CSSProperties['textAlign'];
    onLetterAnimationComplete?: () => void;
}

export default function SplitText({
    text,
    className = '',
    delay = 0,
    duration = 0.5,
    ease = 'power3.out',
    splitType = 'chars',
    from = { opacity: 0, y: 40 },
    to = { opacity: 1, y: 0 },
    threshold = 0.1,
    rootMargin = '-50px',
    tag: Tag = 'div',
    textAlign = 'left',
    onLetterAnimationComplete,
}: SplitTextProps) {
    const containerRef = useRef<any>(null);
    const [inView, setInView] = useState(false);

    // 1. Split Logic (Manual, replacing the need for the paid plugin)
    const words = useMemo(() => text.split(' '), [text]);

    // Flatten into chars if needed
    // This simplistic approach handles "words" or "chars". "lines" is hard in raw CSS/React without measurement.
    // We'll focus on "chars" as requested in the prompts.

    useGSAP(() => {
        if (!inView) return;

        const elements = gsap.utils.toArray('.split-char');
        const computedDelay = delay / 1000; // Convert to seconds

        gsap.fromTo(
            elements,
            { ...from },
            {
                ...to,
                duration: duration,
                ease: ease,
                stagger: 0.02, // Stagger letter by letter
                delay: computedDelay,
                onComplete: () => {
                    if (onLetterAnimationComplete) onLetterAnimationComplete();
                }
            }
        );
    }, { dependencies: [inView, text], scope: containerRef });

    // Intersection Observer for triggering
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry && entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect(); // Trigger once
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold, rootMargin]);

    // Render Helpers
    const renderChars = () => {
        return words.map((word, wIndex) => {
            const chars = word.split('');
            return (
                <span key={wIndex} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                    {chars.map((char, cIndex) => (
                        <span
                            key={cIndex}
                            className="split-char inline-block"
                            style={{ display: 'inline-block' }}
                        >
                            {char}
                        </span>
                    ))}
                    {wIndex < words.length - 1 && (
                        <span className="split-char inline-block" style={{ display: 'inline-block' }}>&nbsp;</span>
                    )}
                </span>
            );
        });
    };

    return (
        <Tag
            ref={containerRef}
            className={className}
            style={{ textAlign, opacity: inView ? 1 : 0 }} // Prevent FOUC, layout stable
        >
            {/* If not in view yet, we keep invisible but layout present */}
            <span style={{ opacity: 1 }}>
                {renderChars()}
            </span>
        </Tag>
    );
};


