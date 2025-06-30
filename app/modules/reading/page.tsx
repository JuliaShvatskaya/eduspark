'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Volume2, 
  Check, 
  X,
  Star,
  Play
} from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/providers/UserProvider';
import { toast } from 'sonner';
import Image from 'next/image';

export default function ReadingModule() {
  const { user, addPoints, addAchievement } = useUser();
  const [currentExercise, setCurrentExercise] = useState<string | null>(null);
  const [exerciseProgress, setExerciseProgress] = useState(0);

  const exercises = [
    {
      id: 'phonics',
      title: 'Letter Sounds',
      description: 'Match letters with their sounds',
      difficulty: 'Beginner',
      points: 10,
      icon: '🔤',
      color: 'from-blue-400 to-blue-600'
    },
    {
      id: 'syllables',
      title: 'Syllable Puzzle',
      description: 'Build words from syllables',
      difficulty: 'Intermediate',
      points: 15,
      icon: '🧩',
      color: 'from-green-400 to-green-600'
    },
    {
      id: 'word-building',
      title: 'Word Builder',
      description: 'Create words from letter tiles',
      difficulty: 'Advanced',
      points: 20,
      icon: '🏗️',
      color: 'from-purple-400 to-purple-600'
    },
    {
      id: 'picture-reading',
      title: 'Picture Words',
      description: 'Match pictures with words',
      difficulty: 'Beginner',
      points: 10,
      icon: '🖼️',
      color: 'from-pink-400 to-pink-600'
    },
    {
      id: 'global-reading',
      title: 'Whole Word Reading',
      description: 'Learn using the proven Doman Method for early reading',
      difficulty: 'Intermediate',
      points: 15,
      icon: '👁️',
      color: 'from-indigo-400 to-indigo-600'
    },
    {
      id: 'doman-cards',
      title: 'Doman Picture Cards',
      description: 'Picture cards with words following the Doman Method',
      difficulty: 'Beginner',
      points: 20,
      icon: '🖼️',
      color: 'from-red-400 to-red-600'
    }
  ];

  const startExercise = (exerciseId: string) => {
    setCurrentExercise(exerciseId);
    setExerciseProgress(0);
  };

  const completeExercise = (exerciseId: string) => {
    const exercise = exercises.find(e => e.id === exerciseId);
    if (exercise) {
      addPoints(exercise.points);
      toast.success(`Great job! You earned ${exercise.points} points!`);
      
      // Add achievement for first completion
      if (exerciseId === 'syllables' && !user?.achievements.includes('Syllable Master')) {
        addAchievement('Syllable Master');
        toast.success('New achievement unlocked: Syllable Master! 🏆');
      }
    }
    setCurrentExercise(null);
    setExerciseProgress(100);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  // If in exercise mode, show appropriate exercise interface
  if (currentExercise === 'phonics') {
    // Redirect to phonics game
    window.location.href = '/modules/reading/phonics';
    return <div>Loading phonics game...</div>;
  } else if (currentExercise === 'word-building') {
    // Redirect to word builder game
    window.location.href = '/modules/reading/word-builder';
    return <div>Loading word builder game...</div>;
  } else if (currentExercise === 'picture-reading') {
    // Redirect to picture words game
    window.location.href = '/modules/reading/picture-reading';
    return <div>Loading picture words game...</div>;
  } else if (currentExercise === 'global-reading') {
    // Redirect to global reading game
    window.location.href = '/modules/reading/global-reading';
    return <div>Loading global reading game...</div>;
  } else if (currentExercise === 'doman-cards') {
    // Redirect to doman cards
    window.location.href = '/modules/reading/doman-cards';
    return <div>Loading Doman picture cards...</div>;
  } else if (currentExercise) {
    return <ExerciseInterface 
      exerciseId={currentExercise} 
      onComplete={() => completeExercise(currentExercise)}
      onBack={() => setCurrentExercise(null)}
      progress={exerciseProgress}
      setProgress={setExerciseProgress}
    />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/child-dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Image 
                  src="/eduspark-logo.png" 
                  alt="EduSpark Logo" 
                  width={24} 
                  height={24} 
                  className="object-contain"
                />
                <h1 className="text-xl font-bold text-gray-800">Reading Adventures</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Level {user.level}
              </Badge>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                {user.points} Points
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Module Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Reading Adventures 📚</h2>
                <p className="text-lg opacity-90">
                  Master letters, sounds, and words through fun activities!
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">75%</div>
                <div className="text-sm opacity-75">Module Progress</div>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={75} className="h-3 bg-white/20" />
            </div>
          </div>
        </motion.div>

        {/* Exercise Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Choose Your Reading Challenge</h3>
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

// Exercise Interface Component
function ExerciseInterface({ 
  exerciseId, 
  onComplete, 
  onBack, 
  progress, 
  setProgress 
}: {
  exerciseId: string;
  onComplete: () => void;
  onBack: () => void;
  progress: number;
  setProgress: (progress: number) => void;
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Sample exercise data - in a real app, this would come from an API
  const syllableExercise = {
    questions: [
      {
        word: 'butterfly',
        syllables: ['but', 'ter', 'fly'],
        options: ['but-ter-fly', 'butt-er-fly', 'butter-fly'],
        correct: 'but-ter-fly'
      },
      {
        word: 'elephant',
        syllables: ['el', 'e', 'phant'],
        options: ['el-e-phant', 'ele-phant', 'el-ephant'],
        correct: 'el-e-phant'
      },
      {
        word: 'computer',
        syllables: ['com', 'pu', 'ter'],
        options: ['comp-uter', 'com-pu-ter', 'compu-ter'],
        correct: 'com-pu-ter'
      }
    ]
  };

  const currentQuestionData = syllableExercise.questions[currentQuestion];

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    const correct = answer === currentQuestionData.correct;
    setIsCorrect(correct);

    setTimeout(() => {
      if (currentQuestion < syllableExercise.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setProgress(((currentQuestion + 1) / syllableExercise.questions.length) * 100);
      } else {
        onComplete();
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Exercises
            </Button>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {syllableExercise.questions.length}
              </span>
              <div className="w-32">
                <Progress value={progress} className="h-2" />
              </div>
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
                Syllable Puzzle 🧩
              </CardTitle>
              <p className="text-gray-600">
                How do you break this word into syllables?
              </p>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Word Display */}
              <div className="text-center">
                <div className="text-6xl font-bold text-blue-600 mb-4">
                  {currentQuestionData.word}
                </div>
                <Button variant="ghost" className="text-blue-600">
                  <Volume2 className="w-5 h-5 mr-2" />
                  Hear Word
                </Button>
              </div>

              {/* Answer Options */}
              <div className="space-y-4">
                {currentQuestionData.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(option)}
                    disabled={selectedAnswer !== null}
                    className={`w-full p-6 rounded-xl border-2 transition-all duration-300 ${
                      selectedAnswer === option
                        ? isCorrect
                          ? 'bg-green-100 border-green-500 text-green-800'
                          : 'bg-red-100 border-red-500 text-red-800'
                        : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-semibold">{option}</span>
                      {selectedAnswer === option && (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center">
                          {isCorrect ? (
                            <Check className="w-6 h-6 text-green-600" />
                          ) : (
                            <X className="w-6 h-6 text-red-600" />
                          )}
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Feedback */}
              {isCorrect !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-center p-4 rounded-lg ${
                    isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {isCorrect ? '🎉 Excellent work!' : '💪 Good try! The correct answer is highlighted.'}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}