'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  RotateCcw,
  Trophy,
  Timer,
  Target,
  Star,
  Home,
  Settings,
  Volume2,
  Pause,
  Play,
  SkipForward,
  Brain,
  Zap,
  Heart,
  Award,
  CheckCircle,
  XCircle,
  Lightbulb
} from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/providers/UserProvider';
import { toast } from 'sonner';
import Confetti from 'react-confetti';

interface GameCard {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
  pairId: number;
  category: string;
  color: string;
}

interface GameSettings {
  gridSize: '4x3' | '4x4' | '6x4' | '6x6';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  theme: 'animals' | 'fruits' | 'shapes' | 'numbers' | 'letters' | 'mixed';
  timeLimit: number; // in seconds, 0 for no limit
  soundEnabled: boolean;
  hintsEnabled: boolean;
  autoFlip: boolean;
}

interface GameStats {
  moves: number;
  matches: number;
  timeElapsed: number;
  gameStarted: boolean;
  gameComplete: boolean;
  perfectMatches: number;
  hintsUsed: number;
  bestTime: number;
  streak: number;
}

interface CardTheme {
  [key: string]: {
    symbols: string[];
    colors: string[];
    name: string;
  };
}

export default function MemoryMatchGame() {
  const { user, addPoints, addAchievement } = useUser();
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gameStats, setGameStats] = useState<GameStats>({
    moves: 0,
    matches: 0,
    timeElapsed: 0,
    gameStarted: false,
    gameComplete: false,
    perfectMatches: 0,
    hintsUsed: 0,
    bestTime: 0,
    streak: 0
  });
  const [settings, setSettings] = useState<GameSettings>({
    gridSize: '4x3',
    difficulty: 'easy',
    theme: 'animals',
    timeLimit: 0,
    soundEnabled: true,
    hintsEnabled: true,
    autoFlip: false
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintPair, setHintPair] = useState<number[]>([]);

  const cardThemes: CardTheme = {
    animals: {
      symbols: ['🐶', '🐱', '🐰', '🦊', '🐻', '🐼', '🐸', '🐨', '🦁', '🐯', '🐵', '🐺', '🐷', '🐮', '🐭', '🐹', '🐧', '🦉'],
      colors: ['bg-green-100', 'bg-blue-100', 'bg-yellow-100', 'bg-purple-100', 'bg-pink-100', 'bg-indigo-100'],
      name: 'Animals'
    },
    fruits: {
      symbols: ['🍎', '🍌', '🍊', '🍇', '🍓', '🥝', '🍑', '🍒', '🥭', '🍍', '🥥', '🍈', '🍉', '🍋', '🥑', '🍅', '🥕', '🌽'],
      colors: ['bg-red-100', 'bg-orange-100', 'bg-yellow-100', 'bg-green-100', 'bg-purple-100', 'bg-pink-100'],
      name: 'Fruits & Vegetables'
    },
    shapes: {
      symbols: ['⭐', '🔵', '🔺', '⬜', '🔶', '💎', '🔸', '🔹', '⬛', '🟠', '🟡', '🟢', '🔴', '🟣', '🟤', '⚫', '⚪', '🔘'],
      colors: ['bg-gray-100', 'bg-slate-100', 'bg-zinc-100', 'bg-neutral-100', 'bg-stone-100', 'bg-red-100'],
      name: 'Shapes & Colors'
    },
    numbers: {
      symbols: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '0️⃣', '💯', '🔢', '➕', '➖', '✖️', '➗', '🟰'],
      colors: ['bg-blue-100', 'bg-indigo-100', 'bg-violet-100', 'bg-purple-100', 'bg-fuchsia-100', 'bg-pink-100'],
      name: 'Numbers & Math'
    },
    letters: {
      symbols: ['🅰️', '🅱️', '🆎', '🅾️', '🆘', '🔤', '🔡', '🔠', '📝', '📖', '📚', '✏️', '🖊️', '🖋️', '🖍️', '📄', '📃', '📑'],
      colors: ['bg-emerald-100', 'bg-teal-100', 'bg-cyan-100', 'bg-sky-100', 'bg-blue-100', 'bg-indigo-100'],
      name: 'Letters & Writing'
    },
    mixed: {
      symbols: ['🌟', '🎈', '🎁', '🎂', '🎵', '⚽', '🏀', '🎯', '🎨', '🧩', '🎪', '🎭', '🎬', '🎮', '🧸', '🪀', '🎲', '🃏'],
      colors: ['bg-rainbow-100', 'bg-gradient-to-br from-pink-100 to-purple-100', 'bg-gradient-to-br from-blue-100 to-green-100'],
      name: 'Fun & Games'
    }
  };

  const gridConfigs = {
    '4x3': { cols: 4, rows: 3, totalCards: 12, difficulty: 'easy' },
    '4x4': { cols: 4, rows: 4, totalCards: 16, difficulty: 'medium' },
    '6x4': { cols: 6, rows: 4, totalCards: 24, difficulty: 'hard' },
    '6x6': { cols: 6, rows: 6, totalCards: 36, difficulty: 'expert' }
  };

  // Initialize game
  const initializeGame = useCallback(() => {
    const config = gridConfigs[settings.gridSize];
    const theme = cardThemes[settings.theme];
    const totalPairs = config.totalCards / 2;
    
    // Create pairs of cards
    const gameCards: GameCard[] = [];
    for (let i = 0; i < totalPairs; i++) {
      const symbol = theme.symbols[i % theme.symbols.length];
      const color = theme.colors[i % theme.colors.length];
      
      // Add two cards for each symbol (a pair)
      gameCards.push(
        {
          id: i * 2,
          symbol,
          isFlipped: false,
          isMatched: false,
          pairId: i,
          category: settings.theme,
          color
        },
        {
          id: i * 2 + 1,
          symbol,
          isFlipped: false,
          isMatched: false,
          pairId: i,
          category: settings.theme,
          color
        }
      );
    }
    
    // Shuffle the cards
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setIsProcessing(false);
    setGameStats({
      moves: 0,
      matches: 0,
      timeElapsed: 0,
      gameStarted: false,
      gameComplete: false,
      perfectMatches: 0,
      hintsUsed: 0,
      bestTime: 0,
      streak: 0
    });
    setStartTime(null);
    setShowConfetti(false);
    setIsPaused(false);
    setShowHint(false);
    setHintPair([]);
  }, [settings]);

  // Initialize game on component mount and settings change
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameStats.gameStarted && !gameStats.gameComplete && !isPaused && startTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setGameStats(prev => ({ ...prev, timeElapsed: elapsed }));
        
        // Check time limit
        if (settings.timeLimit > 0 && elapsed >= settings.timeLimit) {
          toast.error('Time\'s up! Game over.');
          setGameStats(prev => ({ ...prev, gameComplete: true }));
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameStats.gameStarted, gameStats.gameComplete, isPaused, startTime, settings.timeLimit]);

  // Handle card click
  const handleCardClick = useCallback((cardId: number) => {
    // Prevent clicking during processing or if game is paused
    if (isProcessing || isPaused || gameStats.gameComplete) return;
    
    // Prevent clicking already matched or flipped cards
    const targetCard = cards.find(c => c.id === cardId);
    if (!targetCard || targetCard.isMatched || targetCard.isFlipped) return;
    
    // Prevent clicking more than 2 cards
    if (flippedCards.length >= 2) return;
    
    // Start game timer on first card click
    if (!gameStats.gameStarted) {
      setStartTime(Date.now());
      setGameStats(prev => ({ ...prev, gameStarted: true }));
    }

    // Flip the card
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Play flip sound
    if (settings.soundEnabled) {
      playSound('flip');
    }

    // Check for match when two cards are flipped
    if (newFlippedCards.length === 2) {
      setIsProcessing(true);
      
      const [firstCardId, secondCardId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstCardId);
      const secondCard = cards.find(c => c.id === secondCardId);

      // Increment moves counter
      setGameStats(prev => ({ ...prev, moves: prev.moves + 1 }));

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        // Match found!
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstCardId || c.id === secondCardId 
              ? { ...c, isMatched: true }
              : c
          ));
          
          setGameStats(prev => ({ 
            ...prev, 
            matches: prev.matches + 1,
            perfectMatches: prev.moves === prev.matches ? prev.perfectMatches + 1 : prev.perfectMatches,
            streak: prev.streak + 1
          }));
          
          setFlippedCards([]);
          setIsProcessing(false);
          
          // Play success sound
          if (settings.soundEnabled) {
            playSound('match');
          }
          
          // Check if game is complete
          const totalPairs = gridConfigs[settings.gridSize].totalCards / 2;
          if (gameStats.matches + 1 >= totalPairs) {
            completeGame();
          } else {
            toast.success('Great match! 🎉');
          }
        }, 1000);
      } else {
        // No match - flip cards back
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstCardId || c.id === secondCardId 
              ? { ...c, isFlipped: false }
              : c
          ));
          
          setFlippedCards([]);
          setIsProcessing(false);
          setGameStats(prev => ({ ...prev, streak: 0 }));
          
          // Play miss sound
          if (settings.soundEnabled) {
            playSound('miss');
          }
        }, 1000);
      }
    }
  }, [cards, flippedCards, isProcessing, isPaused, gameStats, settings, gridConfigs]);

  // Complete game
  const completeGame = useCallback(() => {
    setGameStats(prev => ({ ...prev, gameComplete: true }));
    setShowConfetti(true);
    
    // Calculate score based on performance
    const totalPairs = gridConfigs[settings.gridSize].totalCards / 2;
    const timeBonus = settings.timeLimit > 0 ? Math.max(0, settings.timeLimit - gameStats.timeElapsed) * 2 : 0;
    const moveBonus = Math.max(0, (totalPairs * 2 - gameStats.moves)) * 5;
    const perfectBonus = gameStats.perfectMatches * 10;
    const streakBonus = gameStats.streak * 3;
    const basePoints = totalPairs * 10;
    const totalPoints = basePoints + timeBonus + moveBonus + perfectBonus + streakBonus;
    
    if (user) {
      addPoints(totalPoints);
      
      // Award achievements
      if (gameStats.timeElapsed <= 60 && settings.gridSize !== '4x3') {
        addAchievement('Speed Demon');
        toast.success('Achievement unlocked: Speed Demon! 🏆');
      }
      
      if (gameStats.moves <= totalPairs + 2) {
        addAchievement('Memory Master');
        toast.success('Achievement unlocked: Memory Master! 🧠');
      }
      
      if (gameStats.perfectMatches === totalPairs) {
        addAchievement('Perfect Game');
        toast.success('Achievement unlocked: Perfect Game! ⭐');
      }
      
      if (settings.gridSize === '6x6') {
        addAchievement('Expert Player');
        toast.success('Achievement unlocked: Expert Player! 👑');
      }
    }
    
    toast.success(`Congratulations! You earned ${totalPoints} points!`);
    
    setTimeout(() => setShowConfetti(false), 5000);
  }, [gameStats, settings, gridConfigs, user, addPoints, addAchievement]);

  // Play sound effects
  const playSound = (type: 'flip' | 'match' | 'miss' | 'complete') => {
    if (!settings.soundEnabled) return;
    
    // In a real implementation, you would play actual sound files
    // For now, we'll use a simple beep or rely on the toast notifications
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      switch (type) {
        case 'flip':
          oscillator.frequency.value = 800;
          gainNode.gain.value = 0.1;
          break;
        case 'match':
          oscillator.frequency.value = 1200;
          gainNode.gain.value = 0.2;
          break;
        case 'miss':
          oscillator.frequency.value = 400;
          gainNode.gain.value = 0.1;
          break;
        case 'complete':
          oscillator.frequency.value = 1600;
          gainNode.gain.value = 0.3;
          break;
      }
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      // Fallback for browsers that don't support Web Audio API
      console.log(`Sound: ${type}`);
    }
  };

  // Pause/Resume game
  const togglePause = () => {
    setIsPaused(!isPaused);
    if (!isPaused) {
      toast.info('Game paused');
    } else {
      toast.info('Game resumed');
    }
  };

  // Show hint
  const showHintForPlayer = () => {
    if (!settings.hintsEnabled || gameStats.hintsUsed >= 3) return;
    
    // Find an unmatched pair
    const unmatchedCards = cards.filter(card => !card.isMatched && !card.isFlipped);
    const pairs = new Map();
    
    unmatchedCards.forEach(card => {
      if (!pairs.has(card.pairId)) {
        pairs.set(card.pairId, []);
      }
      pairs.get(card.pairId).push(card.id);
    });
    
    // Find a complete pair
    for (const [pairId, cardIds] of Array.from(pairs.entries())) {
      if (cardIds.length === 2) {
        setHintPair(cardIds);
        setShowHint(true);
        setGameStats(prev => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }));
        
        setTimeout(() => {
          setShowHint(false);
          setHintPair([]);
        }, 2000);
        
        toast.info('Hint: These two cards match!');
        return;
      }
    }
    
    toast.info('No hints available right now');
  };

  // Reset game
  const resetGame = () => {
    initializeGame();
    toast.info('Game reset!');
  };

  // Get grid layout classes
  const getGridClasses = () => {
    const config = gridConfigs[settings.gridSize];
    return `grid grid-cols-${config.cols} gap-2 md:gap-3 max-w-4xl mx-auto`;
  };

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {showConfetti && showConfetti}
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-800">Memory Match</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Timer className="w-4 h-4 text-blue-500" />
                <span className="font-semibold">
                  {formatTime(gameStats.timeElapsed)}
                  {settings.timeLimit > 0 && ` / ${formatTime(settings.timeLimit)}`}
                </span>
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Moves: {gameStats.moves}
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Matches: {gameStats.matches}/{gridConfigs[settings.gridSize].totalCards / 2}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                aria-label="Settings"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border-b shadow-lg"
          >
            <div className="container mx-auto px-4 py-6">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Game Settings</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="text-sm font-medium block mb-2">Grid Size</label>
                    <select
                      value={settings.gridSize}
                      onChange={(e) => setSettings({
                        ...settings,
                        gridSize: e.target.value as GameSettings['gridSize']
                      })}
                      disabled={gameStats.gameStarted && !gameStats.gameComplete}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="4x3">Easy (12 cards)</option>
                      <option value="4x4">Medium (16 cards)</option>
                      <option value="6x4">Hard (24 cards)</option>
                      <option value="6x6">Expert (36 cards)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-2">Theme</label>
                    <select
                      value={settings.theme}
                      onChange={(e) => setSettings({
                        ...settings,
                        theme: e.target.value as GameSettings['theme']
                      })}
                      disabled={gameStats.gameStarted && !gameStats.gameComplete}
                      className="w-full p-2 border rounded-md"
                    >
                      {Object.entries(cardThemes).map(([key, theme]) => (
                        <option key={key} value={key}>{theme.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-2">Time Limit</label>
                    <select
                      value={settings.timeLimit}
                      onChange={(e) => setSettings({
                        ...settings,
                        timeLimit: parseInt(e.target.value)
                      })}
                      disabled={gameStats.gameStarted && !gameStats.gameComplete}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value={0}>No limit</option>
                      <option value={60}>1 minute</option>
                      <option value={120}>2 minutes</option>
                      <option value={180}>3 minutes</option>
                      <option value={300}>5 minutes</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium block mb-2">Sound</label>
                      <Button
                        variant={settings.soundEnabled ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSettings({
                          ...settings,
                          soundEnabled: !settings.soundEnabled
                        })}
                        className="w-full"
                      >
                        <Volume2 className="w-4 h-4 mr-2" />
                        {settings.soundEnabled ? 'On' : 'Off'}
                      </Button>
                    </div>
                    
                    <div>
                      <Button
                        variant={settings.hintsEnabled ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSettings({
                          ...settings,
                          hintsEnabled: !settings.hintsEnabled
                        })}
                        className="w-full"
                      >
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Hints {settings.hintsEnabled ? 'On' : 'Off'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8">
        {/* Game Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold text-gray-800">
                Memory Match Challenge 🧠
              </CardTitle>
              <div className="text-center text-gray-600">
                Find all matching pairs by flipping two cards at a time
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {cardThemes[settings.theme].name}
                  </Badge>
                  <Badge variant="outline">
                    {settings.gridSize} Grid
                  </Badge>
                  {gameStats.streak > 0 && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      <Zap className="w-3 h-3 mr-1" />
                      Streak: {gameStats.streak}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {gameStats.gameStarted && !gameStats.gameComplete && (
                    <Button
                      onClick={togglePause}
                      variant="outline"
                      size="sm"
                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                      {isPaused ? 'Resume' : 'Pause'}
                    </Button>
                  )}
                  
                  {settings.hintsEnabled && gameStats.hintsUsed < 3 && (
                    <Button
                      onClick={showHintForPlayer}
                      variant="outline"
                      size="sm"
                      className="border-yellow-300 text-yellow-600 hover:bg-yellow-50"
                      disabled={!gameStats.gameStarted || gameStats.gameComplete || isPaused}
                    >
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Hint ({3 - gameStats.hintsUsed} left)
                    </Button>
                  )}
                  
                  <Button
                    onClick={resetGame}
                    variant="outline"
                    size="sm"
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    New Game
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Game Board */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <div className={getGridClasses()}>
            {cards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, rotateY: 180 }}
                animate={{ opacity: 1, rotateY: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="aspect-square"
              >
                <motion.button
                  onClick={() => handleCardClick(card.id)}
                  disabled={
                    isProcessing || 
                    card.isFlipped || 
                    card.isMatched || 
                    flippedCards.length >= 2 ||
                    isPaused ||
                    gameStats.gameComplete
                  }
                  className={`w-full h-full rounded-xl border-2 transition-all duration-300 transform-gpu relative ${
                    card.isMatched
                      ? 'bg-green-100 border-green-500 cursor-default scale-95 opacity-75'
                      : card.isFlipped
                      ? `${card.color} border-blue-500 shadow-lg`
                      : (isProcessing || flippedCards.length >= 2 || isPaused || gameStats.gameComplete)
                      ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-50'
                      : 'bg-white border-gray-300 hover:border-blue-400 hover:shadow-lg hover:scale-105 cursor-pointer'
                  } ${showHint && hintPair.includes(card.id) ? 'ring-4 ring-yellow-400 ring-opacity-75' : ''}`}
                  whileHover={
                    !card.isFlipped && 
                    !card.isMatched && 
                    !isProcessing && 
                    flippedCards.length < 2 &&
                    !isPaused &&
                    !gameStats.gameComplete
                      ? { scale: 1.05 } 
                      : {}
                  }
                  whileTap={
                    !card.isFlipped && 
                    !card.isMatched && 
                    !isProcessing && 
                    flippedCards.length < 2 &&
                    !isPaused &&
                    !gameStats.gameComplete
                      ? { scale: 0.95 } 
                      : {}
                  }
                  style={{
                    perspective: '1000px',
                  }}
                  aria-label={`Card ${card.id + 1}${card.isMatched ? ' - matched' : card.isFlipped ? ' - revealed' : ' - hidden'}`}
                >
                  <motion.div
                    className="w-full h-full flex items-center justify-center relative"
                    animate={{
                      rotateY: card.isFlipped || card.isMatched ? 0 : 180
                    }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    style={{
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {/* Card Back */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-gray-400 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl"
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                      }}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">🧠</div>
                        <div className="text-xs text-gray-500">?</div>
                      </div>
                    </motion.div>
                    
                    {/* Card Front */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center text-6xl rounded-xl"
                      style={{
                        backfaceVisibility: 'hidden',
                      }}
                    >
                      {card.symbol}
                    </motion.div>
                  </motion.div>
                  
                  {/* Match indicator */}
                  {card.isMatched && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                    >
                      <CheckCircle className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                  
                  {/* Hint indicator */}
                  {showHint && hintPair.includes(card.id) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -left-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center"
                    >
                      <Lightbulb className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Game Complete Message */}
        <AnimatePresence>
          {gameStats.gameComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <Card className="bg-gradient-to-r from-green-100 to-blue-100 border-0 shadow-xl max-w-md mx-auto">
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mx-auto flex items-center justify-center">
                      <Trophy className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-800">
                      Congratulations! 🎉
                    </div>
                    <div className="text-gray-600">
                      You found all {gridConfigs[settings.gridSize].totalCards / 2} pairs!
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-xl font-bold text-blue-600">{gameStats.moves}</div>
                        <div className="text-sm text-gray-500">Moves</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-green-600">{formatTime(gameStats.timeElapsed)}</div>
                        <div className="text-sm text-gray-500">Time</div>
                      </div>
                    </div>
                    {gameStats.perfectMatches > 0 && (
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">{gameStats.perfectMatches}</div>
                        <div className="text-sm text-gray-500">Perfect Matches</div>
                      </div>
                    )}
                    <Button
                      onClick={resetGame}
                      className="w-full bg-gradient-to-r from-green-500 to-blue-600"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Play Again
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pause Overlay */}
        <AnimatePresence>
          {isPaused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <Card className="bg-white border-0 shadow-xl">
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-4">⏸️</div>
                  <div className="text-2xl font-bold text-gray-800 mb-4">Game Paused</div>
                  <Button onClick={togglePause} className="bg-blue-600 hover:bg-blue-700">
                    <Play className="w-4 h-4 mr-2" />
                    Resume Game
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Instructions */}
        {!gameStats.gameStarted && !gameStats.gameComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg max-w-2xl mx-auto">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">How to Play</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Click any card to flip it over</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Click a second card to find a match</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Matching pairs stay face up</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Find all pairs to win!</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Use hints if you get stuck</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Build streaks for bonus points</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}