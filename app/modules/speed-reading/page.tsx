'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Zap, Play, Star, Timer, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/providers/UserProvider';
import { toast } from 'sonner';
import { Header } from '@/components/ui/header';

export default function SpeedReadingModule() {
  const { user, addPoints } = useUser();
  const [currentExercise, setCurrentExercise] = useState<string | null>(null);

  const exercises = [
    {
      id: 'word-pyramid',
      title: 'Word Pyramid',
      description: 'Read words as they appear faster',
      difficulty: 'Beginner',
      points: 15,
      icon: '🔺',
      color: 'from-orange-400 to-orange-600'
    },
    {
      id: 'schulte-table',
      title: 'Schulte Table',
      description: 'Find numbers in sequence quickly',
      difficulty: 'Intermediate',
      points: 20,
      icon: '🔢',
      color: 'from-red-400 to-red-600'
    },
    {
      id: 'flash-reading',
      title: 'Flash Reading',
      description: 'Read words shown briefly',
      difficulty: 'Advanced',
      points: 25,
      icon: '⚡',
      color: 'from-yellow-400 to-yellow-600'
    },
    {
      id: 'line-tracking',
      title: 'Line Tracking',
      description: 'Follow moving text smoothly',
      difficulty: 'Intermediate',
      points: 20,
      icon: '📏',
      color: 'from-green-400 to-green-600'
    }
  ];

  const startExercise = (exerciseId: string) => {
    setCurrentExercise(exerciseId);
  };

  const completeExercise = (exerciseId: string) => {
    const exercise = exercises.find(e => e.id === exerciseId);
    if (exercise) {
      addPoints(exercise.points);
      toast.success(`Fantastic! You earned ${exercise.points} points!`);
    }
    setCurrentExercise(null);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  if (currentExercise === 'schulte-table') {
    return <SchulteTableGame onComplete={() => completeExercise(currentExercise)} onBack={() => setCurrentExercise(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* Header */}
      <Header title="Speed Reading">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Zap className="w-6 h-6 text-orange-600" />
          </div>
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            Level {user.level}
          </Badge>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            {user.points} Points
          </Badge>
        </div>
      </Header>

      <div className="container mx-auto px-4 py-8">
        {/* Module Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Speed Reading ⚡</h2>
                <p className="text-lg opacity-90">
                  Boost your reading speed and comprehension!
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">45%</div>
                <div className="text-sm opacity-75">Module Progress</div>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={45} className="h-3 bg-white/20" />
            </div>
          </div>
        </motion.div>

        {/* Exercise Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Choose Your Speed Challenge</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exercises.map((exercise, index) => (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="text-center">
                    <div className="text-4xl mb-4">{exercise.icon}</div>
                    <CardTitle className="text-xl font-bold text-gray-800">
                      {exercise.title}
                    </CardTitle>
                    <p className="text-gray-600 text-sm">{exercise.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Badge 
                        variant={exercise.difficulty === 'Beginner' ? 'secondary' : 
                                exercise.difficulty === 'Intermediate' ? 'default' : 'destructive'}
                      >
                        {exercise.difficulty}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-semibold">{exercise.points} pts</span>
                      </div>
                    </div>
                    <Button 
                      className={`w-full bg-gradient-to-r ${exercise.color} hover:opacity-90`}
                      onClick={() => startExercise(exercise.id)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Exercise
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Schulte Table Game Component
function SchulteTableGame({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const shuffledNumbers = Array.from({ length: 25 }, (_, i) => i + 1)
      .sort(() => Math.random() - 0.5);
    setNumbers(shuffledNumbers);
    setCurrentNumber(1);
    setStartTime(null);
    setEndTime(null);
    setGameStarted(false);
  };

  const handleNumberClick = (clickedNumber: number) => {
    if (!gameStarted) {
      setGameStarted(true);
      setStartTime(Date.now());
    }

    if (clickedNumber === currentNumber) {
      if (currentNumber === 25) {
        setEndTime(Date.now());
        const time = ((Date.now() - (startTime || Date.now())) / 1000).toFixed(1);
        toast.success(`Excellent! Completed in ${time} seconds!`);
        setTimeout(onComplete, 2000);
      } else {
        setCurrentNumber(currentNumber + 1);
      }
    } else {
      toast.error('Wrong number! Try again.');
    }
  };

  const getElapsedTime = () => {
    if (!startTime) return '0.0';
    const elapsed = endTime ? endTime - startTime : Date.now() - startTime;
    return (elapsed / 1000).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Exercises
            </Button>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Timer className="w-4 h-4 text-red-500" />
                <span className="font-semibold">{getElapsedTime()}s</span>
              </div>
              <div className="text-sm">
                <span className="font-semibold">Find: {currentNumber}</span>
              </div>
              <Button variant="outline" size="sm" onClick={initializeGame}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-800">
                Schulte Table 🔢
              </CardTitle>
              <p className="text-gray-600">
                Click numbers from 1 to 25 in order as fast as you can!
              </p>
              <div className="text-lg font-semibold text-red-600">
                Next number: {currentNumber}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-3 max-w-md mx-auto">
                {numbers.map((number, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNumberClick(number)}
                    className={`aspect-square rounded-lg border-2 text-xl font-bold transition-all duration-200 ${
                      number < currentNumber
                        ? 'bg-green-100 border-green-500 text-green-800'
                        : number === currentNumber
                        ? 'bg-red-100 border-red-500 text-red-800 ring-2 ring-red-300'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400'
                    }`}
                  >
                    {number}
                  </motion.button>
                ))}
              </div>
              
              <div className="mt-6 text-center space-y-2">
                <p className="text-sm text-gray-600">
                  Progress: {currentNumber - 1}/25
                </p>
                <Progress value={((currentNumber - 1) / 25) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}