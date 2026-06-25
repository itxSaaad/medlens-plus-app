"use client";

import { motion, useReducedMotion } from "motion/react";

export function TimelineVisual() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="relative mx-auto w-full max-w-lg rounded-2xl border border-border bg-paper p-6 shadow-sm"
      aria-hidden="true"
      initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
      animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-4 flex items-center justify-between text-xs font-mono text-muted">
        <span>Jan 2024</span>
        <span>Jun 2024</span>
        <span>Jan 2025</span>
        <span>Jun 2025</span>
      </div>
      <div className="relative h-2 rounded-full bg-secondary">
        <div className="absolute inset-y-0 left-0 w-full rounded-full bg-gradient-to-r from-lens/20 via-lens/40 to-lens/20" />
        {[12, 38, 62, 88].map((left, index) => (
          <div
            key={left}
            className={`absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-paper bg-lens shadow-sm ${
              index === 3 && !reduceMotion ? "animate-timeline-pulse" : ""
            }`}
            style={{ left: `${left}%` }}
          >
            <span className="sr-only">Report {index + 1}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border bg-surface p-3">
          <p className="font-mono text-xs text-muted">HbA1c</p>
          <p className="font-mono text-lg font-medium text-ink">6.2%</p>
          <p className="text-xs text-caution">↑ from 5.8%</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-3">
          <p className="font-mono text-xs text-muted">TSH</p>
          <p className="font-mono text-lg font-medium text-ink">2.1 mIU/L</p>
          <p className="text-xs text-success">Within range</p>
        </div>
      </div>
    </motion.div>
  );
}
