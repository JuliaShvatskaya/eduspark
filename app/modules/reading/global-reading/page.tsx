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
  Play,
  Pause,
  SkipForward,
  Timer,
  Eye,
  Brain,
  Sun,
  Moon,
  Coffee,
  Zap,
  Shield
} from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/providers/UserProvider';
import { toast } from 'sonner';

interface WordSet {
  id: string;
  title: string;
  description: string;
  words: string[];
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface DomanSettings {
  displayDuration: number; // milliseconds
  wordsPerSet: number;
  autoAdvance: boolean;
  audioEnabled: boolean;
  childName: string;
  brightness: number;
  fontSize: number;
  backgroundColor: string;
  textColor: string;
  sessionBreakReminder: boolean;
  customWords: string[];
}

interface SessionData {
  startTime: Date;
  endTime?: Date;
  wordsShown: number;
  setsCompleted: number;
  totalDuration: number;
  childEngagement: 'high' | 'medium' | 'low';
}

export default function GlobalReadingExercise() {
  const { user, addPoints, addAchievement } = useUser();
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showWord, setShowWord] = useState(false);
  const [sessionData, setSessionData] = useState<SessionData>({
    startTime: new Date(),
    wordsShown: 0,
    setsCompleted: 0,
    totalDuration: 0,
    childEngagement: 'high'
  });
  
  const [settings, setSettings] = useState<DomanSettings>({
    displayDuration: 1000,
    wordsPerSet: 5,
    autoAdvance: true,
    audioEnabled: true,
    childName: user?.name || 'Alex',
    brightness: 100,
    fontSize: 120,
    backgroundColor: '#ffffff',
    textColor: '#dc2626', // red-600
    sessionBreakReminder: true,
    customWords: []
  });

