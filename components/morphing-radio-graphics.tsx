'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useId } from 'react';

type MorphTone = 'sage' | 'cream' | 'forest';

const liquidPaths = [
  'M0 186 C118 54 230 48 340 137 C454 229 558 42 688 91 C817 140 914 270 1044 135 C1125 51 1188 67 1200 82 L1200 400 L0 400 Z',
  'M0 116 C124 228 240 198 350 99 C470 8 575 205 699 169 C823 133 920 21 1042 116 C1129 183 1180 163 1200 143 L1200 400 L0 400 Z',
  'M0 211 C112 130 226 14 351 111 C463 198 582 243 702 126 C824 8 935 181 1048 204 C1132 221 1182 149 1200 109 L1200 400 L0 400 Z',
  'M0 186 C118 54 230 48 340 137 C454 229 558 42 688 91 C817 140 914 270 1044 135 C1125 51 1188 67 1200 82 L1200 400 L0 400 Z',
];

const tones: Record<MorphTone, { first: string; second: string; glow: string }> = {
  sage: { first: '#b6ff3b', second: '#46913a', glow: '#4f9d3a' },
  cream: { first: '#edf7ff', second: '#9de96d', glow: '#76bf53' },
  forest: { first: '#151b2a', second: '#3f8335', glow: '#b6ff3b' },
};

export function LiquidMorph({ tone = 'sage', className = '' }: { tone?: MorphTone; className?: string }) {
  const reducedMotion = useReducedMotion();
  const id = useId().replace(/:/g, '');
  const palette = tones[tone];

  return (
    <div className={`liquid-morph ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1200 400" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`liquid-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={palette.first} stopOpacity=".7" />
            <stop offset=".56" stopColor={palette.second} stopOpacity=".48" />
            <stop offset="1" stopColor={palette.glow} stopOpacity=".22" />
          </linearGradient>
          <filter id={`blur-${id}`} x="-20%" y="-40%" width="140%" height="180%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
        </defs>
        <motion.path
          d={liquidPaths[0]}
          animate={reducedMotion ? undefined : { d: liquidPaths }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          fill={`url(#liquid-${id})`}
          filter={`url(#blur-${id})`}
        />
        <motion.path
          d={liquidPaths[1]}
          animate={reducedMotion ? undefined : { d: [...liquidPaths].reverse() }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          fill="none"
          stroke={palette.second}
          strokeOpacity=".25"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}


const signalPaths = [
  'M4 29 C12 7 25 7 34 29 C44 52 57 52 68 29 C80 5 94 7 104 29 C114 50 127 50 140 29 C152 9 166 8 176 29',
  'M4 29 C15 49 27 49 38 29 C50 8 62 8 73 29 C85 50 98 50 109 29 C121 8 135 8 145 29 C156 48 167 47 176 29',
  'M4 29 C14 17 26 18 36 29 C48 41 60 43 72 29 C85 13 98 13 111 29 C124 44 138 44 149 29 C160 15 169 17 176 29',
  'M4 29 C12 7 25 7 34 29 C44 52 57 52 68 29 C80 5 94 7 104 29 C114 50 127 50 140 29 C152 9 166 8 176 29',
];

export function MorphingSignal() {
  const reducedMotion = useReducedMotion();
  return (
    <svg className="morphing-signal" viewBox="0 0 180 58" preserveAspectRatio="none" aria-hidden="true">
      <motion.path
        d={signalPaths[0]}
        animate={reducedMotion ? undefined : { d: signalPaths }}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
