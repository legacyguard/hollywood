import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon-library';
import { SerenityMilestone } from '@/lib/path-of-serenity';

interface MilestoneCelebrationProps {
  milestone: SerenityMilestone | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MilestoneCelebration: React.FC<MilestoneCelebrationProps> = ({
  milestone,
  isOpen,
  onClose
}) => {
  if (!milestone) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative max-w-lg w-full"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Celebration sparkles background */}
            <div className="absolute -inset-8 pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200/50 shadow-2xl">
              <CardContent className="p-8 text-center space-y-6">
                {/* Milestone Icon with Glow */}
                <div className="relative">
                  <motion.div
                    className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-400 to-emerald-500 border-4 border-green-300 shadow-lg flex items-center justify-center relative"
                    animate={{
                      boxShadow: [
                        "0 0 20px rgba(34, 197, 94, 0.3)",
                        "0 0 40px rgba(34, 197, 94, 0.6)",
                        "0 0 20px rgba(34, 197, 94, 0.3)"
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Icon name={milestone.icon as never} className="w-12 h-12 text-white" />
                    
                    {/* Pulsing ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-4 border-green-300"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.6, 0.1, 0.6]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                </div>

                {/* Celebration Text */}
                <div className="space-y-3">
                  <motion.h1
                    className="text-3xl font-bold text-green-900 dark:text-green-100"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Congratulations!
                  </motion.h1>
                  
                  <motion.p
                    className="text-lg text-green-800 dark:text-green-200 font-semibold"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    You unlocked a new Milestone of Peace:
                  </motion.p>
                  
                  <motion.h2
                    className="text-2xl font-bold text-green-900 dark:text-green-100"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    {milestone.name}
                  </motion.h2>
                  
                  <motion.p
                    className="text-green-700 dark:text-green-300 leading-relaxed max-w-md mx-auto"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    {milestone.completedDescription}
                  </motion.p>
                </div>

                {/* Reward Section */}
                {milestone.rewards && (
                  <motion.div
                    className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center justify-center gap-2">
                      <Icon name="gift" className="w-5 h-5" />
                      {milestone.rewards.title}
                    </h3>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {milestone.rewards.description}
                    </p>
                  </motion.div>
                )}

                {/* Continue Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Button
                    onClick={onClose}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold shadow-lg"
                  >
                    <Icon name="arrow-right" className="w-5 h-5 mr-2" />
                    Continue on Your Path
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};