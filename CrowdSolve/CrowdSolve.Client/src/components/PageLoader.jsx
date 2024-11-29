"use client"

import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import animationData from '@/assets/CrowdSolveLoading.json';

const PageLoader = ({ progress }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="z-[100000] backdrop-blur-md backdrop-saturate-150 bg-background/70 w-screen h-screen fixed inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="flex flex-col w-screen h-[100dvh] fixed inset-0 z-[100000] overflow-x-auto justify-center items-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <motion.div
            className="flex flex-col items-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Lottie animationData={animationData} loop={true} style={{ width: '80px', height: '80px' }} />
            <motion.div
              className="mt-6 w-64 text-center"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
            <p className="text-lg font-medium text-foreground mb-2">Cargando...</p>
            {progress !== undefined && (
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-secondary">
                    <motion.div
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <p className="text-md text-muted-foreground text-center">{progress}%</p>
                </div>
            )}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default PageLoader;