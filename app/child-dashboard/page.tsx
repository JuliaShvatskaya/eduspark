'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Zap, 
  Star, 
  Trophy, 
  Play,
  User,
  BookOpen,
  Calendar,
  Bell,
  Settings,
  LogOut,
  Home,
  Gift,
  Sparkles,
  Clock,
  Target,
  Rocket,
  Medal,
  Crown,
  Heart,
  Gamepad2,
  BookMarked,
  MessageCircle,
  PenTool,
  Check,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/providers/UserProvider';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const avatarOptions = [
  '🦁', '🐯', '🐻', '🐼', '🐨', '🦊', '🐰', '🐸', '🐵', '🦉'
];

const backgroundOptions = [
  'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50',
  'bg-gradient-to-br from-green-50 via-teal-50 to-blue-50',
  'bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50',
  'bg-gradient-to-br from-purple-50 via-indigo-50 to-violet-50',
  'bg-gradient-to-br from-pink-50 via-rose-50 to-red-50'
];

export default function ChildDashboard() {
  const { user, addPoints, addAchievement } = useUser();
  const [activeTab, setActiveTab] = useState('learn');
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [dailyStreak, setDailyStreak] = useState(7);
  const [dailyGoalCompleted, setDailyGoalCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    // Simulate time tracking
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);

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
      href: '/modules/reading',
      recommended: true
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
      href: '/modules/attention',
      recommended: false
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
      href: '/modules/speed-reading',
      recommended: false
    }
  ];

  const dailyChallenges = [
    {
      id: 'challenge-1',
      title: 'Rainbow Reading',
      description: 'Read 10 colorful words',
      icon: '🌈',
      points: 50,
      completed: false,
      timeEstimate: '5 min'
    },
    {
      id: 'challenge-2',
      title: 'Memory Master',
      description: 'Complete 3 memory games',
      icon: '🧠',
      points: 75,
      completed: true,
      timeEstimate: '10 min'
    },
    {
      id: 'challenge-3',
      title: 'Word Wizard',
      description: 'Build 5 new words',
      icon: '✨',
      points: 60,
      completed: false,
      timeEstimate: '8 min'
    }
  ];

  const achievements = [
    {
      id: 'achievement-1',
      title: 'Reading Star',
      description: 'Read 50 words correctly',
      icon: '⭐',
      date: '2 days ago',
      points: 100
    },
    {
      id: 'achievement-2',
      title: 'Memory Master',
      description: 'Complete 10 memory games',
      icon: '🏆',
      date: '1 week ago',
      points: 150
    },
    {
      id: 'achievement-3',
      title: 'Focus Champion',
      description: 'Stay focused for 15 minutes',
      icon: '🎯',
      date: 'Today!',
      points: 200,
      new: true
    }
  ];

  const upcomingEvents = [
    {
      id: 'event-1',
      title: 'Reading Challenge',
      description: 'Special event with bonus points',
      date: 'Tomorrow',
      icon: '📚'
    },
    {
      id: 'event-2',
      title: 'New Games',
      description: 'Exciting new focus games',
      date: 'In 3 days',
      icon: '🎮'
    }
  ];

  const notifications = [
    {
      id: 'notif-1',
      title: 'New Achievement!',
      description: 'You earned "Focus Champion"',
      time: '2 hours ago',
      read: false
    },
    {
      id: 'notif-2',
      title: 'Daily Streak',
      description: 'You\'re on a 7-day streak!',
      time: 'Today',
      read: false
    },
    {
      id: 'notif-3',
      title: 'Parent Message',
      description: 'Great job on your reading!',
      time: 'Yesterday',
      read: true
    }
  ];

  const handleAvatarChange = (avatar: string) => {
    if (user) {
      // In a real app, this would update the user's avatar in the database
      toast.success(`Avatar changed to ${avatar}!`);
      setShowAvatarSelector(false);
    }
  };

  const handleBackgroundChange = (index: number) => {
    setSelectedBackground(index);
    toast.success('Background changed!');
  };

  const completeChallenge = (challengeId: string) => {
    // In a real app, this would mark the challenge as completed in the database
    const challenge = dailyChallenges.find(c => c.id === challengeId);
    if (challenge && !challenge.completed) {
      addPoints(challenge.points);
      toast.success(`Challenge completed! +${challenge.points} points!`);
      
      // Check if all daily challenges are completed
      const remainingChallenges = dailyChallenges.filter(c => !c.completed && c.id !== challengeId).length;
      if (remainingChallenges === 0) {
        setDailyGoalCompleted(true);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
        addAchievement('Daily Champion');
        addPoints(100); // Bonus for completing all challenges
        toast.success('All daily challenges completed! +100 bonus points!');
      }
    }
  };

  const markNotificationAsRead = (notifId: string) => {
    // In a real app, this would mark the notification as read in the database
    toast.success('Notification marked as read');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your magical learning world...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen", backgroundOptions[selectedBackground])}>
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white/80 backdrop-blur-md rounded-full p-8 shadow-xl"
            >
              <div className="text-center">
                <div className="text-6xl mb-2">🎉</div>
                <h3 className="text-2xl font-bold text-purple-600">Amazing Job!</h3>
                <p className="text-lg text-purple-500">All challenges completed!</p>
              </div>
            </motion.div>
          </div>
          <div className="absolute inset-0">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: Math.random() * window.innerWidth, 
                  y: -20,
                  opacity: 0
                }}
                animate={{ 
                  y: window.innerHeight + 20,
                  opacity: [0, 1, 1, 0],
                  scale: [0.5, 1, 1, 0.5]
                }}
                transition={{ 
                  duration: 2 + Math.random() * 3,
                  delay: Math.random() * 2,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 2
                }}
                className="absolute w-4 h-4 text-2xl"
              >
                {['✨', '🎉', '🌟', '⭐', '🏆'][Math.floor(Math.random() * 5)]}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setShowAvatarSelector(true)}
                className="relative w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-3xl cursor-pointer hover:scale-110 transition-transform duration-200 shadow-md"
                aria-label="Change avatar"
              >
                {user.avatar}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <PenTool className="w-3 h-3 text-blue-500" />
                </div>
              </button>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Hi, {user.name}!
                </h1>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Star className="w-3 h-3 text-yellow-500 mr-1" />
                    <span>{user.points} points</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center">
                    <Crown className="w-3 h-3 text-purple-500 mr-1" />
                    <span>Level {user.level}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </Button>
                
                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 overflow-hidden"
                    >
                      <div className="p-3 border-b">
                        <h3 className="font-semibold">Notifications</h3>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map(notif => (
                            <div 
                              key={notif.id}
                              className={`p-3 border-b hover:bg-gray-50 cursor-pointer transition-colors ${!notif.read ? 'bg-blue-50' : ''}`}
                              onClick={() => markNotificationAsRead(notif.id)}
                            >
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium text-sm">{notif.title}</h4>
                                <span className="text-xs text-gray-500">{notif.time}</span>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">{notif.description}</p>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-500">
                            <p>No notifications</p>
                          </div>
                        )}
                      </div>
                      <div className="p-2 border-t text-center">
                        <button className="text-xs text-blue-600 hover:text-blue-800">
                          Mark all as read
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <Link href="/parent-dashboard">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <User className="w-4 h-4 mr-2" />
                  Parent View
                </Button>
              </Link>
              
              <Link href="/auth/sign-out">
                <Button variant="ghost" size="icon">
                  <LogOut className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Avatar Selector Modal */}
      <AnimatePresence>
        {showAvatarSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAvatarSelector(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-center mb-4">Choose Your Avatar</h2>
              <div className="grid grid-cols-5 gap-3 mb-6">
                {avatarOptions.map((avatar, index) => (
                  <button
                    key={index}
                    onClick={() => handleAvatarChange(avatar)}
                    className={`text-3xl p-3 rounded-lg hover:bg-blue-50 transition-colors ${
                      user.avatar === avatar ? 'bg-blue-100 ring-2 ring-blue-400' : ''
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
              <h3 className="text-lg font-semibold text-center mb-4">Choose Background</h3>
              <div className="grid grid-cols-5 gap-3 mb-6">
                {backgroundOptions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleBackgroundChange(index)}
                    className={`h-8 rounded-lg transition-all ${backgroundOptions[index]} ${
                      selectedBackground === index ? 'ring-2 ring-blue-400 scale-110' : ''
                    }`}
                  ></button>
                ))}
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setShowAvatarSelector(false)}>
                  Done
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-6">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  Welcome to Your Learning Adventure!
                </h2>
                <p className="text-white/90 max-w-xl">
                  Today is a great day to learn something new and exciting. What would you like to explore?
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold">{dailyStreak}</div>
                <div className="text-sm text-white/90">Day Streak 🔥</div>
                <div className="mt-2">
                  {dailyGoalCompleted ? (
                    <Badge className="bg-green-500 text-white border-0">
                      Daily Goal Complete!
                    </Badge>
                  ) : (
                    <Badge className="bg-white/20 text-white border-0">
                      {dailyChallenges.filter(c => c.completed).length}/{dailyChallenges.length} Challenges
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full bg-white/70 backdrop-blur-sm rounded-xl p-1 shadow-sm">
            <TabsTrigger value="learn" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              <div className="flex flex-col items-center py-1">
                <Rocket className="w-5 h-5 mb-1" />
                <span className="text-xs">Learn</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="challenges" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              <div className="flex flex-col items-center py-1">
                <Target className="w-5 h-5 mb-1" />
                <span className="text-xs">Challenges</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="rewards" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              <div className="flex flex-col items-center py-1">
                <Gift className="w-5 h-5 mb-1" />
                <span className="text-xs">Rewards</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="progress" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              <div className="flex flex-col items-center py-1">
                <Trophy className="w-5 h-5 mb-1" />
                <span className="text-xs">Progress</span>
              </div>
            </TabsTrigger>
          </TabsList>

          {/* Learn Tab */}
          <TabsContent value="learn" className="space-y-6">
            {/* Recommended Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white overflow-hidden">
                <CardHeader className="pb-2">
                  <Badge className="bg-white/20 border-0 self-start">Recommended for you</Badge>
                  <CardTitle className="text-xl">Continue Your Reading Journey</CardTitle>
                  <CardDescription className="text-white/90">
                    You're making great progress with syllables!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">Syllable Puzzle</div>
                        <div className="text-sm text-white/80">10 minutes</div>
                      </div>
                    </div>
                    <Link href="/modules/reading">
                      <Button size="sm" className="bg-white text-purple-600 hover:bg-white/90">
                        <Play className="w-3 h-3 mr-1" />
                        Continue
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Learning Modules */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Learning Adventures</h3>
                <Button variant="ghost" size="sm" className="text-gray-600">
                  View All
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {learningModules.map((module, index) => (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="relative"
                  >
                    {module.recommended && (
                      <div className="absolute -top-2 -right-2 z-10">
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-md">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Recommended
                        </Badge>
                      </div>
                    )}
                    <Link href={module.href}>
                      <Card className={`h-full hover:shadow-xl transition-all duration-300 border-0 overflow-hidden ${module.bgColor}`}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${module.color} flex items-center justify-center`}>
                              <module.icon className="w-6 h-6 text-white" />
                            </div>
                            <Badge variant="outline" className="bg-white/50 text-gray-700">
                              {module.progress}%
                            </Badge>
                          </div>
                          <CardTitle className="text-lg font-bold mt-3 text-gray-800">
                            {module.title}
                          </CardTitle>
                          <p className="text-sm text-gray-600">{module.description}</p>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <Progress value={module.progress} className="h-2" />
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Next: {module.nextActivity}</span>
                              <Button size="sm" className="bg-white text-gray-800 hover:bg-gray-100">
                                <Play className="w-3 h-3 mr-1" />
                                Continue
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Access Games */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Quick Games</h3>
                <Button variant="ghost" size="sm" className="text-gray-600">
                  More Games
                </Button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[
                  { title: 'Memory Match', icon: '🃏', color: 'bg-purple-100', href: '/memory-match' },
                  { title: 'Word Builder', icon: '🔤', color: 'bg-blue-100', href: '/modules/reading/word-builder' },
                  { title: 'Phonics Fun', icon: '🔊', color: 'bg-green-100', href: '/modules/reading/phonics' },
                  { title: 'Math Puzzles', icon: '🧩', color: 'bg-yellow-100', href: '#' }
                ].map((game, index) => (
                  <Link href={game.href} key={index}>
                    <Card className={`h-full hover:shadow-md transition-all duration-300 border-0 ${game.color}`}>
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl mb-2">{game.icon}</div>
                        <div className="text-sm font-medium">{game.title}</div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-6">
            {/* Daily Challenges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-orange-400 to-pink-500 text-white">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Target className="w-5 h-5 mr-2" />
                      Today's Challenges
                    </CardTitle>
                    <div className="text-sm">
                      {dailyChallenges.filter(c => c.completed).length}/{dailyChallenges.length} Completed
                    </div>
                  </div>
                  <CardDescription className="text-white/90">
                    Complete all challenges to earn bonus points and extend your streak!
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {dailyChallenges.map((challenge) => (
                      <div 
                        key={challenge.id}
                        className={`p-4 rounded-lg border transition-all ${
                          challenge.completed 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-white border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="text-3xl">{challenge.icon}</div>
                            <div>
                              <div className="font-medium">{challenge.title}</div>
                              <div className="text-sm text-gray-600">{challenge.description}</div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="flex items-center text-sm text-gray-500 mb-2">
                              <Clock className="w-3 h-3 mr-1" />
                              <span>{challenge.timeEstimate}</span>
                            </div>
                            {challenge.completed ? (
                              <Badge className="bg-green-500 text-white border-0">
                                <Check className="w-3 h-3 mr-1" />
                                Completed
                              </Badge>
                            ) : (
                              <Button 
                                size="sm" 
                                onClick={() => completeChallenge(challenge.id)}
                                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                              >
                                Start
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {dailyGoalCompleted ? (
                    <div className="mt-6 p-4 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-lg border border-yellow-200 text-center">
                      <div className="text-2xl mb-2">🎉</div>
                      <h4 className="font-semibold text-amber-800">All Challenges Completed!</h4>
                      <p className="text-sm text-amber-700">
                        You've earned 100 bonus points and extended your streak!
                      </p>
                    </div>
                  ) : (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-blue-800">Complete All Challenges</h4>
                          <p className="text-sm text-blue-600">
                            Earn 100 bonus points and extend your streak!
                          </p>
                        </div>
                        <div className="text-3xl">🎁</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Weekly Goals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Weekly Goals
                  </CardTitle>
                  <CardDescription>
                    Your progress toward this week's learning goals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <div className="text-sm font-medium">Reading Practice</div>
                        <div className="text-sm text-gray-500">30/45 minutes</div>
                      </div>
                      <Progress value={66} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <div className="text-sm font-medium">Memory Games</div>
                        <div className="text-sm text-gray-500">8/10 games</div>
                      </div>
                      <Progress value={80} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <div className="text-sm font-medium">New Words Learned</div>
                        <div className="text-sm text-gray-500">12/20 words</div>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Upcoming Events */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Coming Soon
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div 
                        key={event.id}
                        className="p-4 rounded-lg border border-blue-100 bg-blue-50"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-3xl">{event.icon}</div>
                          <div>
                            <div className="font-medium">{event.title}</div>
                            <div className="text-sm text-gray-600">{event.description}</div>
                            <div className="text-xs text-blue-600 mt-1">{event.date}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6">
            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Medal className="w-5 h-5 mr-2" />
                    Your Achievements
                  </CardTitle>
                  <CardDescription>
                    Special badges you've earned on your learning journey
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {achievements.map((achievement) => (
                      <div 
                        key={achievement.id}
                        className={`p-4 rounded-lg border transition-all relative ${
                          achievement.new 
                            ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200' 
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        {achievement.new && (
                          <div className="absolute -top-2 -right-2">
                            <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-0">
                              New!
                            </Badge>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-2xl">
                              {achievement.icon}
                            </div>
                            <div>
                              <div className="font-medium">{achievement.title}</div>
                              <div className="text-sm text-gray-600">{achievement.description}</div>
                              <div className="text-xs text-gray-500 mt-1">Earned {achievement.date}</div>
                            </div>
                          </div>
                          <div className="flex items-center text-amber-600 font-semibold">
                            <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
                            {achievement.points}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Button variant="outline">
                      View All Achievements
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Reward Store */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white">
                  <CardTitle className="flex items-center">
                    <Gift className="w-5 h-5 mr-2" />
                    Reward Store
                  </CardTitle>
                  <CardDescription className="text-white/90">
                    Use your points to unlock special rewards!
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { title: 'Space Theme', icon: '🚀', points: 200, unlocked: false },
                      { title: 'Dinosaur Avatar', icon: '🦖', points: 300, unlocked: false },
                      { title: 'Extra Game', icon: '🎮', points: 150, unlocked: true },
                      { title: 'Unicorn Theme', icon: '🦄', points: 250, unlocked: false },
                      { title: 'Robot Avatar', icon: '🤖', points: 350, unlocked: false },
                      { title: 'Music Pack', icon: '🎵', points: 100, unlocked: true }
                    ].map((reward, index) => (
                      <Card 
                        key={index}
                        className={`border hover:shadow-md transition-all ${
                          reward.unlocked ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' : ''
                        }`}
                      >
                        <CardContent className="p-4 text-center">
                          <div className="text-3xl mb-2">{reward.icon}</div>
                          <div className="font-medium text-sm mb-1">{reward.title}</div>
                          <div className="flex items-center justify-center text-xs">
                            <Star className="w-3 h-3 mr-1 text-yellow-500" />
                            <span>{reward.points} points</span>
                          </div>
                          <Button 
                            size="sm" 
                            variant={reward.unlocked ? "outline" : "default"}
                            className="mt-2 w-full text-xs"
                            disabled={!reward.unlocked && user.points < reward.points}
                          >
                            {reward.unlocked ? 'Use' : user.points >= reward.points ? 'Unlock' : 'Need More Points'}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            {/* Overall Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="w-5 h-5 mr-2" />
                    Your Learning Journey
                  </CardTitle>
                  <CardDescription>
                    Track your progress across different skills
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <div className="font-medium">Overall Progress</div>
                        <div className="text-sm text-gray-600">60%</div>
                      </div>
                      <Progress value={60} className="h-3" />
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center">
                            <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                            <span className="text-sm font-medium">Reading Skills</span>
                          </div>
                          <div className="text-sm text-gray-600">75%</div>
                        </div>
                        <Progress value={75} className="h-2 bg-blue-100" indicatorClassName="bg-blue-500" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center">
                            <Brain className="w-4 h-4 mr-2 text-purple-500" />
                            <span className="text-sm font-medium">Attention & Memory</span>
                          </div>
                          <div className="text-sm text-gray-600">60%</div>
                        </div>
                        <Progress value={60} className="h-2 bg-purple-100" indicatorClassName="bg-purple-500" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center">
                            <Zap className="w-4 h-4 mr-2 text-orange-500" />
                            <span className="text-sm font-medium">Speed Reading</span>
                          </div>
                          <div className="text-sm text-gray-600">45%</div>
                        </div>
                        <Progress value={45} className="h-2 bg-orange-100" indicatorClassName="bg-orange-500" />
                      </div>
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

            {/* Learning Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Your Learning Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="border bg-blue-50">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl mb-1">🎯</div>
                        <div className="text-2xl font-bold text-blue-600">85%</div>
                        <div className="text-sm text-gray-600">Accuracy</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border bg-purple-50">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl mb-1">⏱️</div>
                        <div className="text-2xl font-bold text-purple-600">{timeSpent}</div>
                        <div className="text-sm text-gray-600">Minutes Today</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border bg-green-50">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl mb-1">📚</div>
                        <div className="text-2xl font-bold text-green-600">42</div>
                        <div className="text-sm text-gray-600">Words Mastered</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border bg-amber-50">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl mb-1">🏆</div>
                        <div className="text-2xl font-bold text-amber-600">{user.achievements.length}</div>
                        <div className="text-sm text-gray-600">Achievements</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="font-semibold text-blue-800 mb-2">Learning Insights</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• You learn best in the morning</li>
                      <li>• Your reading speed has improved by 15%</li>
                      <li>• You excel at memory games</li>
                      <li>• Try more syllable exercises to improve</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Parent Communication */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Messages from Parents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-lg border border-green-100 bg-green-50">
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">👩‍👧</div>
                      <div>
                        <div className="font-medium">Great job on your reading!</div>
                        <div className="text-sm text-gray-600">
                          I'm so proud of how well you're doing with your syllable practice. Keep it up!
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Mom • Yesterday</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <Button variant="outline" size="sm">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Send Message to Parent
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Bottom Navigation (Mobile) */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-40 p-2">
          <div className="grid grid-cols-4 gap-1">
            <Button 
              variant="ghost" 
              className={`flex flex-col items-center py-2 px-1 h-auto ${activeTab === 'learn' ? 'text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('learn')}
            >
              <Rocket className="w-5 h-5 mb-1" />
              <span className="text-xs">Learn</span>
            </Button>
            <Button 
              variant="ghost" 
              className={`flex flex-col items-center py-2 px-1 h-auto ${activeTab === 'challenges' ? 'text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('challenges')}
            >
              <Target className="w-5 h-5 mb-1" />
              <span className="text-xs">Challenges</span>
            </Button>
            <Button 
              variant="ghost" 
              className={`flex flex-col items-center py-2 px-1 h-auto ${activeTab === 'rewards' ? 'text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('rewards')}
            >
              <Gift className="w-5 h-5 mb-1" />
              <span className="text-xs">Rewards</span>
            </Button>
            <Button 
              variant="ghost" 
              className={`flex flex-col items-center py-2 px-1 h-auto ${activeTab === 'progress' ? 'text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('progress')}
            >
              <Trophy className="w-5 h-5 mb-1" />
              <span className="text-xs">Progress</span>
            </Button>
          </div>
        </div>
        
        {/* Spacer for mobile bottom nav */}
        <div className="h-16 md:hidden"></div>
      </div>
    </div>
  );
}