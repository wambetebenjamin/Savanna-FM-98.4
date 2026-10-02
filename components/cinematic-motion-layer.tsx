'use client';

import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

export function CinematicMotionLayer() {
  const reducedMotion = useReducedMotion();
  const [loading, setLoading] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
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
    sections.forEach((section) => section.classList.add('motion-section-ready'));
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
      setTransitioning(true);
      timers.push(window.setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.replaceState(null, '', href);
      }, 240));
      timers.push(window.setTimeout(() => setTransitioning(false), 820));
    };
    document.addEventListener('click', handleAnchor);
    return () => {
      document.removeEventListener('click', handleAnchor);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [reducedMotion]);

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
          <motion.div className="page-transition" initial={{ clipPath: 'circle(0% at 50% 50%)' }} animate={{ clipPath: 'circle(78% at 50% 50%)' }} exit={{ clipPath: 'circle(0% at 50% 50%)' }} transition={{ duration: .38, ease: [0.76, 0, 0.24, 1] }} aria-hidden="true" />
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
