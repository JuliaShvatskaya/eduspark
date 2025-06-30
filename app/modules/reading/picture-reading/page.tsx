'use client';

import { useState, useEffect, useCallback } from 'react';
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
  Shuffle,
  Timer,
  Eye,
  Target
} from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/providers/UserProvider';
import { toast } from 'sonner';
import Confetti from 'react-confetti';

interface PictureWordPair {
  id: string;
  word: string;
  image: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  pronunciation?: string;
}

interface MatchingExercise {
  id: string;
  title: string;
  description: string;
  pairs: PictureWordPair[];
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

interface GameSettings {
  difficulty: 'adaptive' | 'easy' | 'medium' | 'hard';
  soundEnabled: boolean;
  hintsEnabled: boolean;
  accessibilityMode: boolean;
  showCategories: boolean;
  autoAdvance: boolean;
}

interface SelectedItem {
  type: 'image' | 'word';
  id: string;
  index: number;
}

interface Match {
  imageId: string;
  wordId: string;
  isCorrect: boolean;
  timestamp: number;
}

export default function PictureWords() {
  const { user, addPoints, addAchievement } = useUser();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<SelectedItem | null>(null);
  const [selectedWord, setSelectedWord] = useState<SelectedItem | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [shuffledImages, setShuffledImages] = useState<PictureWordPair[]>([]);
  const [shuffledWords, setShuffledWords] = useState<PictureWordPair[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [showHint, setShowHint] = useState(false);
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    difficulty: 'adaptive',
    soundEnabled: true,
    hintsEnabled: true,
    accessibilityMode: false,
    showCategories: false,
    autoAdvance: true
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [exerciseComplete, setExerciseComplete] = useState(false);

  // Exercise data with picture-word pairs
  const exercises: MatchingExercise[] = [
    {
      id: 'animals-basic',
      title: 'Animal Friends',
      description: 'Match animals with their names',
      difficulty: 'easy',
      category: 'animals',
      pairs: [
        { id: 'cat', word: 'Cat', image: '🐱', category: 'animals', difficulty: 'easy', pronunciation: '/kæt/' },
        { id: 'dog', word: 'Dog', image: '🐕', category: 'animals', difficulty: 'easy', pronunciation: '/dɔg/' },
        { id: 'bird', word: 'Bird', image: '🐦', category: 'animals', difficulty: 'easy', pronunciation: '/bɜrd/' },
        { id: 'fish', word: 'Fish', image: '🐟', category: 'animals', difficulty: 'easy', pronunciation: '/fɪʃ/' },
        { id: 'rabbit', word: 'Rabbit', image: '🐰', category: 'animals', difficulty: 'medium', pronunciation: '/ˈræbɪt/' },
        { id: 'elephant', word: 'Elephant', image: '🐘', category: 'animals', difficulty: 'medium', pronunciation: '/ˈɛləfənt/' }
      ]
    },
    {
      id: 'food-items',
      title: 'Yummy Foods',
      description: 'Match foods with their names',
      difficulty: 'easy',
      category: 'food',
      pairs: [
        { id: 'apple', word: 'Apple', image: '🍎', category: 'food', difficulty: 'easy', pronunciation: '/ˈæpəl/' },
        { id: 'banana', word: 'Banana', image: '🍌', category: 'food', difficulty: 'easy', pronunciation: '/bəˈnænə/' },
        { id: 'pizza', word: 'Pizza', image: '🍕', category: 'food', difficulty: 'easy', pronunciation: '/ˈpitsə/' },
        { id: 'cake', word: 'Cake', image: '🎂', category: 'food', difficulty: 'easy', pronunciation: '/keɪk/' },
        { id: 'sandwich', word: 'Sandwich', image: '🥪', category: 'food', difficulty: 'medium', pronunciation: '/ˈsænwɪtʃ/' },
        { id: 'hamburger', word: 'Hamburger', image: '🍔', category: 'food', difficulty: 'medium', pronunciation: '/ˈhæmbɜrgər/' }
      ]
    },
    {
      id: 'transportation',
      title: 'Getting Around',
      description: 'Match vehicles with their names',
      difficulty: 'medium',
      category: 'transportation',
      pairs: [
        { id: 'car', word: 'Car', image: '🚗', category: 'transportation', difficulty: 'easy', pronunciation: '/kɑr/' },
        { id: 'bus', word: 'Bus', image: '🚌', category: 'transportation', difficulty: 'easy', pronunciation: '/bʌs/' },
        { id: 'airplane', word: 'Airplane', image: '✈️', category: 'transportation', difficulty: 'medium', pronunciation: '/ˈɛrˌpleɪn/' },
        { id: 'bicycle', word: 'Bicycle', image: '🚲', category: 'transportation', difficulty: 'medium', pronunciation: '/ˈbaɪsɪkəl/' },
        { id: 'helicopter', word: 'Helicopter', image: '🚁', category: 'transportation', difficulty: 'hard', pronunciation: '/ˈhɛlɪˌkɑptər/' },
        { id: 'motorcycle', word: 'Motorcycle', image: '🏍️', category: 'transportation', difficulty: 'hard', pronunciation: '/ˈmoʊtərˌsaɪkəl/' }
      ]
    }
  ];

  const currentExercise = exercises[currentExerciseIndex];

  // Initialize exercise
  useEffect(() => {
    initializeExercise();
    setIsLoading(false);
  }, [currentExerciseIndex]);

  // Timer effect
  useEffect(() => {
    if (startTime && !exerciseComplete && !gameComplete) {
      const timer = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [startTime, exerciseComplete, gameComplete]);

  const initializeExercise = useCallback(() => {
    if (!currentExercise) return;
    
    const shuffledImgs = [...currentExercise.pairs].sort(() => Math.random() - 0.5);
    const shuffledWrds = [...currentExercise.pairs].sort(() => Math.random() - 0.5);
    
    setShuffledImages(shuffledImgs);
    setShuffledWords(shuffledWrds);
    setMatches([]);
    setSelectedImage(null);
    setSelectedWord(null);
    setShowHint(false);
    setExerciseComplete(false);
    setStartTime(Date.now());
    setTimeSpent(0);
  }, [currentExercise]);

  // Shuffle items
  const shuffleItems = () => {
    const shuffledImgs = [...shuffledImages].sort(() => Math.random() - 0.5);
    const shuffledWrds = [...shuffledWords].sort(() => Math.random() - 0.5);
    setShuffledImages(shuffledImgs);
    setShuffledWords(shuffledWrds);
    toast.info('Items shuffled!');
  };

  // Play word pronunciation
  const playWordSound = (word: string, pronunciation?: string) => {
    if (!gameSettings.soundEnabled) return;
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      speechSynthesis.speak(utterance);
    }
  };

  // Handle image selection
  const handleImageSelect = (pair: PictureWordPair, index: number) => {
    // Check if already matched
    const isMatched = matches.some(match => match.imageId === pair.id);
    if (isMatched) return;

    const newSelection: SelectedItem = { type: 'image', id: pair.id, index };
    setSelectedImage(newSelection);

    // If word is already selected, attempt match
    if (selectedWord) {
      attemptMatch(newSelection, selectedWord);
    }
  };

  // Handle word selection
  const handleWordSelect = (pair: PictureWordPair, index: number) => {
    // Check if already matched
    const isMatched = matches.some(match => match.wordId === pair.id);
    if (isMatched) return;

    const newSelection: SelectedItem = { type: 'word', id: pair.id, index };
    setSelectedWord(newSelection);

    // Play word sound
    playWordSound(pair.word, pair.pronunciation);

    // If image is already selected, attempt match
    if (selectedImage) {
      attemptMatch(selectedImage, newSelection);
    }
  };

  // Attempt to match selected items
  const attemptMatch = (imageSelection: SelectedItem, wordSelection: SelectedItem) => {
    const isCorrect = imageSelection.id === wordSelection.id;
    
    const newMatch: Match = {
      imageId: imageSelection.id,
      wordId: wordSelection.id,
      isCorrect,
      timestamp: Date.now()
    };

    setMatches(prev => [...prev, newMatch]);

    if (isCorrect) {
      const timeBonus = Math.max(0, 10 - timeSpent) * 2;
      const points = 15 + timeBonus;
      
      setScore(score + points);
      setStreak(streak + 1);
      addPoints(points);
      
      if (streak >= 4) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        toast.success('Amazing streak! Bonus points!');
        addPoints(10);
      }
      
      toast.success(`Perfect match! +${points} points`);
      
      // Check if exercise is complete
      const totalMatches = matches.filter(m => m.isCorrect).length + 1;
      if (totalMatches >= currentExercise.pairs.length) {
        setExerciseComplete(true);
        addPoints(25); // Completion bonus
        
        if (timeSpent <= 30) {
          addAchievement('Speed Matcher');
          toast.success('Achievement unlocked: Speed Matcher! 🏆');
        }
        
        setTimeout(() => {
          if (gameSettings.autoAdvance) {
            nextExercise();
          }
        }, 2000);
      }
    } else {
      setStreak(0);
      setLives(lives - 1);
      
      if (lives <= 1) {
        toast.error('Game Over! Let\'s try again.');
        resetGame();
        return;
      }
      
      toast.error('Not a match. Try again!');
      
      // Remove incorrect match after delay
      setTimeout(() => {
        setMatches(prev => prev.filter(m => m.timestamp !== newMatch.timestamp));
      }, 1500);
    }

    // Clear selections
    setSelectedImage(null);
    setSelectedWord(null);
  };

  // Move to next exercise
  const nextExercise = () => {
    if (currentExerciseIndex >= exercises.length - 1) {
      setGameComplete(true);
      setShowConfetti(true);
      toast.success('Congratulations! You completed all exercises!');
      addPoints(100);
      addAchievement('Picture Word Master');
      return;
    }

    setCurrentExerciseIndex(currentExerciseIndex + 1);
  };

  // Reset game
  const resetGame = () => {
    setCurrentExerciseIndex(0);
    setScore(0);
    setStreak(0);
    setLives(3);
    setGameComplete(false);
    initializeExercise();
  };

  // Reset current exercise
  const resetCurrentExercise = () => {
    initializeExercise();
    toast.info('Exercise reset!');
  };

  // Show hint
  const showHintForExercise = () => {
    setShowHint(true);
    const unmatched = currentExercise.pairs.filter(pair => 
      !matches.some(match => match.imageId === pair.id && match.isCorrect)
    );
    
    if (unmatched.length > 0) {
      const hintPair = unmatched[0];
      toast.info(`Hint: Look for the ${hintPair.category} that matches "${hintPair.word}"`);
    }
  };

  // Check if item is matched
  const isItemMatched = (id: string) => {
    return matches.some(match => 
      (match.imageId === id || match.wordId === id) && match.isCorrect
    );
  };

  // Check if item is incorrectly matched
  const isItemIncorrectlyMatched = (id: string) => {
    return matches.some(match => 
      (match.imageId === id || match.wordId === id) && !match.isCorrect
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing picture matching game...</p>
        </div>
      </div>
    );
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
              Picture Word Master! 🎉
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-lg text-gray-600">
              You matched all the pictures and words perfectly!
            </div>
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{score}</div>
                <div className="text-sm text-gray-500">Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{exercises.length}</div>
                <div className="text-sm text-gray-500">Exercises</div>
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
              <h1 className="text-xl font-bold text-gray-800">Picture Words</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                aria-label="Game settings"
              >
                <Settings className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <Timer className="w-4 h-4 text-blue-500" />
                <span className="font-semibold">{timeSpent}s</span>
              </div>
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
            <span className="text-sm font-medium">Exercise Progress</span>
            <span className="text-sm text-gray-600">
              {currentExerciseIndex + 1} of {exercises.length}
            </span>
          </div>
          <Progress 
            value={((currentExerciseIndex + 1) / exercises.length) * 100} 
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

        {/* Exercise Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-800">
                {currentExercise.title}
              </CardTitle>
              <p className="text-gray-600">{currentExercise.description}</p>
              
              <div className="flex items-center justify-center space-x-4 mt-4">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {currentExercise.category}
                </Badge>
                <Badge variant="outline">
                  {currentExercise.difficulty}
                </Badge>
                <div className="text-sm text-gray-600">
                  {matches.filter(m => m.isCorrect).length} / {currentExercise.pairs.length} matched
                </div>
              </div>

              <div className="flex items-center justify-center space-x-4 mt-4">
                <Button
                  onClick={shuffleItems}
                  variant="outline"
                  size="sm"
                  className="border-purple-200 text-purple-600 hover:bg-purple-50"
                  aria-label="Shuffle items"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  Shuffle
                </Button>
                
                {gameSettings.hintsEnabled && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={showHintForExercise}
                    className="border-yellow-300 text-yellow-600 hover:bg-yellow-50"
                    aria-label="Get a hint"
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Hint
                  </Button>
                )}

                <Button
                  onClick={resetCurrentExercise}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                  aria-label="Reset exercise"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Main Game Area */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Images Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg h-full">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center space-x-2">
                  <Eye className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-lg font-bold text-gray-800">Pictures</CardTitle>
                </div>
                <p className="text-sm text-gray-600">Click on a picture to select it</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {shuffledImages.map((pair, index) => {
                    const isMatched = isItemMatched(pair.id);
                    const isIncorrect = isItemIncorrectlyMatched(pair.id);
                    const isSelected = selectedImage?.id === pair.id;
                    
                    return (
                      <motion.button
                        key={`image-${pair.id}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: isMatched ? 1 : 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleImageSelect(pair, index)}
                        disabled={isMatched}
                        className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                          isMatched
                            ? 'bg-green-100 border-green-500 cursor-default'
                            : isIncorrect
                            ? 'bg-red-100 border-red-500'
                            : isSelected
                            ? 'bg-blue-100 border-blue-500 ring-2 ring-blue-300'
                            : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
                        } ${gameSettings.accessibilityMode ? 'text-lg' : ''}`}
                        aria-label={`Picture of ${pair.word}`}
                        role="button"
                        tabIndex={isMatched ? -1 : 0}
                      >
                        <div className="text-center space-y-2">
                          <div className="text-6xl" role="img" aria-label={pair.word}>
                            {pair.image}
                          </div>
                          {gameSettings.showCategories && (
                            <div className="text-xs text-gray-500 capitalize">
                              {pair.category}
                            </div>
                          )}
                        </div>

                        {/* Status Icons */}
                        {isMatched && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2"
                          >
                            <CheckCircle className="w-8 h-8 text-green-600 bg-white rounded-full" />
                          </motion.div>
                        )}

                        {isIncorrect && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2"
                          >
                            <XCircle className="w-8 h-8 text-red-600 bg-white rounded-full" />
                          </motion.div>
                        )}

                        {isSelected && !isMatched && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2"
                          >
                            <Target className="w-8 h-8 text-blue-600 bg-white rounded-full p-1" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Words Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg h-full">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center space-x-2">
                  <Volume2 className="w-5 h-5 text-purple-600" />
                  <CardTitle className="text-lg font-bold text-gray-800">Words</CardTitle>
                </div>
                <p className="text-sm text-gray-600">Click on a word to select it and hear it</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {shuffledWords.map((pair, index) => {
                    const isMatched = isItemMatched(pair.id);
                    const isIncorrect = isItemIncorrectlyMatched(pair.id);
                    const isSelected = selectedWord?.id === pair.id;
                    
                    return (
                      <motion.button
                        key={`word-${pair.id}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: isMatched ? 1 : 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleWordSelect(pair, index)}
                        disabled={isMatched}
                        className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                          isMatched
                            ? 'bg-green-100 border-green-500 cursor-default'
                            : isIncorrect
                            ? 'bg-red-100 border-red-500'
                            : isSelected
                            ? 'bg-purple-100 border-purple-500 ring-2 ring-purple-300'
                            : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-md'
                        } ${gameSettings.accessibilityMode ? 'text-lg' : ''}`}
                        aria-label={`Word: ${pair.word}`}
                        role="button"
                        tabIndex={isMatched ? -1 : 0}
                      >
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="text-xl font-bold text-gray-800">
                              {pair.word}
                            </div>
                            {gameSettings.accessibilityMode && pair.pronunciation && (
                              <div className="text-sm text-gray-500">
                                {pair.pronunciation}
                              </div>
                            )}
                            {gameSettings.showCategories && (
                              <div className="text-xs text-gray-500 capitalize">
                                {pair.category}
                              </div>
                            )}
                          </div>
                          
                          <Volume2 className="w-5 h-5 text-gray-400" />
                        </div>

                        {/* Status Icons */}
                        {isMatched && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2"
                          >
                            <CheckCircle className="w-8 h-8 text-green-600 bg-white rounded-full" />
                          </motion.div>
                        )}

                        {isIncorrect && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2"
                          >
                            <XCircle className="w-8 h-8 text-red-600 bg-white rounded-full" />
                          </motion.div>
                        )}

                        {isSelected && !isMatched && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2"
                          >
                            <Target className="w-8 h-8 text-purple-600 bg-white rounded-full p-1" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Exercise Complete Message */}
        <AnimatePresence>
          {exerciseComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8"
            >
              <Card className="bg-gradient-to-r from-green-100 to-blue-100 border-0 shadow-lg">
                <CardContent className="text-center p-6">
                  <div className="space-y-4">
                    <div className="text-4xl">🎉</div>
                    <div className="text-xl font-bold text-gray-800">
                      Exercise Complete!
                    </div>
                    <div className="text-gray-600">
                      You matched all {currentExercise.pairs.length} pairs correctly!
                    </div>
                    <div className="text-sm text-gray-500">
                      Time: {timeSpent}s | Points earned: {25 + (Math.max(0, 10 - timeSpent) * 2)}
                    </div>
                    {!gameSettings.autoAdvance && (
                      <Button
                        onClick={nextExercise}
                        className="bg-gradient-to-r from-green-500 to-blue-600"
                      >
                        Next Exercise
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
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
              className="mt-8"
            >
              <Card className="bg-yellow-50 border border-yellow-200">
                <CardContent className="text-center p-4">
                  <div className="flex items-center justify-center space-x-2 text-yellow-800">
                    <Lightbulb className="w-5 h-5" />
                    <span className="font-medium">
                      Look carefully at the pictures and listen to the words. 
                      Match items that go together!
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-center space-x-8 text-center">
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
                    {Math.round((matches.filter(m => m.isCorrect).length / currentExercise.pairs.length) * 100)}%
                  </div>
                  <div className="text-sm text-gray-500">Complete</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">{timeSpent}s</div>
                  <div className="text-sm text-gray-500">Time</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}