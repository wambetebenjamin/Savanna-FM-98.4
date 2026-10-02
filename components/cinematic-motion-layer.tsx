'use client';

import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

type TransitionName = 'home' | 'shows' | 'presenters' | 'news' | 'podcasts' | 'charts' | 'events' | 'advertise' | 'social' | 'default';

const transitionPresets = {
  home: { initial: { clipPath: 'circle(0% at 50% 50%)' }, animate: { clipPath: 'circle(78% at 50% 50%)' }, exit: { clipPath: 'circle(0% at 50% 50%)' } },
  shows: { initial: { x: '-100%' }, animate: { x: '0%' }, exit: { x: '100%' } },
  presenters: { initial: { clipPath: 'circle(0% at 18% 50%)' }, animate: { clipPath: 'circle(112% at 18% 50%)' }, exit: { clipPath: 'circle(0% at 82% 50%)' } },
  news: { initial: { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }, animate: { clipPath: 'polygon(0 0, 118% 0, 100% 100%, 0 100%)' }, exit: { clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)' } },
  podcasts: { initial: { y: '100%' }, animate: { y: '0%' }, exit: { y: '-100%' } },
  charts: { initial: { opacity: 0, scale: .82, filter: 'blur(22px)' }, animate: { opacity: 1, scale: 1, filter: 'blur(0px)' }, exit: { opacity: 0, scale: 1.12, filter: 'blur(18px)' } },
  events: { initial: { clipPath: 'inset(50% 0 50% 0)' }, animate: { clipPath: 'inset(0% 0 0% 0)' }, exit: { clipPath: 'inset(0 50% 0 50%)' } },
  advertise: { initial: { scaleX: 0, transformOrigin: 'center' }, animate: { scaleX: 1 }, exit: { scaleX: 0, transformOrigin: 'right' } },
  social: { initial: { x: '100%', skewX: '-8deg' }, animate: { x: '0%', skewX: '0deg' }, exit: { x: '-100%', skewX: '8deg' } },
  default: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
} as const;

export function CinematicMotionLayer() {
  const reducedMotion = useReducedMotion();
  const [loading, setLoading] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const [transitionName, setTransitionName] = useState<TransitionName>('default');
  const { scrollYProgress } = useScroll();
  const ribbonForward = useTransform(scrollYProgress, [0, 1], ['4%', '-42%']);
  const orbShift = useTransform(scrollYProgress, [0, 1], ['0vh', '34vh']);
  const orbReverse = useTransform(scrollYProgress, [0, 1], ['18vh', '-22vh']);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), reducedMotion ? 120 : 1150);
    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('.section, .advertise, .newsletter, .frequency-strip'));
    sections.forEach((section, index) => section.classList.add('motion-section-ready', `motion-section-style-${index % 5}`));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('motion-section-visible');
      });
    }, { threshold: .08, rootMargin: '0px 0px -7% 0px' });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const timers: number[] = [];
    const handleAnchor = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;
      event.preventDefault();
      const destination = href.slice(1) as TransitionName;
      setTransitionName(destination in transitionPresets ? destination : 'default');
      setTransitioning(true);
      timers.push(window.setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.replaceState(null, '', href);
      }, 300));
      timers.push(window.setTimeout(() => setTransitioning(false), 880));
    };
    document.addEventListener('click', handleAnchor);
    return () => {
      document.removeEventListener('click', handleAnchor);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [reducedMotion]);

  const activeTransition = transitionPresets[transitionName];

  return (
    <>
      <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
      <div className="motion-background" aria-hidden="true">
        <motion.span className="motion-orb motion-orb--one" style={{ y: orbShift }} />
        <motion.span className="motion-orb motion-orb--two" style={{ y: orbReverse }} />
        <motion.div className="motion-ribbon motion-ribbon--one" style={{ x: ribbonForward }}>SAVANNA&nbsp;&nbsp; SOUND&nbsp;&nbsp; NAIROBI&nbsp;&nbsp; 98.4&nbsp;&nbsp; LIVE</motion.div>
      </div>

      <AnimatePresence>
        {loading && (
          <motion.div className="site-loader" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .45 }}>
            <motion.div className="site-loader__disc" animate={reducedMotion ? undefined : { rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}>
              <span>98.4</span>
            </motion.div>
            <div className="site-loader__copy"><strong>SAVANNA FM</strong><span>Loading the frequency</span></div>
            <motion.i initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: reducedMotion ? .1 : 1, ease: [0.22, 1, 0.36, 1] }} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {transitioning && (
          <motion.div
            key={transitionName}
            className={`page-transition page-transition--${transitionName}`}
            initial={activeTransition.initial}
            animate={activeTransition.animate}
            exit={activeTransition.exit}
            transition={{ duration: .42, ease: [0.76, 0, 0.24, 1] }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </>
  );
}


export function AnimatedFlipbook() {
  const pages = ['98.4 FM', 'ON AIR', 'NAIROBI', 'SOUND'];
  return (
    <div className="animated-flipbook" aria-hidden="true">
      {pages.map((page, index) => <span key={page} style={{ animationDelay: `${index * .72}s` }}>{page}</span>)}
      <small>LIVE EDITION</small>
    </div>
  );
}
