'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@/providers/UserProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Brain, Play, Star, Timer, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '@/components/ui/header';

// Memory Match Game Component
function MemoryMatchGame({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [cards, setCards] = useState<Array<{ id: number; symbol: string; isFlipped: boolean; isMatched: boolean }>>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const symbols = ['🐶', '🐱', '🐰', '🦊', '🐻', '🐼', '🐸', '🐨'];

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      toast.error('Time\'s up! Try again!');
      initializeGame();
    }
  }, [timeLeft, gameStarted]);

  useEffect(() => {
    if (matches === symbols.length) {
      setGameStarted(false);
      toast.success('Congratulations! All pairs matched!');
      setTimeout(onComplete, 2000);
    }
  }, [matches, onComplete]);

  const initializeGame = () => {
    const gameCards = [...symbols, ...symbols]
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false
      }))
      .sort(() => Math.random() - 0.5);
    
    setCards(gameCards);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setTimeLeft(60);
    setGameStarted(true);
    setIsProcessing(false);
  };

  const flipCard = (cardId: number) => {
    if (flippedCards.length === 2 || isProcessing) return;
    if (cards[cardId].isFlipped || cards[cardId].isMatched) return;

    const newCards = [...cards];
    newCards[cardId].isFlipped = true;
    setCards(newCards);

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setIsProcessing(true);
      setMoves(moves + 1);
      const [first, second] = newFlippedCards;
      
      if (cards[first].symbol === cards[second].symbol) {
        // Match found
        setTimeout(() => {
          const matchedCards = [...newCards];
          matchedCards[first].isMatched = true;
          matchedCards[second].isMatched = true;
          setCards(matchedCards);
          setMatches(matches + 1);
          setFlippedCards([]);
          setIsProcessing(false);
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[first].isFlipped = false;
          resetCards[second].isFlipped = false;
          setCards(resetCards);
          setFlippedCards([]);
          setIsProcessing(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Games
            </Button>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Timer className="w-4 h-4 text-red-500" />
                <span className="font-semibold">{timeLeft}s</span>
              </div>
              <div className="text-sm">
                <span className="font-semibold">Moves: {moves}</span>
              </div>
              <div className="text-sm">
                <span className="font-semibold">Matches: {matches}/{symbols.length}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-800">
                Memory Match 🃏
              </CardTitle>
              <p className="text-gray-600">
                Find all matching pairs before time runs out!
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
                {cards.map((card) => (
                  <motion.button
                    key={card.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => flipCard(card.id)}
                    disabled={isProcessing || card.isFlipped || card.isMatched}
                    className={`aspect-square rounded-xl border-2 text-4xl font-bold transition-all duration-300 ${
                      card.isFlipped || card.isMatched
                        ? card.isMatched
                          ? 'bg-green-100 border-green-500 text-green-800'
                          : 'bg-blue-100 border-blue-500'
                        : isProcessing
                        ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                        : 'bg-purple-100 border-purple-300 hover:border-purple-500 cursor-pointer'
                    }`}
                  >
                    {card.isFlipped || card.isMatched ? (
                      <div className="flex items-center justify-center h-full">
                        {card.isMatched && <Check className="w-4 h-4 absolute top-1 right-1" />}
                        {card.symbol}
                      </div>
                    ) : (
                      '?'
                    )}
                  </motion.button>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Button 
                  onClick={initializeGame}
                  variant="outline"
                  className="border-purple-200 text-purple-600 hover:bg-purple-50"
                >
                  New Game
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function AttentionModule() {
  const { user, addPoints } = useUser();
  const [currentGame, setCurrentGame] = useState<string | null>(null);

  const games = [
    {
      id: 'memory-match',
      title: 'Memory Match',
      description: 'Find matching pairs of cards',
      difficulty: 'Beginner',
      points: 15,
      icon: '🃏',
      color: 'from-purple-400 to-purple-600'
    },
    {
      id: 'find-differences',
      title: 'Spot the Difference',
      description: 'Find what changed between pictures',
      difficulty: 'Intermediate',
      points: 20,
      icon: '🔍',
      color: 'from-blue-400 to-blue-600'
    },
    {
      id: 'pattern-sequence',
      title: 'Pattern Sequence',
      description: 'Remember and repeat color patterns',
      difficulty: 'Advanced',
      points: 25,
      icon: '🌈',
      color: 'from-green-400 to-green-600'
    },
    {
      id: 'follow-commands',
      title: 'Follow Commands',
      description: 'Listen and follow multi-step instructions',
      difficulty: 'Intermediate',
      points: 20,
      icon: '👂',
      color: 'from-orange-400 to-orange-600'
    }
  ];

  const startGame = (gameId: string) => {
    setCurrentGame(gameId);
  };

  const completeGame = (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    if (game) {
      addPoints(game.points);
      toast.success(`Amazing! You earned ${game.points} points!`);
    }
    setCurrentGame(null);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  if (currentGame === 'memory-match') {
    return <MemoryMatchGame onComplete={() => completeGame(currentGame)} onBack={() => setCurrentGame(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <Header title="Focus Games">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-purple-600" />
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
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
          <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Focus Games 🧠</h2>
                <p className="text-lg opacity-90">
                  Train your attention and memory with fun challenges!
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">60%</div>
                <div className="text-sm opacity-75">Module Progress</div>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={60} className="h-3 bg-white/20" />
            </div>
          </div>
        </motion.div>

        {/* Game Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Choose Your Brain Challenge</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="text-center">
                    <div className="text-4xl mb-4">{game.icon}</div>
                    <CardTitle className="text-xl font-bold text-gray-800">
                      {game.title}
                    </CardTitle>
                    <p className="text-gray-600 text-sm">{game.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Badge 
                        variant={game.difficulty === 'Beginner' ? 'secondary' : 
                                game.difficulty === 'Intermediate' ? 'default' : 'destructive'}
                      >
                        {game.difficulty}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-semibold">{game.points} pts</span>
                      </div>
                    </div>
                    <Button 
                      className={`w-full bg-gradient-to-r ${game.color} hover:opacity-90`}
                      onClick={() => startGame(game.id)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Game
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