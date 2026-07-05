"use client";

import { motion, useReducedMotion } from "framer-motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Stagger offset in seconds */
  delay?: number;
  as?: "div" | "section" | "li" | "header";
};

/**
 * Fade-up reveal with spatial movement (CLAUDE.md: never opacity-only).
 * Falls back to opacity-only under prefers-reduced-motion.
 */
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const reduceMotion = useReducedMotion();
  const Tag = motion[as];

  return (
    <Tag
      className={className}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Tag>
  );
}
