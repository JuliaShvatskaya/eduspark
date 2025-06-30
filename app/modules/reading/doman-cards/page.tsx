'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw,
  Settings,
  Timer,
  Eye,
  Brain,
  Star,
  Trophy,
  Volume2,
  Coffee
} from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/providers/UserProvider';
import { toast } from 'sonner';

interface DomanCard {
  id: string;
  word: string;
  image: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description?: string;
}

interface DomanSet {
  id: string;
  title: string;
  description: string;
  cards: DomanCard[];
  category: string;
  ageGroup: string;
}

interface SessionSettings {
  displayDuration: number; // milliseconds
  cardsPerSession: number;
  autoAdvance: boolean;
  soundEnabled: boolean;
  childName: string;
  sessionBreakTime: number; // minutes
  backgroundColor: string;
  textColor: string;
  fontSize: number;
}

interface SessionData {
  startTime: Date;
  endTime?: Date;
  cardsShown: number;
  setsCompleted: number;
  totalDuration: number;
  engagementLevel: 'high' | 'medium' | 'low';
  attentionSpan: number;
}

export default function DomanMethodCards() {
  const { user, addPoints, addAchievement } = useUser();
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showWord, setShowWord] = useState(false);
  const [sessionData, setSessionData] = useState<SessionData>({
    startTime: new Date(),
    cardsShown: 0,
    setsCompleted: 0,
    totalDuration: 0,
    engagementLevel: 'high',
    attentionSpan: 0
  });
  
  const [settings, setSettings] = useState<SessionSettings>({
    displayDuration: 1000, // 1 second as specified
    cardsPerSession: 10,
    autoAdvance: true,
    soundEnabled: true,
    childName: user?.name || 'Child',
    sessionBreakTime: 30,
    backgroundColor: '#FFFFFF', // Pure white
    textColor: '#FF0000', // Bright red
    fontSize: 120
  });

  const [showSettings, setShowSettings] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [lastSessionTime, setLastSessionTime] = useState<Date | null>(null);
  const [canStartSession, setCanStartSession] = useState(true);
  const [timeUntilNextSession, setTimeUntilNextSession] = useState(0);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wakeLockRef = useRef<any>(null);
  const nextCardRef = useRef<(() => void) | null>(null);

  // Comprehensive Doman Method card sets
  const cardSets: DomanSet[] = [
    {
      id: 'family-basic',
      title: 'Family Members',
      description: 'Important family relationships',
      category: 'family',
      ageGroup: '0-3',
      cards: [
        { id: 'mama', word: 'mama', image: '👩', category: 'family', difficulty: 'beginner', description: 'Mother' },
        { id: 'papa', word: 'papa', image: '👨', category: 'family', difficulty: 'beginner', description: 'Father' },
        { id: 'baby', word: 'baby', image: '👶', category: 'family', difficulty: 'beginner', description: 'Baby' },
        { id: 'child', word: settings.childName.toLowerCase(), image: '🧒', category: 'family', difficulty: 'beginner', description: 'You' },
        { id: 'love', word: 'love', image: '❤️', category: 'family', difficulty: 'beginner', description: 'Love' }
      ]
    },
    {
      id: 'body-parts',
      title: 'Body Parts',
      description: 'Parts of the human body',
      category: 'body',
      ageGroup: '1-4',
      cards: [
        { id: 'head', word: 'head', image: '🗣️', category: 'body', difficulty: 'beginner', description: 'Head' },
        { id: 'hand', word: 'hand', image: '✋', category: 'body', difficulty: 'beginner', description: 'Hand' },
        { id: 'foot', word: 'foot', image: '🦶', category: 'body', difficulty: 'beginner', description: 'Foot' },
        { id: 'eye', word: 'eye', image: '👁️', category: 'body', difficulty: 'beginner', description: 'Eye' },
        { id: 'nose', word: 'nose', image: '👃', category: 'body', difficulty: 'beginner', description: 'Nose' }
      ]
    },
    {
      id: 'animals-basic',
      title: 'Animals',
      description: 'Common animals children love',
      category: 'animals',
      ageGroup: '2-5',
      cards: [
        { id: 'cat', word: 'cat', image: '🐱', category: 'animals', difficulty: 'beginner', description: 'Cat' },
        { id: 'dog', word: 'dog', image: '🐕', category: 'animals', difficulty: 'beginner', description: 'Dog' },
        { id: 'bird', word: 'bird', image: '🐦', category: 'animals', difficulty: 'beginner', description: 'Bird' },
        { id: 'fish', word: 'fish', image: '🐟', category: 'animals', difficulty: 'beginner', description: 'Fish' },
        { id: 'elephant', word: 'elephant', image: '🐘', category: 'animals', difficulty: 'intermediate', description: 'Elephant' }
      ]
    },
    {
      id: 'colors-basic',
      title: 'Colors',
      description: 'Basic color recognition',
      category: 'colors',
      ageGroup: '2-5',
      cards: [
        { id: 'red', word: 'red', image: '🔴', category: 'colors', difficulty: 'beginner', description: 'Red color' },
        { id: 'blue', word: 'blue', image: '🔵', category: 'colors', difficulty: 'beginner', description: 'Blue color' },
        { id: 'green', word: 'green', image: '🟢', category: 'colors', difficulty: 'beginner', description: 'Green color' },
        { id: 'yellow', word: 'yellow', image: '🟡', category: 'colors', difficulty: 'beginner', description: 'Yellow color' },
        { id: 'orange', word: 'orange', image: '🟠', category: 'colors', difficulty: 'beginner', description: 'Orange color' }
      ]
    },
    {
      id: 'actions-basic',
      title: 'Actions',
      description: 'Things we do every day',
      category: 'actions',
      ageGroup: '3-6',
      cards: [
        { id: 'eat', word: 'eat', image: '🍽️', category: 'actions', difficulty: 'intermediate', description: 'Eating' },
        { id: 'sleep', word: 'sleep', image: '😴', category: 'actions', difficulty: 'intermediate', description: 'Sleeping' },
        { id: 'play', word: 'play', image: '🎮', category: 'actions', difficulty: 'intermediate', description: 'Playing' },
        { id: 'run', word: 'run', image: '🏃', category: 'actions', difficulty: 'intermediate', description: 'Running' },
        { id: 'jump', word: 'jump', image: '🤸', category: 'actions', difficulty: 'intermediate', description: 'Jumping' }
      ]
    }
  ];

  const currentSet = cardSets[currentSetIndex];
  const currentCard = currentSet?.cards[currentCardIndex];

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('doman-cards-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    const lastSession = localStorage.getItem('last-doman-cards-session');
    if (lastSession) {
      const lastTime = new Date(lastSession);
      setLastSessionTime(lastTime);
      
      const timeDiff = Date.now() - lastTime.getTime();
      const breakTime = 30 * 60 * 1000; // 30 minutes
      
      if (timeDiff < breakTime) {
        setCanStartSession(false);
        setTimeUntilNextSession(breakTime - timeDiff);
      }
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('doman-cards-settings', JSON.stringify(settings));
  }, [settings]);

  // Timer for session break enforcement
  useEffect(() => {
    if (!canStartSession && timeUntilNextSession > 0) {
      const timer = setInterval(() => {
        setTimeUntilNextSession(prev => {
          if (prev <= 1000) {
            setCanStartSession(true);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [canStartSession, timeUntilNextSession]);

  // Prevent screen timeout
  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
      }
    } catch (err) {
      console.log('Wake lock not supported');
    }
  };

  const releaseWakeLock = () => {
    if (wakeLockRef.current) {
      wakeLockRef.current.release();
      wakeLockRef.current = null;
    }
  };

  // Display card sequence: Image first, then word
  const displayCard = useCallback(() => {
    if (!currentCard) return;

    setShowCard(true);
    setShowImage(true);
    setShowWord(false);

    // Show image for half the duration
    setTimeout(() => {
      setShowWord(true);
    }, settings.displayDuration / 2);

    // Play word sound if enabled
    if (settings.soundEnabled) {
      setTimeout(() => {
        playWordSound(currentCard.word);
      }, settings.displayDuration / 2);
    }

    // Update session data
    setSessionData(prev => ({
      ...prev,
      cardsShown: prev.cardsShown + 1
    }));

    // Hide card after full duration
    timeoutRef.current = setTimeout(() => {
      setShowCard(false);
      setShowImage(false);
      setShowWord(false);
      
      // Auto advance to next card
      if (isPlaying) {
        setTimeout(() => {
          nextCardRef.current?.();
        }, 300);
      }
    }, settings.displayDuration);
  }, [currentCard, isPlaying, settings]);

  // Play word pronunciation
  const playWordSound = useCallback((word: string) => {
    if (!settings.soundEnabled) return;
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.6;
      utterance.pitch = 1.2;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  }, [settings.soundEnabled]);

  // Move to next card
  const nextCard = useCallback(() => {
    if (currentCardIndex >= currentSet.cards.length - 1) {
      // Set complete
      completeSet();
    } else {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  }, [currentCardIndex, currentSet.cards.length]);

  // Update the ref whenever nextCard changes
  useEffect(() => {
    nextCardRef.current = nextCard;
  }, [nextCard]);

  // Complete current set
  const completeSet = useCallback(() => {
    setSessionData(prev => ({
      ...prev,
      setsCompleted: prev.setsCompleted + 1
    }));

    addPoints(25);
    toast.success(`Great job! Set "${currentSet.title}" completed!`);

    if (currentSetIndex >= cardSets.length - 1) {
      completeSession();
    } else {
      // Auto-advance to next set
      if (settings.autoAdvance) {
        setTimeout(() => {
          nextSet();
        }, 2000);
      }
    }
  }, [currentSet.title, currentSetIndex, cardSets.length, settings.autoAdvance, addPoints]);

  // Move to next set
  const nextSet = useCallback(() => {
    if (currentSetIndex >= cardSets.length - 1) {
      completeSession();
      return;
    }

    setCurrentSetIndex(currentSetIndex + 1);
    setCurrentCardIndex(0);
    setShowCard(false);
    setShowImage(false);
    setShowWord(false);
  }, [currentSetIndex, cardSets.length]);

  // Complete entire session
  const completeSession = useCallback(() => {
    setIsPlaying(false);
    setSessionComplete(true);
    releaseWakeLock();
    
    const endTime = new Date();
    const duration = endTime.getTime() - sessionData.startTime.getTime();
    
    setSessionData(prev => ({
      ...prev,
      endTime,
      totalDuration: duration
    }));

    // Save session completion time
    localStorage.setItem('last-doman-cards-session', endTime.toISOString());
    setLastSessionTime(endTime);
    setCanStartSession(false);
    setTimeUntilNextSession(30 * 60 * 1000); // 30 minutes

    addPoints(100);
    addAchievement('Doman Cards Master');
    toast.success('Session completed! Excellent learning!');
  }, [sessionData.startTime, addPoints, addAchievement]);

  // Start/stop session
  const toggleSession = async () => {
    if (!canStartSession) {
      toast.error('Please wait for the recommended break time before starting a new session.');
      return;
    }

    if (isPlaying) {
      setIsPlaying(false);
      releaseWakeLock();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    } else {
      setIsPlaying(true);
      await requestWakeLock();
      setSessionData(prev => ({ ...prev, startTime: new Date() }));
      setTimeout(() => displayCard(), 100);
    }
  };

  // Auto-display card when index changes
  useEffect(() => {
    if (isPlaying && currentCard) {
      setTimeout(() => displayCard(), 500);
    }
  }, [currentCardIndex, isPlaying, displayCard]);

  // Reset session
  const resetSession = () => {
    setCurrentSetIndex(0);
    setCurrentCardIndex(0);
    setIsPlaying(false);
    setShowCard(false);
    setShowImage(false);
    setShowWord(false);
    setSessionComplete(false);
    setSessionData({
      startTime: new Date(),
      cardsShown: 0,
      setsCompleted: 0,
      totalDuration: 0,
      engagementLevel: 'high',
      attentionSpan: 0
    });
    releaseWakeLock();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  // Format time remaining
  const formatTimeRemaining = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      releaseWakeLock();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Session break screen
  if (!canStartSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto text-center bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Coffee className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Break Time! 🌟
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-lg text-gray-600">
              Time for a healthy break before the next learning session
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {formatTimeRemaining(timeUntilNextSession)}
            </div>
            <div className="text-sm text-gray-500">
              Recommended break time remaining
            </div>
            <div className="space-y-2">
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

  // Session complete screen
  if (sessionComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto text-center bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Wonderful Learning! 🎉
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-lg text-gray-600">
              {settings.childName} did amazing today!
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{sessionData.cardsShown}</div>
                <div className="text-sm text-gray-500">Cards Seen</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{sessionData.setsCompleted}</div>
                <div className="text-sm text-gray-500">Sets Completed</div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Session Duration: {Math.round(sessionData.totalDuration / 60000)} minutes
            </div>
            <div className="space-y-2">
              <Button onClick={resetSession} className="w-full bg-gradient-to-r from-green-500 to-blue-600">
                <RotateCcw className="w-4 h-4 mr-2" />
                New Session (After Break)
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
    <div 
      className="min-h-screen transition-all duration-300"
      style={{ 
        backgroundColor: settings.backgroundColor,
      }}
    >
      {/* Header - Only show when not displaying cards */}
      <AnimatePresence>
        {!showCard && (
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/90 backdrop-blur-sm border-b sticky top-0 z-50"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Link href="/modules/reading">
                    <Button variant="ghost" size="sm">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Reading
                    </Button>
                  </Link>
                  <div className="flex items-center space-x-2">
                    <Brain className="w-6 h-6 text-red-600" />
                    <h1 className="text-xl font-bold text-gray-800">Doman Method Cards</h1>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
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
          </motion.header>
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && !showCard && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border-b shadow-lg"
          >
            <div className="container mx-auto px-4 py-6">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Doman Method Settings</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-medium block mb-2">Display Duration</label>
                    <select
                      value={settings.displayDuration}
                      onChange={(e) => setSettings({
                        ...settings,
                        displayDuration: parseInt(e.target.value)
                      })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value={500}>0.5 seconds</option>
                      <option value={1000}>1 second (recommended)</option>
                      <option value={1500}>1.5 seconds</option>
                      <option value={2000}>2 seconds</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-2">Cards Per Session</label>
                    <select
                      value={settings.cardsPerSession}
                      onChange={(e) => setSettings({
                        ...settings,
                        cardsPerSession: parseInt(e.target.value)
                      })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value={5}>5 cards</option>
                      <option value={10}>10 cards</option>
                      <option value={15}>15 cards</option>
                      <option value={20}>20 cards</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-2">Font Size</label>
                    <select
                      value={settings.fontSize}
                      onChange={(e) => setSettings({
                        ...settings,
                        fontSize: parseInt(e.target.value)
                      })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value={100}>100px</option>
                      <option value={120}>120px (recommended)</option>
                      <option value={150}>150px</option>
                      <option value={180}>180px</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-2">Child's Name</label>
                    <input
                      type="text"
                      value={settings.childName}
                      onChange={(e) => setSettings({
                        ...settings,
                        childName: e.target.value
                      })}
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter child's name"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-2">Audio</label>
                    <Button
                      variant={settings.soundEnabled ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSettings({
                        ...settings,
                        soundEnabled: !settings.soundEnabled
                      })}
                      className="w-full"
                    >
                      {settings.soundEnabled ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-2">Auto Advance</label>
                    <Button
                      variant={settings.autoAdvance ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSettings({
                        ...settings,
                        autoAdvance: !settings.autoAdvance
                      })}
                      className="w-full"
                    >
                      {settings.autoAdvance ? 'On' : 'Off'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Display Area */}
      <div className="flex-1 flex items-center justify-center min-h-screen p-4">
        <AnimatePresence mode="wait">
          {showCard && currentCard ? (
            <motion.div
              key={`${currentSetIndex}-${currentCardIndex}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="text-center max-w-2xl mx-auto"
            >
              {/* Image Display */}
              <AnimatePresence>
                {showImage && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                    className="mb-8"
                  >
                    <div 
                      className="text-9xl mb-4"
                      role="img" 
                      aria-label={currentCard.description || currentCard.word}
                    >
                      {currentCard.image}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Word Display */}
              <AnimatePresence>
                {showWord && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div 
                      className="font-bold lowercase tracking-wide"
                      style={{ 
                        fontSize: `${settings.fontSize}px`,
                        color: settings.textColor,
                        textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      {currentCard.word}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center max-w-2xl mx-auto"
            >
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-gray-800 mb-4">
                    {currentSet.title}
                  </CardTitle>
                  <div className="text-gray-600 mb-4">
                    {currentSet.description}
                  </div>
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      Set {currentSetIndex + 1} of {cardSets.length}
                    </Badge>
                    <Badge variant="outline">
                      Card {currentCardIndex + 1} of {currentSet.cards.length}
                    </Badge>
                  </div>
                  <Progress 
                    value={((currentCardIndex + 1) / currentSet.cards.length) * 100} 
                    className="h-3 mb-6"
                  />
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-6xl mb-4">👁️</div>
                    <div className="text-xl font-semibold text-gray-800 mb-2">
                      Ready to see picture cards?
                    </div>
                    <div className="text-gray-600 mb-6">
                      Each card will show for {settings.displayDuration / 1000} second{settings.displayDuration !== 1000 ? 's' : ''}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={toggleSession}
                      size="lg"
                      className={`px-8 py-3 text-lg ${
                        isPlaying 
                          ? 'bg-red-500 hover:bg-red-600' 
                          : 'bg-green-500 hover:bg-green-600'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-5 h-5 mr-2" />
                          Pause Session
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5 mr-2" />
                          Start Session
                        </>
                      )}
                    </Button>
                    
                    {!settings.autoAdvance && (
                      <Button
                        onClick={nextSet}
                        variant="outline"
                        size="lg"
                        className="px-8 py-3 text-lg border-2"
                      >
                        <SkipForward className="w-5 h-5 mr-2" />
                        Next Set
                      </Button>
                    )}
                  </div>

                  <div className="text-center text-sm text-gray-500">
                    <div className="flex items-center justify-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Timer className="w-4 h-4" />
                        <span>Session: {Math.round((Date.now() - sessionData.startTime.getTime()) / 60000)} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>Cards: {sessionData.cardsShown}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4" />
                        <span>Sets: {sessionData.setsCompleted}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}