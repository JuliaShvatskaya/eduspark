'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Volume2, 
  Star, 
  Heart, 
  Settings, 
  RotateCcw,
  CheckCircle,
  XCircle,
  Lightbulb,
  Trophy,
  Play,
  Pause
} from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/providers/UserProvider';
import { toast } from 'sonner';
import Confetti from 'react-confetti';

interface LetterData {
  letter: string;
  sound: string;
  words: Array<{
    word: string;
    image: string;
    isCorrect: boolean;
  }>;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface GameSettings {
  letterSet: 'basic' | 'advanced' | 'custom';
  difficulty: 'adaptive' | 'easy' | 'medium' | 'hard';
  soundEnabled: boolean;
  hintsEnabled: boolean;
  accessibilityMode: boolean;
}

export default function PhonicsGame() {
  const { user, addPoints } = useUser();
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    letterSet: 'basic',
    difficulty: 'adaptive',
    soundEnabled: true,
    hintsEnabled: true,
    accessibilityMode: false
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lives, setLives] = useState(3);
  const [gameComplete, setGameComplete] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Letter data with phonetic sounds and matching images
  const letterData: LetterData[] = [
    {
      letter: 'A',
      sound: '/æ/',
      words: [
        { word: 'Apple', image: '🍎', isCorrect: true },
        { word: 'Ball', image: '⚽', isCorrect: false },
        { word: 'Cat', image: '🐱', isCorrect: false },
        { word: 'Ant', image: '🐜', isCorrect: true }
      ],
      difficulty: 'easy'
    },
    {
      letter: 'B',
      sound: '/b/',
      words: [
        { word: 'Ball', image: '⚽', isCorrect: true },
        { word: 'Apple', image: '🍎', isCorrect: false },
        { word: 'Dog', image: '🐕', isCorrect: false },
        { word: 'Bear', image: '🐻', isCorrect: true }
      ],
      difficulty: 'easy'
    },
    {
      letter: 'C',
      sound: '/k/',
      words: [
        { word: 'Cat', image: '🐱', isCorrect: true },
        { word: 'Ball', image: '⚽', isCorrect: false },
        { word: 'Fish', image: '🐟', isCorrect: false },
        { word: 'Car', image: '🚗', isCorrect: true }
      ],
      difficulty: 'easy'
    },
    {
      letter: 'D',
      sound: '/d/',
      words: [
        { word: 'Dog', image: '🐕', isCorrect: true },
        { word: 'Cat', image: '🐱', isCorrect: false },
        { word: 'Apple', image: '🍎', isCorrect: false },
        { word: 'Duck', image: '🦆', isCorrect: true }
      ],
      difficulty: 'easy'
    },
    {
      letter: 'E',
      sound: '/ɛ/',
      words: [
        { word: 'Elephant', image: '🐘', isCorrect: true },
        { word: 'Dog', image: '🐕', isCorrect: false },
        { word: 'Fish', image: '🐟', isCorrect: false },
        { word: 'Egg', image: '🥚', isCorrect: true }
      ],
      difficulty: 'medium'
    }
  ];

  const currentLetter = letterData[currentLetterIndex];

