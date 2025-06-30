'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
  Target,
  Timer
} from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/providers/UserProvider';
import { toast } from 'sonner';
import Confetti from 'react-confetti';

interface WordData {
  id: string;
  word: string;
  syllables: string[];
  image: string;
  definition: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

interface DraggedSyllable {
  syllable: string;
  originalIndex: number;
  id: string;
}

interface GameSettings {
  difficulty: 'adaptive' | 'easy' | 'medium' | 'hard';
  soundEnabled: boolean;
  hintsEnabled: boolean;
  accessibilityMode: boolean;
  showDefinitions: boolean;
}

export default function WordBuilder() {
  const { user, addPoints, addAchievement } = useUser();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [shuffledSyllables, setShuffledSyllables] = useState<string[]>([]);
  const [assembledWord, setAssembledWord] = useState<string[]>([]);
  const [draggedItem, setDraggedItem] = useState<DraggedSyllable | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    difficulty: 'adaptive',
    soundEnabled: true,
    hintsEnabled: true,
    accessibilityMode: false,
    showDefinitions: true
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lives, setLives] = useState(3);
  const [gameComplete, setGameComplete] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Word data for building exercises
  const wordData: WordData[] = [
    {
      id: '1',
      word: 'butterfly',
      syllables: ['but', 'ter', 'fly'],
      image: '🦋',
      definition: 'A colorful flying insect with large wings',
      difficulty: 'medium',
      category: 'animals'
    },
    {
      id: '2',
      word: 'elephant',
      syllables: ['el', 'e', 'phant'],
      image: '🐘',
      definition: 'A large gray mammal with a long trunk',
      difficulty: 'easy',
      category: 'animals'
    },
    {
      id: '3',
      word: 'computer',
      syllables: ['com', 'pu', 'ter'],
      image: '💻',
      definition: 'An electronic device for processing information',
      difficulty: 'medium',
      category: 'technology'
    },
    {
      id: '4',
      word: 'rainbow',
      syllables: ['rain', 'bow'],
      image: '🌈',
      definition: 'A colorful arc in the sky after rain',
      difficulty: 'easy',
      category: 'nature'
    },
    {
      id: '5',
      word: 'telephone',
      syllables: ['tel', 'e', 'phone'],
      image: '📞',
      definition: 'A device used to talk to people far away',
      difficulty: 'medium',
      category: 'technology'
    },
    {
      id: '6',
      word: 'dinosaur',
      syllables: ['di', 'no', 'saur'],
      image: '🦕',
      definition: 'A large extinct reptile that lived long ago',
      difficulty: 'hard',
      category: 'animals'
    }
  ];

  const currentWord = wordData[currentWordIndex];

  // Initialize game
  useEffect(() => {
    initializeWord();
    setIsLoading(false);
  }, [currentWordIndex]);

