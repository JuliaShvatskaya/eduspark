'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {  
  Brain, 
  Zap, 
  Star, 
  Trophy, 
  Play,
  User,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/providers/UserProvider';
import { Header } from '@/components/ui/header';

export default function ChildDashboard() {
  const { user } = useUser();
  const [hoveredModule, setHoveredModule] = useState<number | null>(null);

  const learningModules = [
    {
      id: 'reading',
      title: 'Reading Adventures',
      description: 'Letters, sounds, and word building',
      icon: BookOpen,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
      progress: 75,
      nextActivity: 'Syllable Puzzle',
      href: '/modules/reading'
    },
    {
      id: 'attention',
      title: 'Focus Games',
      description: 'Memory and attention training',
      icon: Brain,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50',
      progress: 60,
      nextActivity: 'Memory Match',
      href: '/modules/attention'
    },
    {
      id: 'speed-reading',
      title: 'Speed Reading',
      description: 'Fast reading and comprehension',
      icon: Zap,
      color: 'from-orange-400 to-orange-600',
      bgColor: 'bg-orange-50',
      progress: 45,
      nextActivity: 'Word Pyramid',
      href: '/modules/speed-reading'
    }
  ];

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">

        {/* Learning Modules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Choose Your Adventure</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningModules.map((module, index) => {
              const Icon = module.icon;
              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  onHoverStart={() => setHoveredModule(index)}
                  onHoverEnd={() => setHoveredModule(null)}
                >
                  <Link href={module.href}>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
