/**
 * Legacy Garden Visualization Component
 * Interactive garden that grows with user progress and family protection milestones
 */

import { useEffect, useState } from 'react';
import { Sparkles, Sun, Cloud, Droplets } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GardenElement {
  id: string;
  type: 'seed' | 'sprout' | 'flower' | 'tree' | 'butterfly' | 'bird';
  x: number;
  y: number;
  size: 'small' | 'medium' | 'large';
  color: string;
  emoji: string;
  unlocked: boolean;
  milestone?: string;
}

interface WeatherEffect {
  type: 'sun' | 'rain' | 'sparkles';
  active: boolean;
  intensity: number;
}

interface LegacyGardenVisualizationProps {
  documentsCount: number;
  familyMembersCount: number;
  emergencyContactsCount: number;
  willCompleted: boolean;
  trustScore: number;
  protectionDays: number;
  achievedMilestones: string[];
  variant?: 'full' | 'compact' | 'background';
  animated?: boolean;
  interactive?: boolean;
  showWeather?: boolean;
  onElementClick?: (element: GardenElement) => void;
  className?: string;
}

export function LegacyGardenVisualization({
  documentsCount = 0,
  familyMembersCount = 0,
  emergencyContactsCount = 0,
  willCompleted = false,
  trustScore = 0,
  protectionDays = 0,
  achievedMilestones = [],
  variant = 'full',
  animated = true,
  interactive = true,
  showWeather = true,
  onElementClick,
  className
}: LegacyGardenVisualizationProps) {

  const [gardenElements, setGardenElements] = useState<GardenElement[]>([]);
  const [weather, setWeather] = useState<WeatherEffect>({ type: 'sun', active: true, intensity: 0.5 });
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [gardenStage, setGardenStage] = useState<'empty' | 'seeded' | 'growing' | 'blooming' | 'flourishing'>('empty');

  // Calculate garden stage based on progress
  useEffect(() => {
    const totalProgress = documentsCount + (familyMembersCount * 2) + (emergencyContactsCount * 1.5) +
                         (willCompleted ? 5 : 0) + (trustScore / 20);

    if (totalProgress >= 20) setGardenStage('flourishing');
    else if (totalProgress >= 12) setGardenStage('blooming');
    else if (totalProgress >= 6) setGardenStage('growing');
    else if (totalProgress >= 1) setGardenStage('seeded');
    else setGardenStage('empty');
  }, [documentsCount, familyMembersCount, emergencyContactsCount, willCompleted, trustScore]);

  // Generate garden elements based on progress
  useEffect(() => {
    const elements: GardenElement[] = [];

    // Seeds for first documents (up to 5)
    for (let i = 0; i < Math.min(documentsCount, 5); i++) {
      elements.push({
        id: `seed_${i}`,
        type: i < documentsCount ? 'sprout' : 'seed',
        x: 20 + (i * 15),
        y: 70 + (Math.random() * 10 - 5),
        size: 'small',
        color: 'text-green-400',
        emoji: i < documentsCount ? '🌱' : '🌰',
        unlocked: i < documentsCount,
        milestone: `Document ${i + 1} uploaded`
      });
    }

    // Family member flowers
    for (let i = 0; i < familyMembersCount; i++) {
      elements.push({
        id: `family_${i}`,
        type: 'flower',
        x: 15 + (i * 20) + Math.random() * 10,
        y: 50 + Math.random() * 15,
        size: 'medium',
        color: 'text-pink-500',
        emoji: ['🌸', '🌺', '💐', '🌻', '🌹'][i % 5],
        unlocked: true,
        milestone: `Family member ${i + 1} protected`
      });
    }

    // Emergency contact butterflies
    for (let i = 0; i < emergencyContactsCount; i++) {
      elements.push({
        id: `emergency_${i}`,
        type: 'butterfly',
        x: 30 + (i * 25) + Math.random() * 20,
        y: 20 + Math.random() * 20,
        size: 'small',
        color: 'text-blue-500',
        emoji: ['🦋', '🐝', '🐛'][i % 3],
        unlocked: true,
        milestone: `Emergency contact ${i + 1} added`
      });
    }

    // Will completion tree
    if (willCompleted) {
      elements.push({
        id: 'will_tree',
        type: 'tree',
        x: 50 + Math.random() * 20,
        y: 60,
        size: 'large',
        color: 'text-green-700',
        emoji: '🌳',
        unlocked: true,
        milestone: 'Will completed'
      });
    }

    // Trust score birds (every 25 points)
    const birdCount = Math.floor(trustScore / 25);
    for (let i = 0; i < birdCount; i++) {
      elements.push({
        id: `trust_bird_${i}`,
        type: 'bird',
        x: 10 + (i * 30) + Math.random() * 15,
        y: 10 + Math.random() * 20,
        size: 'small',
        color: 'text-yellow-600',
        emoji: ['🐦', '🕊️', '🦅', '🦜'][i % 4],
        unlocked: true,
        milestone: `Trust score milestone: ${(i + 1) * 25} points`
      });
    }

    // Special milestone elements
    if (achievedMilestones.includes('protection_foundation')) {
      elements.push({
        id: 'foundation_castle',
        type: 'tree',
        x: 75,
        y: 65,
        size: 'large',
        color: 'text-purple-600',
        emoji: '🏰',
        unlocked: true,
        milestone: 'Protection foundation built'
      });
    }

    if (protectionDays >= 30) {
      elements.push({
        id: 'time_rainbow',
        type: 'flower',
        x: 80,
        y: 30,
        size: 'medium',
        color: 'text-indigo-500',
        emoji: '🌈',
        unlocked: true,
        milestone: `${protectionDays} days of protection`
      });
    }

    setGardenElements(elements);
  }, [documentsCount, familyMembersCount, emergencyContactsCount, willCompleted, trustScore, protectionDays, achievedMilestones]);

  // Weather effects based on recent activity
  useEffect(() => {
    if (documentsCount === 0) {
      setWeather({ type: 'sun', active: true, intensity: 0.3 });
    } else if (gardenStage === 'seeded' || gardenStage === 'growing') {
      setWeather({ type: 'rain', active: true, intensity: 0.6 });
    } else if (gardenStage === 'blooming' || gardenStage === 'flourishing') {
      setWeather({ type: 'sparkles', active: true, intensity: 0.8 });
    }
  }, [gardenStage, documentsCount]);

  const getGardenMessage = () => {
    switch (gardenStage) {
      case 'empty':
        return 'Your legacy garden awaits the first seed of protection 🌱';
      case 'seeded':
        return 'Seeds of protection have been planted - watch them grow! 🌿';
      case 'growing':
        return 'Your family\'s garden is growing strong with each loving action 🌸';
      case 'blooming':
        return 'Beautiful! Your garden blooms with family protection and care 🌺';
      case 'flourishing':
        return 'Magnificent! Your legacy garden flourishes with comprehensive protection 🌈';
      default:
        return 'Your legacy garden is taking shape...';
    }
  };

  const renderWeatherEffect = () => {
    if (!showWeather || !weather.active) return null;

    if (weather.type === 'sparkles') {
      return (
        <>
          {Array.from({ length: Math.floor(weather.intensity * 8) }).map((_, i) => (
            <motion.div
              key={`sparkle_${i}`}
              className="absolute pointer-events-none"
              initial={{  x: Math.random() * 100 + '%',
                y: Math.random() * 100 + '%',
                scale: 0,
                opacity: 0
               }}
              animate={{  scale: [0, 1, 0],
                opacity: [0, 1, 0],
                rotate: 360
               }}
              transition={{  duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
               }}
            >
              <Sparkles className="h-3 w-3 text-yellow-400" />
            </motion.div>
          ))}
        </>
      );
    }

    if (weather.type === 'rain') {
      return (
        <>
          {Array.from({ length: Math.floor(weather.intensity * 12) }).map((_, i) => (
            <motion.div
              key={`rain_${i}`}
              className="absolute pointer-events-none"
              initial={{  x: Math.random() * 100 + '%',
                y: '-5%',
                opacity: 0.4
               }}
              animate={{  y: '105%',
                opacity: [0.4, 0.6, 0]
               }}
              transition={{  duration: 1.5 + Math.random() * 0.5,
                repeat: Infinity,
                delay: Math.random() * 1.5,
                ease: 'linear'
               }}
            >
              <Droplets className="h-2 w-2 text-blue-400" />
            </motion.div>
          ))}
        </>
      );
    }

    if (weather.type === 'sun') {
      return (
        <motion.div
          className="absolute top-4 right-4 pointer-events-none"
          animate={{  rotate: 360  }}
          transition={{  duration: 20, repeat: Infinity, ease: 'linear'  }}
        >
          <Sun className="h-8 w-8 text-yellow-500 opacity-60" />
        </motion.div>
      );
    }

    return null;
  };

  const renderGardenElement = (element: GardenElement) => (
    <motion.div
      key={element.id}
      className={cn(
        'absolute cursor-pointer transition-transform duration-200',
        hoveredElement === element.id && interactive && 'scale-110',
        element.color
      )}
      style={{ 
        left: `${element.x }}%`,
        top: `${element.y}%`,
        opacity: element.unlocked ? 1 : 0.3
      }}
      initial={animated ? { scale: 0, opacity: 0 } : undefined}
      animate={animated ? { scale: 1, opacity: element.unlocked ? 1 : 0.3 } : undefined}
      transition={animated ? {
        duration: 0.5,
        delay: gardenElements.indexOf(element) * 0.1,
        type: 'spring'
      } : undefined}
      whileHover={interactive ? { scale: 1.2 } : undefined}
      onHoverStart={() => interactive && setHoveredElement(element.id)}
      onHoverEnd={() => setHoveredElement(null)}
      onClick={() => interactive && onElementClick?.(element)}
    >
      <div className="text-2xl select-none">
        {element.emoji}
      </div>

      {element.type === 'butterfly' && animated && (
        <motion.div
          animate={{  x: [0, 10, -5, 15, 0],
            y: [0, -8, 3, -12, 0]
           }}
          transition={{  duration: 4 + Math.random() * 2,
            repeat: Infinity,
            ease: 'easeInOut'
           }}
          className="absolute inset-0"
        >
          <div className="text-2xl select-none">{element.emoji}</div>
        </motion.div>
      )}

      {hoveredElement === element.id && interactive && (
        <motion.div
          initial={{  opacity: 0, y: 10  }}
          animate={{  opacity: 1, y: 0  }}
          className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-black/75 text-white px-2 py-1 rounded text-xs whitespace-nowrap z-10"
        >
          {element.milestone}
        </motion.div>
      )}
    </motion.div>
  );

  if (variant === 'compact') {
    return (
      <div className={cn('relative w-full h-24 bg-gradient-to-b from-sky-100 to-green-100 rounded-lg overflow-hidden', className)}>
        {/* Ground line */}
        <div className="absolute bottom-0 w-full h-8 bg-gradient-to-t from-green-200 to-transparent" />

        {/* Elements (simplified for compact view) */}
        <div className="relative w-full h-full">
          {gardenElements.slice(0, 5).map(renderGardenElement)}
        </div>

        {/* Message overlay */}
        <div className="absolute bottom-2 left-2 text-xs font-medium text-green-800 bg-white/70 px-2 py-1 rounded">
          {gardenStage !== 'empty' ? '🌱 Growing' : '🌰 Ready to plant'}
        </div>
      </div>
    );
  }

  if (variant === 'background') {
    return (
      <div className={cn('absolute inset-0 pointer-events-none opacity-20', className)}>
        <div className="relative w-full h-full bg-gradient-to-b from-sky-50 to-green-50">
          {gardenElements.map(renderGardenElement)}
          {renderWeatherEffect()}
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={cn('relative w-full bg-gradient-to-b from-sky-100 to-green-200 rounded-xl overflow-hidden', className)}>
      {/* Sky background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-100 via-sky-50 to-green-100" />

      {/* Clouds */}
      <motion.div
        className="absolute top-4 left-10 text-white opacity-60"
        animate={{  x: [0, 20, 0]  }}
        transition={{  duration: 8, repeat: Infinity, ease: 'easeInOut'  }}
      >
        <Cloud className="h-8 w-8" />
      </motion.div>

      {/* Ground */}
      <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-green-300 via-green-200 to-transparent" />
      <div className="absolute bottom-0 w-full h-4 bg-green-400" />

      {/* Garden elements */}
      <div className="relative w-full h-full min-h-[300px]">
        <AnimatePresence>
          {gardenElements.map(renderGardenElement)}
        </AnimatePresence>

        {/* Weather effects */}
        {renderWeatherEffect()}

        {/* Garden message */}
        <div className="absolute bottom-6 left-6 right-6">
          <motion.div
            initial={{  opacity: 0, y: 20  }}
            animate={{  opacity: 1, y: 0  }}
            className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg"
          >
            <h3 className="font-semibold text-green-800 mb-1">Your Legacy Garden</h3>
            <p className="text-sm text-green-700 leading-relaxed">
              {getGardenMessage()}
            </p>

            {gardenElements.length > 0 && (
              <div className="flex items-center gap-4 mt-3 text-xs text-green-600">
                <span>🌱 {documentsCount} docs</span>
                <span>🌸 {familyMembersCount} family</span>
                <span>🦋 {emergencyContactsCount} contacts</span>
                {protectionDays > 0 && <span>📅 {protectionDays} days</span>}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