  // Timer effect
  useEffect(() => {
    if (startTime && !gameComplete && isCorrect === null) {
      timerRef.current = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime, gameComplete, isCorrect]);

  const initializeWord = useCallback(() => {
    if (!currentWord) return;
    
    const shuffled = [...currentWord.syllables].sort(() => Math.random() - 0.5);
    setShuffledSyllables(shuffled);
    setAssembledWord([]);
    setIsCorrect(null);
    setShowHint(false);
    setStartTime(Date.now());
    setTimeSpent(0);
  }, [currentWord]);

  // Shuffle syllables
  const shuffleSyllables = () => {
    const shuffled = [...shuffledSyllables].sort(() => Math.random() - 0.5);
    setShuffledSyllables(shuffled);
    toast.info('Syllables shuffled!');
  };

  // Play word pronunciation
  const playWordSound = () => {
    if (!gameSettings.soundEnabled) return;
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentWord.word);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      speechSynthesis.speak(utterance);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, syllable: string, index: number, source: 'syllables' | 'assembled') => {
    const dragData: DraggedSyllable = {
      syllable,
      originalIndex: index,
      id: `${source}-${index}-${Date.now()}`
    };
    setDraggedItem(dragData);
    e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnAssembly = (e: React.DragEvent, targetIndex?: number) => {
    e.preventDefault();
    
    try {
      const dragDataStr = e.dataTransfer.getData('text/plain');
      const dragData: DraggedSyllable = JSON.parse(dragDataStr);
      
      if (targetIndex !== undefined) {
        // Insert at specific position
        const newAssembled = [...assembledWord];
        newAssembled.splice(targetIndex, 0, dragData.syllable);
        setAssembledWord(newAssembled);
      } else {
        // Add to end
        setAssembledWord([...assembledWord, dragData.syllable]);
      }

      // Remove from shuffled syllables if it came from there
      const syllableIndex = shuffledSyllables.indexOf(dragData.syllable);
      if (syllableIndex !== -1) {
        const newShuffled = shuffledSyllables.filter((_, index) => index !== syllableIndex);
        setShuffledSyllables(newShuffled);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
      toast.error('Something went wrong. Please try again.');
    }
    
    setDraggedItem(null);
  };

  const handleDropOnSyllables = (e: React.DragEvent) => {
    e.preventDefault();
    
    try {
      const dragDataStr = e.dataTransfer.getData('text/plain');
      const dragData: DraggedSyllable = JSON.parse(dragDataStr);
      
      // Remove from assembled word and add back to syllables
      const newAssembled = assembledWord.filter(syl => syl !== dragData.syllable);
      setAssembledWord(newAssembled);
      setShuffledSyllables([...shuffledSyllables, dragData.syllable]);
    } catch (error) {
      console.error('Error handling drop:', error);
    }
    
    setDraggedItem(null);
  };

  // Touch handlers for mobile
  const handleTouchStart = (syllable: string, index: number, source: 'syllables' | 'assembled') => {
    const dragData: DraggedSyllable = {
      syllable,
      originalIndex: index,
      id: `${source}-${index}-${Date.now()}`
    };
    setDraggedItem(dragData);
  };

  const handleSyllableClick = (syllable: string, source: 'syllables' | 'assembled') => {
    if (source === 'syllables') {
      // Move to assembled word
      setAssembledWord([...assembledWord, syllable]);
      const newShuffled = shuffledSyllables.filter(syl => syl !== syllable);
      setShuffledSyllables(newShuffled);
    } else {
      // Move back to syllables
      const newAssembled = assembledWord.filter(syl => syl !== syllable);
      setAssembledWord(newAssembled);
      setShuffledSyllables([...shuffledSyllables, syllable]);
    }
  };

  // Check if word is correct
  const checkWord = () => {
    const assembledString = assembledWord.join('');
    const correctString = currentWord.syllables.join('');
    const correct = assembledString.toLowerCase() === correctString.toLowerCase();
    
    setIsCorrect(correct);

    if (correct) {
      const timeBonus = Math.max(0, 30 - timeSpent) * 2; // Bonus for speed
      const points = 20 + timeBonus;
      
      setScore(score + points);
      setStreak(streak + 1);
      addPoints(points);
      
      if (streak >= 2) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        toast.success('Amazing streak! Bonus points!');
        addPoints(10);
      }
      
      toast.success(`Excellent! You built "${currentWord.word}" correctly! +${points} points`);
      
      // Check for achievements
      if (timeSpent <= 15) {
        addAchievement('Speed Builder');
        toast.success('Achievement unlocked: Speed Builder! 🏆');
      }
    } else {
      setStreak(0);
      setLives(lives - 1);
      
      if (lives <= 1) {
        toast.error('Game Over! Let\'s try again.');
        resetGame();
        return;
      }
      
      toast.error('Not quite right. Try rearranging the syllables!');
    }

    // Auto-advance after delay
    setTimeout(() => {
      if (correct) {
        nextWord();
      } else {
        setIsCorrect(null);
        if (gameSettings.hintsEnabled) {
          setShowHint(true);
        }
      }
    }, 2500);
  };

  // Move to next word
  const nextWord = () => {
    if (currentWordIndex >= wordData.length - 1) {
      setGameComplete(true);
      setShowConfetti(true);
      toast.success('Congratulations! You completed all words!');
      addPoints(100);
      addAchievement('Word Master');
      return;
    }

    setCurrentWordIndex(currentWordIndex + 1);
  };

  // Reset game
  const resetGame = () => {
    setCurrentWordIndex(0);
    setScore(0);
    setStreak(0);
    setLives(3);
    setGameComplete(false);
    initializeWord();
  };

  // Reset current word
  const resetCurrentWord = () => {
    initializeWord();
    toast.info('Word reset!');
  };

  // Show hint
  const showHintForWord = () => {
    setShowHint(true);
    toast.info(`Hint: The word "${currentWord.word}" means "${currentWord.definition}"`);
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
          <p className="text-gray-600">Preparing word building game...</p>
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
              Word Master! 🎉
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-lg text-gray-600">
              You built all the words perfectly!
            </div>
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{score}</div>
                <div className="text-sm text-gray-500">Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{wordData.length}</div>
                <div className="text-sm text-gray-500">Words</div>
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
      {showConfetti && showConfetti}
      
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
              <h1 className="text-xl font-bold text-gray-800">Word Builder</h1>
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
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-gray-600">
              {currentWordIndex + 1} of {wordData.length}
            </span>
          </div>
          <Progress 
            value={((currentWordIndex + 1) / wordData.length) * 100} 
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
                {/* Word Image and Info */}
                <motion.div
                  key={currentWord.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="space-y-4"
                >
                  <div className="text-8xl mb-4" role="img" aria-label={currentWord.word}>
                    {currentWord.image}
                  </div>
                  
                  {gameSettings.showDefinitions && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-blue-800 font-medium">{currentWord.definition}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-center space-x-4">
                    <Button
                      onClick={playWordSound}
                      className="bg-orange-500 hover:bg-orange-600"
                      aria-label={`Hear pronunciation of ${currentWord.word}`}
                    >
                      <Volume2 className="w-4 h-4 mr-2" />
                      Hear Word
                    </Button>
                    
                    <Button
                      onClick={shuffleSyllables}
                      variant="outline"
                      className="border-purple-200 text-purple-600 hover:bg-purple-50"
                      aria-label="Shuffle syllables"
                    >
                      <Shuffle className="w-4 h-4 mr-2" />
                      Shuffle
                    </Button>
                  </div>
                </motion.div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Build the word by arranging the syllables
                  </h3>
                  <p className="text-gray-600">
                    Drag and drop the syllables in the correct order
                  </p>
                </div>

                {/* Hint Button */}
                {gameSettings.hintsEnabled && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={showHintForWord}
                    className="border-yellow-300 text-yellow-600 hover:bg-yellow-50"
                    aria-label="Get a hint"
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Need a hint?
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* Assembly Area */}
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <h4 className="text-lg font-semibold text-gray-800">Build Your Word Here</h4>
                </div>
                
                <div
                  ref={dropZoneRef}
                  onDrop={handleDropOnAssembly}
                  onDragOver={handleDragOver}
                  className={`min-h-20 border-2 border-dashed rounded-xl p-4 transition-all duration-300 ${
                    assembledWord.length > 0 
                      ? 'border-blue-400 bg-blue-50' 
                      : 'border-gray-300 bg-gray-50'
                  } ${draggedItem ? 'border-blue-500 bg-blue-100' : ''}`}
                  role="region"
                  aria-label="Word assembly area"
                >
                  {assembledWord.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">
                      <p className="text-lg">Drop syllables here to build the word</p>
                      <p className="text-sm">Or click syllables below to add them</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap justify-center gap-2">
                      {assembledWord.map((syllable, index) => (
                        <motion.div
                          key={`assembled-${index}`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="relative"
                        >
                          <div
                            draggable
                            onDragStart={(e) => handleDragStart(e, syllable, index, 'assembled')}
                            onClick={() => handleSyllableClick(syllable, 'assembled')}
                            className="bg-blue-500 text-white px-4 py-3 rounded-lg font-bold text-lg cursor-move hover:bg-blue-600 transition-colors shadow-md"
                            role="button"
                            tabIndex={0}
                            aria-label={`Syllable ${syllable}, click to remove`}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                handleSyllableClick(syllable, 'assembled');
                              }
                            }}
                          >
                            {syllable}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={checkWord}
                    disabled={assembledWord.length === 0}
                    className="bg-green-500 hover:bg-green-600 disabled:opacity-50"
                    aria-label="Check if word is correct"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Check Word
                  </Button>
                  
                  <Button
                    onClick={resetCurrentWord}
                    variant="outline"
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                    aria-label="Reset current word"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>

              {/* Available Syllables */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800 text-center">Available Syllables</h4>
                
                <div
                  onDrop={handleDropOnSyllables}
                  onDragOver={handleDragOver}
                  className="flex flex-wrap justify-center gap-3 min-h-16 p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50"
                  role="region"
                  aria-label="Available syllables"
                >
                  {shuffledSyllables.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">
                      <p>All syllables are being used!</p>
                    </div>
                  ) : (
                    shuffledSyllables.map((syllable, index) => (
                      <motion.div
                        key={`syllable-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div
                          draggable
                          onDragStart={(e) => handleDragStart(e, syllable, index, 'syllables')}
                          onClick={() => handleSyllableClick(syllable, 'syllables')}
                          className="bg-purple-500 text-white px-4 py-3 rounded-lg font-bold text-lg cursor-move hover:bg-purple-600 transition-colors shadow-md"
                          role="button"
                          tabIndex={0}
                          aria-label={`Syllable ${syllable}, click to add to word`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              handleSyllableClick(syllable, 'syllables');
                            }
                          }}
                        >
                          {syllable}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              {/* Feedback */}
              <AnimatePresence>
                {isCorrect !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`text-center p-6 rounded-lg ${
                      isCorrect 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {isCorrect ? (
                      <div className="space-y-2">
                        <div className="text-4xl">🎉</div>
                        <div className="text-xl font-semibold">Perfect! You built "{currentWord.word}"!</div>
                        <div className="text-sm">
                          Time: {timeSpent}s | Points earned: {20 + Math.max(0, 30 - timeSpent) * 2}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-4xl">💪</div>
                        <div className="text-xl font-semibold">Good try!</div>
                        <div className="text-sm">
                          Try rearranging the syllables. The word should be "{currentWord.syllables.join('-')}"
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
                    className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center"
                  >
                    <div className="flex items-center justify-center space-x-2 text-yellow-800">
                      <Lightbulb className="w-5 h-5" />
                      <span className="font-medium">
                        The word "{currentWord.word}" is broken into: {currentWord.syllables.join(' - ')}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Game Stats */}
              <div className="flex justify-center space-x-8 text-center pt-4 border-t border-gray-200">
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
                    {Math.round(((currentWordIndex + (isCorrect ? 1 : 0)) / wordData.length) * 100)}%
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