  // Play letter sound
  const playLetterSound = () => {
    if (!gameSettings.soundEnabled) return;
    
    // In a real implementation, you would use actual audio files
    // For demo purposes, we'll use speech synthesis
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentLetter.sound);
      utterance.rate = 0.7;
      utterance.pitch = 1.2;
      speechSynthesis.speak(utterance);
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    const correct = currentLetter.words[answerIndex].isCorrect;
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 10);
      setStreak(streak + 1);
      addPoints(10);
      
      if (streak >= 4) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        toast.success('Amazing streak! Bonus points!');
        addPoints(5);
      }
      
      toast.success('Excellent! That\'s correct!');
    } else {
      setStreak(0);
      setLives(lives - 1);
      
      if (lives <= 1) {
        toast.error('Game Over! Let\'s try again.');
        resetGame();
        return;
      }
      
      toast.error('Not quite right. Try again!');
    }

    // Auto-advance after delay
    setTimeout(() => {
      if (correct) {
        nextLetter();
      } else {
        setSelectedAnswer(null);
        setIsCorrect(null);
        setShowHint(true);
      }
    }, 2000);
  };

  // Move to next letter
  const nextLetter = () => {
    if (currentLetterIndex >= letterData.length - 1) {
      setGameComplete(true);
      setShowConfetti(true);
      toast.success('Congratulations! You completed all letters!');
      addPoints(50);
      return;
    }

    setCurrentLetterIndex(currentLetterIndex + 1);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowHint(false);
  };

  // Reset game
  const resetGame = () => {
    setCurrentLetterIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setStreak(0);
    setLives(3);
    setShowHint(false);
    setGameComplete(false);
  };

  // Show hint
  const showHintForLetter = () => {
    setShowHint(true);
    toast.info(`The letter ${currentLetter.letter} makes the sound ${currentLetter.sound}. Look for words that start with this sound!`);
  };

  // Auto-play sound on letter change
  useEffect(() => {
    if (gameSettings.soundEnabled) {
      setTimeout(() => playLetterSound(), 500);
    }
  }, [currentLetterIndex, gameSettings.soundEnabled]);

  if (!user) {
    return <div>Loading...</div>;
  }

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        {showConfetti && <Confetti />}
        <Card className="max-w-md mx-auto text-center bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Fantastic Work! 🎉
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-lg text-gray-600">
              You completed all the letters!
            </div>
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{score}</div>
                <div className="text-sm text-gray-500">Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{letterData.length}</div>
                <div className="text-sm text-gray-500">Letters</div>
              </div>
            </div>
            <div className="space-y-2">
              <Button onClick={resetGame} className="w-full bg-gradient-to-r from-green-500 to-blue-600">
                <RotateCcw className="w-4 h-4 mr-2" />
                Play Again
              </Button>
              <Link href="/modules/reading">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Reading
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {showConfetti && <Confetti />}
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/modules/reading">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Reading
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-gray-800">Letter Sounds Game</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="font-semibold">{lives}</span>
              </div>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                {score} Points
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-gray-600">
              {currentLetterIndex + 1} of {letterData.length}
            </span>
          </div>
          <Progress 
            value={((currentLetterIndex + 1) / letterData.length) * 100} 
            className="h-3"
          />
        </motion.div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Game Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Sound</label>
                      <Button
                        variant={gameSettings.soundEnabled ? "default" : "outline"}
                        size="sm"
                        onClick={() => setGameSettings({
                          ...gameSettings,
                          soundEnabled: !gameSettings.soundEnabled
                        })}
                        className="w-full mt-1"
                      >
                        {gameSettings.soundEnabled ? 'On' : 'Off'}
                      </Button>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Hints</label>
                      <Button
                        variant={gameSettings.hintsEnabled ? "default" : "outline"}
                        size="sm"
                        onClick={() => setGameSettings({
                          ...gameSettings,
                          hintsEnabled: !gameSettings.hintsEnabled
                        })}
                        className="w-full mt-1"
                      >
                        {gameSettings.hintsEnabled ? 'On' : 'Off'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Game Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className="space-y-4">
                {/* Letter Display */}
                <motion.div
                  key={currentLetter.letter}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="relative"
                >
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mx-auto flex items-center justify-center shadow-lg">
                    <div className="text-center text-white">
                      <div className="text-6xl font-bold">{currentLetter.letter}</div>
                      <div className="text-sm opacity-75">{currentLetter.letter.toLowerCase()}</div>
                    </div>
                  </div>
                  
                  {/* Sound Button */}
                  <Button
                    onClick={playLetterSound}
                    className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-orange-500 hover:bg-orange-600 rounded-full w-12 h-12 p-0"
                  >
                    <Volume2 className="w-6 h-6 text-white" />
                  </Button>
                </motion.div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-800">
                    What sound does this letter make?
                  </h3>
                  <p className="text-gray-600">
                    Click on the pictures that start with the "{currentLetter.sound}" sound
                  </p>
                </div>

                {/* Hint Button */}
                {gameSettings.hintsEnabled && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={showHintForLetter}
                    className="border-yellow-300 text-yellow-600 hover:bg-yellow-50"
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Need a hint?
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent>
              {/* Answer Options */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                {currentLetter.words.map((word, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: selectedAnswer === null ? 1.05 : 1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={selectedAnswer !== null}
                    className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                      selectedAnswer === index
                        ? isCorrect
                          ? 'bg-green-100 border-green-500 shadow-lg'
                          : 'bg-red-100 border-red-500 shadow-lg'
                        : selectedAnswer !== null && word.isCorrect
                        ? 'bg-green-50 border-green-300'
                        : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
                    } ${gameSettings.accessibilityMode ? 'text-lg' : ''}`}
                  >
                    <div className="text-center space-y-2">
                      <div className="text-4xl">{word.image}</div>
                      <div className="font-semibold text-gray-800">{word.word}</div>
                    </div>

                    {/* Result Icons */}
                    {selectedAnswer === index && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2"
                      >
                        {isCorrect ? (
                          <CheckCircle className="w-8 h-8 text-green-600 bg-white rounded-full" />
                        ) : (
                          <XCircle className="w-8 h-8 text-red-600 bg-white rounded-full" />
                        )}
                      </motion.div>
                    )}

                    {/* Correct Answer Indicator */}
                    {selectedAnswer !== null && selectedAnswer !== index && word.isCorrect && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2"
                      >
                        <Star className="w-8 h-8 text-yellow-500 bg-white rounded-full p-1" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Feedback */}
              <AnimatePresence>
                {isCorrect !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`mt-6 text-center p-4 rounded-lg ${
                      isCorrect 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {isCorrect ? (
                      <div className="space-y-2">
                        <div className="text-2xl">🎉</div>
                        <div className="font-semibold">Excellent work!</div>
                        <div className="text-sm">
                          The letter {currentLetter.letter} makes the {currentLetter.sound} sound!
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-2xl">💪</div>
                        <div className="font-semibold">Good try!</div>
                        <div className="text-sm">
                          Look for words that start with the {currentLetter.sound} sound.
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hint Display */}
              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center"
                  >
                    <div className="flex items-center justify-center space-x-2 text-yellow-800">
                      <Lightbulb className="w-5 h-5" />
                      <span className="font-medium">
                        The letter "{currentLetter.letter}" sounds like "{currentLetter.sound}". 
                        Listen carefully and find words that begin with this sound!
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Game Stats */}
              <div className="mt-6 flex justify-center space-x-8 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{score}</div>
                  <div className="text-sm text-gray-500">Score</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{streak}</div>
                  <div className="text-sm text-gray-500">Streak</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(((currentLetterIndex + (isCorrect ? 1 : 0)) / letterData.length) * 100)}%
                  </div>
                  <div className="text-sm text-gray-500">Complete</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}