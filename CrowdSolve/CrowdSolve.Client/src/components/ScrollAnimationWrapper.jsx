'use client'

import { motion } from 'framer-motion';

const ScrollAnimationWrapper = ({ children }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollAnimationWrapper;