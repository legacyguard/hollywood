'use client';

import { type Variants, motion } from 'framer-motion';
import React from 'react';

interface FadeInProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
}

const fadeInAnimation: Variants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: (custom: { duration: number; delay: number }) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: custom.duration,
      delay: custom.delay,
      ease: 'easeInOut',
    },
  }),
};

export const FadeIn = ({
  children,
  duration = 0.5,
  delay = 0,
  className,
}: FadeInProps) => {
  return (
    <motion.div
      className={className}
      variants={fadeInAnimation}
      initial='initial'
      animate='animate'
      custom={ duration, delay }
    >
      {children}
    </motion.div>
  );
};