  const [showSettings, setShowSettings] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastSessionTime, setLastSessionTime] = useState<Date | null>(null);
  const [canStartSession, setCanStartSession] = useState(true);
  const [timeUntilNextSession, setTimeUntilNextSession] = useState(0);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const wakeLockRef = useRef<any>(null);
  const nextWordRef = useRef<(() => void) | null>(null);

  // Predefined word sets following Doman Method
  const wordSets: WordSet[] = [
    {
      id: 'family',
      title: 'Family',
      description: 'Important family members',
      words: ['mama', 'papa', 'baby', settings.childName.toLowerCase(), 'love'],
      category: 'family',
      difficulty: 'beginner'
    },
    {
      id: 'body-parts',
      title: 'Body Parts',
      description: 'Parts of the body',
      words: ['head', 'hand', 'foot', 'eye', 'nose'],
      category: 'body',
      difficulty: 'beginner'
    },
    {
      id: 'objects',
      title: 'Objects',
      description: 'Common objects around us',
      words: ['ball', 'cup', 'book', 'toy', 'car'],
      category: 'objects',
      difficulty: 'beginner'
    },
    {
      id: 'actions',
      title: 'Actions',
      description: 'Things we do',
      words: ['eat', 'sleep', 'play', 'run', 'jump'],
      category: 'actions',
      difficulty: 'intermediate'
    },
    {
      id: 'colors',
      title: 'Colors',
      description: 'Beautiful colors',
      words: ['red', 'blue', 'green', 'yellow', 'orange'],
      category: 'colors',
      difficulty: 'intermediate'
    }
  ];

  const currentSet = wordSets[currentSetIndex];
  const currentWord = currentSet?.words[currentWordIndex];

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('doman-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    const lastSession = localStorage.getItem('last-doman-session');
    if (lastSession) {
      const lastTime = new Date(lastSession);
      setLastSessionTime(lastTime);
      
      // Check if 30 minutes have passed
      const timeDiff = Date.now() - lastTime.getTime();
      const thirtyMinutes = 30 * 60 * 1000;
      
      if (timeDiff < thirtyMinutes) {
        setCanStartSession(false);
        setTimeUntilNextSession(thirtyMinutes - timeDiff);
      }
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('doman-settings', JSON.stringify(settings));
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

  // Auto-advance word display
  const displayWord = useCallback(() => {
    if (!currentWord) return;

    setShowWord(true);
    
    // Play word sound if enabled
    if (settings.audioEnabled) {
      playWordSound(currentWord);
    }

    // Update session data
    setSessionData(prev => ({
      ...prev,
      wordsShown: prev.wordsShown + 1
    }));

    // Hide word after display duration
    timeoutRef.current = setTimeout(() => {
      setShowWord(false);
      
      // Auto advance to next word
      if (isPlaying) {
        setTimeout(() => {
          nextWordRef.current?.();
        }, 500);
      }
    }, settings.displayDuration);
  }, [currentWord, isPlaying, settings]);

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
      setTimeout(() => displayWord(), 100);
    }
  };

  // Auto-display word when index changes
  useEffect(() => {
    if (isPlaying && currentWord) {
      setTimeout(() => displayWord(), 500);
    }
  }, [currentWordIndex, isPlaying, displayWord]);

  // Reset session
  const resetSession = () => {
    setCurrentSetIndex(0);
    setCurrentWordIndex(0);
    setIsPlaying(false);
    setShowWord(false);
    setSessionComplete(false);
    setShowCelebration(false);
    setSessionData({
      startTime: new Date(),
      wordsShown: 0,
      setsCompleted: 0,
      totalDuration: 0,
      childEngagement: 'high'
    });
    releaseWakeLock();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  // Emergency stop
  const emergencyStop = () => {
    setIsPlaying(false);
    setShowWord(false);
    releaseWakeLock();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    toast.info('Session stopped safely');
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
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Play word pronunciation
  const playWordSound = useCallback((word: string) => {
    if (!settings.audioEnabled) return;
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.6;
      utterance.pitch = 1.2;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  }, [settings.audioEnabled]);

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
    localStorage.setItem('last-doman-session', endTime.toISOString());
    setLastSessionTime(endTime);
    setCanStartSession(false);
    setTimeUntilNextSession(30 * 60 * 1000); // 30 minutes

    addPoints(100);
    addAchievement('Doman Method Master');
    toast.success('Session completed! Great learning!');
  }, [sessionData.startTime, addPoints, addAchievement]);

  // Move to next set
  const nextSet = useCallback(() => {
    if (currentSetIndex >= wordSets.length - 1) {
      completeSession();
      return;
    }

    setCurrentSetIndex(currentSetIndex + 1);
    setCurrentWordIndex(0);
    setShowWord(false);
  }, [currentSetIndex, wordSets.length, completeSession]);

  // Complete current set
  const completeSet = useCallback(() => {
    setShowCelebration(true);
    setSessionData(prev => ({
      ...prev,
      setsCompleted: prev.setsCompleted + 1
    }));

    addPoints(25);
    toast.success(`Great job! Set "${currentSet.title}" completed!`);

    setTimeout(() => {
      setShowCelebration(false);
      if (currentSetIndex >= wordSets.length - 1) {
        completeSession();
      } else {
        // Auto-advance to next set or wait for parent
        if (settings.autoAdvance) {
          nextSet();
        }
      }
    }, 3000);
  }, [currentSet.title, currentSetIndex, wordSets.length, settings.autoAdvance, addPoints, completeSession, nextSet]);

  // Move to next word
  const nextWord = useCallback(() => {
    if (currentWordIndex >= currentSet.words.length - 1) {
      // Set complete
      completeSet();
    } else {
      setCurrentWordIndex(currentWordIndex + 1);
    }
  }, [currentWordIndex, currentSet.words.length, completeSet]);

  // Update the ref whenever nextWord changes
  useEffect(() => {
    nextWordRef.current = nextWord;
  }, [nextWord]);

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
                <div className="text-2xl font-bold text-green-600">{sessionData.wordsShown}</div>
                <div className="text-sm text-gray-500">Words Seen</div>
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
        filter: `brightness(${settings.brightness}%)`
      }}
    >
      {/* Header - Only show when not displaying words */}
      <AnimatePresence>
        {!showWord && (
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
                    <h1 className="text-xl font-bold text-gray-800">Doman Method Reading</h1>
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
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={emergencyStop}
                    className="bg-red-600 hover:bg-red-700"
                    aria-label="Emergency Stop"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Stop
                  </Button>
                </div>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && !showWord && (
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
                      <option value={1000}>1 second</option>
                      <option value={1500}>1.5 seconds</option>
                      <option value={2000}>2 seconds</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-2">Words Per Set</label>
                    <select
                      value={settings.wordsPerSet}
                      onChange={(e) => setSettings({
                        ...settings,
                        wordsPerSet: parseInt(e.target.value)
                      })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value={3}>3 words</option>
                      <option value={5}>5 words</option>
                      <option value={7}>7 words</option>
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
                      <option value={120}>120px</option>
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
                      variant={settings.audioEnabled ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSettings({
                        ...settings,
                        audioEnabled: !settings.audioEnabled
                      })}
                      className="w-full"
                    >
                      {settings.audioEnabled ? 'Enabled' : 'Disabled'}
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
          {showWord && currentWord ? (
            <motion.div
              key={`${currentSetIndex}-${currentWordIndex}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div 
                className="font-bold lowercase tracking-wide"
                style={{ 
                  fontSize: `${settings.fontSize}px`,
                  color: settings.textColor,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                {currentWord}
              </div>
            </motion.div>
          ) : showCelebration ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-center"
            >
              <div className="text-8xl mb-4">🎉</div>
              <div className="text-4xl font-bold text-green-600 mb-2">
                Wonderful!
              </div>
              <div className="text-xl text-gray-600">
                Set "{currentSet.title}" completed!
              </div>
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
                    {currentSet.title} Words
                  </CardTitle>
                  <div className="text-gray-600 mb-4">
                    {currentSet.description}
                  </div>
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      Set {currentSetIndex + 1} of {wordSets.length}
                    </Badge>
                    <Badge variant="outline">
                      Word {currentWordIndex + 1} of {currentSet.words.length}
                    </Badge>
                  </div>
                  <Progress 
                    value={((currentWordIndex + 1) / currentSet.words.length) * 100} 
                    className="h-3 mb-6"
                  />
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-6xl mb-4">👁️</div>
                    <div className="text-xl font-semibold text-gray-800 mb-2">
                      Ready to see words?
                    </div>
                    <div className="text-gray-600 mb-6">
                      Words will appear one at a time for {settings.displayDuration / 1000} second{settings.displayDuration !== 1000 ? 's' : ''}
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
                        <span>Words: {sessionData.wordsShown}</span>
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

      {/* Brightness Recommendation */}
      {!showWord && (
        <div className="fixed bottom-4 right-4">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Sun className="w-4 h-4" />
                <span>Adjust screen brightness for comfort</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}