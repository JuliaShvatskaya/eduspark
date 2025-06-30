'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter
} from 'recharts';
import {
  BookOpen,
  Brain,
  Mic,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Clock,
  Eye,
  Zap,
  Star,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Download,
  Calendar,
  BarChart3,
  Home,
  User,
  Activity,
  Focus,
  Volume2,
  Puzzle,
  Timer,
  Users,
  Settings,
  FileText,
  Printer
} from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/providers/UserProvider';
import { Header } from '@/components/ui/header';

// Comprehensive metrics interface based on Russian specifications
interface ComprehensiveMetrics {
  // Чтение (Reading)
  reading: {
    speed: { current: number; target: number; trend: number; wpm: number; spm: number };
    accuracy: { current: number; target: number; trend: number; errorTypes: string[] };
    comprehension: { current: number; target: number; trend: number; questionTypes: Record<string, number> };
    syllableReading: { current: number; target: number; trend: number; complexity: Record<string, number> };
    vocabularyGrowth: { current: number; target: number; trend: number; newWords: number; retention: number };
  };
  
  // Внимание (Attention)
  attention: {
    concentrationDuration: { current: number; target: number; trend: number; maxSession: number };
    sustainability: { current: number; target: number; trend: number; fatigueRate: number };
    taskSwitching: { current: number; target: number; trend: number; switchingSpeed: number };
    attentionSpan: { current: number; target: number; trend: number; distractionResistance: number };
    selectiveAttention: { current: number; target: number; trend: number; filteringEfficiency: number };
  };
  
  // Речь (Speech)
  speech: {
    pronunciationAccuracy: { current: number; target: number; trend: number; phonemeAccuracy: Record<string, number> };
    connectedSpeech: { current: number; target: number; trend: number; sentenceComplexity: number; fluency: number };
    speechComprehension: { current: number; target: number; trend: number; contextualUnderstanding: number };
    activeVocabulary: { current: number; target: number; trend: number; usageFrequency: Record<string, number> };
    passiveVocabulary: { current: number; target: number; trend: number; recognitionAccuracy: number };
  };
  
  // Мышление (Thinking)
  cognitive: {
    logicalThinking: { current: number; target: number; trend: number; problemSolvingSteps: number };
    criticalThinking: { current: number; target: number; trend: number; analysisDepth: number };
    spatialReasoning: { current: number; target: number; trend: number; visualProcessing: number };
    creativeThinking: { current: number; target: number; trend: number; originalityScore: number };
  };
}

interface ContinuousObservation {
  timestamp: string;
  activity: string;
  performance: number;
  duration: number;
  attempts: number;
  difficulty: string;
  engagement: 'high' | 'medium' | 'low';
  notes: string;
}

interface FormativeAssessment {
  skill: string;
  category: string;
  assessment: number;
  improvement: number;
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
}

