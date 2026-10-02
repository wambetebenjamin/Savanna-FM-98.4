'use client';

import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

export function CinematicMotionLayer() {
  const reducedMotion = useReducedMotion();
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const ribbonForward = useTransform(scrollYProgress, [0, 1], ['4%', '-42%']);
  const orbShift = useTransform(scrollYProgress, [0, 1], ['0vh', '34vh']);
  const orbReverse = useTransform(scrollYProgress, [0, 1], ['18vh', '-22vh']);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), reducedMotion ? 120 : 900);
    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    const selector = '.button, .header-live, .text-link, .rail-controls button, .episode-card__play, .event-card__ticket, .player-main-button, .player-request';
    const controls = Array.from(document.querySelectorAll<HTMLElement>(selector));
    const cleanups = controls.map((control) => {
      const move = (event: PointerEvent) => {
        const bounds = control.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - .5;
        const y = (event.clientY - bounds.top) / bounds.height - .5;
        control.style.setProperty('--magnetic-x', `${x * 7}px`);
        control.style.setProperty('--magnetic-y', `${y * 6}px`);
        control.style.setProperty('--pointer-x', `${(x + .5) * 100}%`);
        control.style.setProperty('--pointer-y', `${(y + .5) * 100}%`);
      };
      const leave = () => {
        control.style.setProperty('--magnetic-x', '0px');
        control.style.setProperty('--magnetic-y', '0px');
      };
      control.addEventListener('pointermove', move);
      control.addEventListener('pointerleave', leave);
      return () => {
        control.removeEventListener('pointermove', move);
        control.removeEventListener('pointerleave', leave);
      };
    });
    return () => cleanups.forEach((cleanup) => cleanup());
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
          <motion.div className="site-loader" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .32 }}>
            <motion.div className="site-loader__disc" animate={reducedMotion ? undefined : { rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}>
              <span>98.4</span>
            </motion.div>
            <div className="site-loader__copy"><strong>SAVANNA FM</strong><span>Loading the frequency</span></div>
            <motion.i initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: reducedMotion ? .1 : .75, ease: [0.22, 1, 0.36, 1] }} />
          </motion.div>
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
