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
      <Header>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{user.avatar}</span>
            <div>
              <p className="font-semibold text-gray-800">Hi, {user.name}!</p>
              <p className="text-sm text-gray-600">Level {user.level}</p>
            </div>
          </div>
          <Link href="/parent-dashboard">
            <Button variant="outline" size="sm">
              <User className="w-4 h-4 mr-2" />
              Parent View
            </Button>
          </Link>
          <Link href="/auth/sign-out">
            <Button variant="ghost" size="sm">
              Sign Out
            </Button>
          </Link>
        </div>
      </Header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  Welcome back, {user.name}! 🎉
                </h2>
                <p className="text-lg opacity-90">Ready for another learning adventure?</p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{user.points}</div>
                    <div className="text-sm opacity-75">Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{user.level}</div>
                    <div className="text-sm opacity-75">Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl">{user.avatar}</div>
                    <div className="text-sm opacity-75">Avatar</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span>Your Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Overall Progress</span>
                    <span className="text-sm text-gray-600">60%</span>
                  </div>
                  <Progress value={60} className="h-3" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {user.achievements.map((achievement, index) => (
                    <Badge key={index} variant="secondary" className="bg-yellow-100 text-yellow-800">
                      <Star className="w-3 h-3 mr-1" />
                      {achievement}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Learning Modules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Choose Your Adventure</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningModules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                onHoverStart={() => setHoveredModule(index)}
                onHoverEnd={() => setHoveredModule(null)}
              >
                <Link href={module.href} className="block h-full">
                  <Card className={`h-full hover:shadow-xl transition-all duration-300 border-0 ${module.bgColor} overflow-hidden cursor-pointer`}>
                    <CardHeader className="relative">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${module.color} mx-auto mb-4 flex items-center justify-center transform transition-transform duration-300 ${hoveredModule === index ? 'scale-110' : ''}`}>
                        <module.icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-800 text-center">
                        {module.title}
                      </CardTitle>
                      <p className="text-gray-600 text-center text-sm">
                        {module.description}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm text-gray-600">{module.progress}%</span>
                        </div>
                        <Progress value={module.progress} className="h-2" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-3">Next: {module.nextActivity}</p>
                        <Button className={`bg-gradient-to-r ${module.color} hover:opacity-90 w-full`}>
                          <Play className="w-4 h-4 mr-2" />
                          Play Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Daily Challenge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-r from-green-400 to-green-600 text-white border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span>Today's Special Challenge</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold mb-2">Rainbow Reading</h4>
                  <p className="opacity-90 mb-4">Read 10 colorful words and win bonus points!</p>
                  <Badge className="bg-white text-green-600">+50 Points</Badge>
                </div>
                <Button className="bg-white text-green-600 hover:bg-gray-100">
                  Start Challenge
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