export default function ComprehensiveProgressReport() {
  const { user } = useUser();
  const [viewMode, setViewMode] = useState<'child' | 'parent' | 'teacher'>('parent');
  const [reportPeriod, setReportPeriod] = useState<'day' | 'week' | 'month' | 'quarter'>('month');
  const [selectedDimension, setSelectedDimension] = useState<string>('overview');

  // Comprehensive metrics data
  const metrics: ComprehensiveMetrics = {
    reading: {
      speed: { current: 85, target: 100, trend: 12, wpm: 85, spm: 170 },
      accuracy: { current: 92, target: 95, trend: 8, errorTypes: ['substitution', 'omission'] },
      comprehension: { current: 78, target: 85, trend: 15, questionTypes: { literal: 85, inferential: 72, critical: 65 } },
      syllableReading: { current: 88, target: 90, trend: 5, complexity: { simple: 95, complex: 82, multisyllabic: 75 } },
      vocabularyGrowth: { current: 156, target: 200, trend: 23, newWords: 28, retention: 87 }
    },
    attention: {
      concentrationDuration: { current: 18, target: 25, trend: 20, maxSession: 22 },
      sustainability: { current: 75, target: 85, trend: 10, fatigueRate: 15 },
      taskSwitching: { current: 82, target: 90, trend: 7, switchingSpeed: 3.2 },
      attentionSpan: { current: 22, target: 30, trend: 18, distractionResistance: 78 },
      selectiveAttention: { current: 79, target: 85, trend: 12, filteringEfficiency: 82 }
    },
    speech: {
      pronunciationAccuracy: { current: 87, target: 95, trend: 14, phonemeAccuracy: { 'р': 65, 'л': 88, 'ш': 92 } },
      connectedSpeech: { current: 73, target: 85, trend: 19, sentenceComplexity: 4.2, fluency: 78 },
      speechComprehension: { current: 91, target: 95, trend: 6, contextualUnderstanding: 89 },
      activeVocabulary: { current: 342, target: 500, trend: 28, usageFrequency: { daily: 156, weekly: 98, rare: 88 } },
      passiveVocabulary: { current: 678, target: 800, trend: 22, recognitionAccuracy: 94 }
    },
    cognitive: {
      logicalThinking: { current: 76, target: 85, trend: 16, problemSolvingSteps: 3.8 },
      criticalThinking: { current: 68, target: 80, trend: 21, analysisDepth: 2.9 },
      spatialReasoning: { current: 84, target: 90, trend: 9, visualProcessing: 87 },
      creativeThinking: { current: 89, target: 95, trend: 11, originalityScore: 92 }
    }
  };

  // Continuous observation data
  const observations: ContinuousObservation[] = [
    {
      timestamp: '2024-04-01T09:15:00Z',
      activity: 'Syllable Reading',
      performance: 88,
      duration: 12,
      attempts: 3,
      difficulty: 'medium',
      engagement: 'high',
      notes: 'Excellent focus, struggled with complex syllables'
    },
    {
      timestamp: '2024-04-01T09:30:00Z',
      activity: 'Memory Match',
      performance: 92,
      duration: 8,
      attempts: 1,
      difficulty: 'easy',
      engagement: 'high',
      notes: 'Quick completion, good pattern recognition'
    },
    {
      timestamp: '2024-04-01T09:45:00Z',
      activity: 'Vocabulary Building',
      performance: 76,
      duration: 15,
      attempts: 2,
      difficulty: 'hard',
      engagement: 'medium',
      notes: 'New words challenging, good retention of familiar ones'
    }
  ];

  // Formative assessments
  const assessments: FormativeAssessment[] = [
    {
      skill: 'Reading Comprehension',
      category: 'reading',
      assessment: 78,
      improvement: 15,
      recommendation: 'Focus on inferential questions and context clues',
      priority: 'high'
    },
    {
      skill: 'Attention Sustainability',
      category: 'attention',
      assessment: 75,
      improvement: 10,
      recommendation: 'Gradually increase session duration with breaks',
      priority: 'medium'
    },
    {
      skill: 'Connected Speech',
      category: 'speech',
      assessment: 73,
      improvement: 19,
      recommendation: 'Practice storytelling and sentence expansion',
      priority: 'medium'
    },
    {
      skill: 'Critical Thinking',
      category: 'cognitive',
      assessment: 68,
      improvement: 21,
      recommendation: 'Introduce analysis and evaluation activities',
      priority: 'low'
    }
  ];

  // Time series data for trends
  const timeSeriesData = [
    { date: '2024-01-01', reading: 65, attention: 60, speech: 58, cognitive: 62 },
    { date: '2024-01-15', reading: 68, attention: 65, speech: 62, cognitive: 65 },
    { date: '2024-02-01', reading: 72, attention: 68, speech: 66, cognitive: 68 },
    { date: '2024-02-15', reading: 75, attention: 72, speech: 69, cognitive: 71 },
    { date: '2024-03-01', reading: 78, attention: 75, speech: 72, cognitive: 74 },
    { date: '2024-03-15', reading: 82, attention: 78, speech: 75, cognitive: 77 },
    { date: '2024-04-01', reading: 85, attention: 80, speech: 78, cognitive: 79 }
  ];

  // Age-appropriate benchmarks
  const ageBenchmarks = {
    reading: { min: 60, avg: 80, max: 100 },
    attention: { min: 15, avg: 20, max: 30 },
    speech: { min: 250, avg: 400, max: 600 },
    cognitive: { min: 65, avg: 80, max: 95 }
  };

  const getPerformanceColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 10) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-yellow-600" />;
    return <TrendingDown className="w-4 h-4 text-red-600" />;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderChildView = () => (
    <div className="space-y-6">
      {/* Child-friendly progress visualization */}
      <Card className="bg-gradient-to-r from-blue-400 to-purple-500 text-white border-0">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🌟</div>
            <h2 className="text-2xl font-bold mb-2">Amazing Progress, {user?.name}!</h2>
            <p className="text-lg opacity-90">You're becoming a super learner!</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-white/20 rounded-lg p-3">
                <div className="text-2xl font-bold">85</div>
                <div className="text-sm">Reading Speed</div>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <div className="text-2xl font-bold">18</div>
                <div className="text-sm">Focus Time</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievement collection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-yellow-500" />
            <span>My Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Reading Star', 'Memory Master', 'Word Builder', 'Focus Champion'].map((achievement, index) => (
              <div key={index} className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="text-3xl mb-2">🏆</div>
                <div className="font-semibold text-sm">{achievement}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Simple progress tree */}
      <Card>
        <CardHeader>
          <CardTitle>My Learning Tree</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-8xl mb-4">🌳</div>
            <p className="text-gray-600">Your learning tree is growing! Each skill you master adds a new leaf.</p>
            <div className="mt-4 flex justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm">Reading Leaves: 12</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Focus Leaves: 8</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderParentView = () => (
    <div className="space-y-6">
      {/* Comprehensive overview */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <span>Multi-Dimensional Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="reading" stroke="#3B82F6" strokeWidth={2} name="Reading" />
                <Line type="monotone" dataKey="attention" stroke="#8B5CF6" strokeWidth={2} name="Attention" />
                <Line type="monotone" dataKey="speech" stroke="#10B981" strokeWidth={2} name="Speech" />
                <Line type="monotone" dataKey="cognitive" stroke="#F59E0B" strokeWidth={2} name="Cognitive" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Continuous Observation Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {observations.slice(0, 3).map((obs, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{obs.activity}</h4>
                    <Badge className={`${obs.engagement === 'high' ? 'bg-green-100 text-green-800' : 
                      obs.engagement === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {obs.engagement} engagement
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">{obs.notes}</div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Performance: {obs.performance}%</span>
                    <span>Duration: {obs.duration}min</span>
                    <span>Attempts: {obs.attempts}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed skill breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Formative Assessment Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {assessments.map((assessment, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold">{assessment.skill}</h4>
                  <Badge className={getPriorityColor(assessment.priority)}>
                    {assessment.priority} priority
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Level: {assessment.assessment}%</span>
                    <span className="text-green-600">+{assessment.improvement}% improvement</span>
                  </div>
                  <Progress value={assessment.assessment} className="h-2" />
                  <p className="text-sm text-gray-600">{assessment.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Age-appropriate benchmarks */}
      <Card>
        <CardHeader>
          <CardTitle>Age Group Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(ageBenchmarks).map(([skill, benchmark]) => (
              <div key={skill} className="text-center p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold capitalize mb-2">{skill}</h4>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {skill === 'reading' ? metrics.reading.speed.current :
                   skill === 'attention' ? metrics.attention.concentrationDuration.current :
                   skill === 'speech' ? metrics.speech.activeVocabulary.current :
                   metrics.cognitive.logicalThinking.current}
                </div>
                <div className="text-xs text-gray-500">
                  Range: {benchmark.min}-{benchmark.max}
                </div>
                <div className="text-xs text-gray-500">
                  Average: {benchmark.avg}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTeacherView = () => (
    <div className="space-y-6">
      {/* Professional analytics dashboard */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Comprehensive Skill Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={[
                { skill: 'Reading Speed', current: 85, target: 100 },
                { skill: 'Reading Accuracy', current: 92, target: 95 },
                { skill: 'Comprehension', current: 78, target: 85 },
                { skill: 'Attention Span', current: 79, target: 85 },
                { skill: 'Speech Clarity', current: 87, target: 95 },
                { skill: 'Vocabulary', current: 68, target: 80 },
                { skill: 'Logic', current: 76, target: 85 },
                { skill: 'Creativity', current: 89, target: 95 }
              ]}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Current" dataKey="current" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                <Radar name="Target" dataKey="target" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Intervention Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 text-sm">High Priority</h4>
                <p className="text-red-700 text-xs mt-1">Reading comprehension requires immediate attention. Implement guided reading strategies.</p>
              </div>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 text-sm">Medium Priority</h4>
                <p className="text-yellow-700 text-xs mt-1">Attention sustainability can be improved with structured breaks and gradual increases.</p>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 text-sm">Strength Area</h4>
                <p className="text-green-700 text-xs mt-1">Creative thinking is exceptional. Use this strength to support other learning areas.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Error Pattern Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Reading Errors</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Substitution: 18 errors (15%)</li>
                <li>• Omission: 10 errors (8%)</li>
                <li>• Insertion: 4 errors (3%)</li>
                <li>• Total: 32/125 assignments</li>
              </ul>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Attention Patterns</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Morning peak: 9-11 AM</li>
                <li>• Fatigue onset: 20 min</li>
                <li>• Distraction errors: 12/55 tasks</li>
                <li>• Error rate: 22%</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Speech Analysis</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Phoneme 'р': 10/76 errors</li>
                <li>• Sentence length: 4.2 words</li>
                <li>• Fluency errors: 14/52 tasks</li>
              </ul>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Cognitive Metrics</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Problem steps: 3.8 avg</li>
                <li>• Analysis depth: 2.9/5</li>
                <li>• Logic errors: 10/42 tasks</li>
                <li>• Critical thinking errors: 10/31 tasks</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual learning plan constructor */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Learning Plan Constructor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Immediate Goals (1-2 weeks)</h4>
                <ul className="text-sm space-y-1">
                  <li>• Improve reading comprehension to 82%</li>
                  <li>• Extend attention span to 20 minutes</li>
                  <li>• Practice 'р' sound pronunciation</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Short-term Goals (1 month)</h4>
                <ul className="text-sm space-y-1">
                  <li>• Achieve 90 WPM reading speed</li>
                  <li>• Maintain 25-minute focus sessions</li>
                  <li>• Expand active vocabulary by 50 words</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Long-term Goals (3 months)</h4>
                <ul className="text-sm space-y-1">
                  <li>• Master complex syllable patterns</li>
                  <li>• Develop critical thinking skills</li>
                  <li>• Achieve age-appropriate benchmarks</li>
                </ul>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" className="bg-blue-600">
                <FileText className="w-4 h-4 mr-2" />
                Generate IEP
              </Button>
              <Button size="sm" variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Share with Team
              </Button>
              <Button size="sm" variant="outline">
                <Printer className="w-4 h-4 mr-2" />
                Print Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading comprehensive progress report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header title="Comprehensive Progress Report">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-500" />
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as 'child' | 'parent' | 'teacher')}
              className="text-sm border rounded-md px-2 py-1"
            >
              <option value="child">Child View</option>
              <option value="parent">Parent View</option>
              <option value="teacher">Teacher/Specialist View</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={reportPeriod}
              onChange={(e) => setReportPeriod(e.target.value as 'day' | 'week' | 'month' | 'quarter')}
              className="text-sm border rounded-md px-2 py-1"
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </Header>

      <div className="container mx-auto px-4 py-8">
        {/* Student Info Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-6xl">{user.avatar}</div>
                  <div>
                    <h2 className="text-2xl font-bold">{user.name}'s Learning Journey</h2>
                    <p className="text-lg opacity-90">Age {user.age} • Level {user.level}</p>
                    <p className="text-sm opacity-75">
                      {viewMode === 'child' ? 'Your Amazing Progress!' : 
                       viewMode === 'parent' ? 'Comprehensive Parent Report' : 
                       'Professional Assessment Dashboard'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{user.points}</div>
                  <div className="text-sm opacity-75">Total Points</div>
                  <div className="text-lg font-semibold mt-2">
                    Overall Progress: {Math.round((85 + 79 + 78 + 79) / 4)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Dynamic content based on view mode */}
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === 'child' && renderChildView()}
          {viewMode === 'parent' && renderParentView()}
          {viewMode === 'teacher' && renderTeacherView()}
        </motion.div>
      </div>
    </div>
  );
}