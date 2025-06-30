'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  BookOpen,
  Brain,
  Calendar,
  Clock,
  Home,
  Settings,
  Star,
  Target,
  TrendingUp,
  Trophy,
  User,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/providers/UserProvider';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Header } from '@/components/ui/header';
import Image from 'next/image';

export default function ParentDashboard() {
  const { user } = useUser();

  const weeklyProgress = [
    { 
      day: 'Mon', 
      reading: { score: 85, errors: 12, total: 45 }, 
      attention: { score: 70, errors: 8, total: 25 }, 
      speed: { score: 60, errors: 15, total: 30 } 
    },
    { 
      day: 'Tue', 
      reading: { score: 88, errors: 10, total: 42 }, 
      attention: { score: 75, errors: 6, total: 28 }, 
      speed: { score: 65, errors: 12, total: 32 } 
    },
    { 
      day: 'Wed', 
      reading: { score: 82, errors: 14, total: 48 }, 
      attention: { score: 80, errors: 5, total: 30 }, 
      speed: { score: 70, errors: 10, total: 35 } 
    },
    { 
      day: 'Thu', 
      reading: { score: 90, errors: 8, total: 40 }, 
      attention: { score: 85, errors: 4, total: 32 }, 
      speed: { score: 75, errors: 8, total: 38 } 
    },
    { 
      day: 'Fri', 
      reading: { score: 95, errors: 6, total: 38 }, 
      attention: { score: 88, errors: 3, total: 35 }, 
      speed: { score: 80, errors: 6, total: 40 } 
    },
    { 
      day: 'Sat', 
      reading: { score: 92, errors: 7, total: 41 }, 
      attention: { score: 90, errors: 2, total: 38 }, 
      speed: { score: 85, errors: 5, total: 42 } 
    },
    { 
      day: 'Sun', 
      reading: { score: 98, errors: 4, total: 36 }, 
      attention: { score: 92, errors: 2, total: 40 }, 
      speed: { score: 88, errors: 4, total: 45 } 
    },
  ];

  const skillProgress = [
    { 
      skill: 'Phonics', 
      currentScore: 85, 
      targetScore: 100, 
      totalAssignments: 120, 
      errorCount: 18, 
      errorRate: 15,
      level: 'Proficient' 
    },
    { 
      skill: 'Syllables', 
      currentScore: 75, 
      targetScore: 90, 
      totalAssignments: 95, 
      errorCount: 19, 
      errorRate: 20,
      level: 'Developing' 
    },
    { 
      skill: 'Word Building', 
      currentScore: 90, 
      targetScore: 95, 
      totalAssignments: 78, 
      errorCount: 8, 
      errorRate: 10,
      level: 'Proficient' 
    },
    { 
      skill: 'Memory Games', 
      currentScore: 70, 
      targetScore: 85, 
      totalAssignments: 65, 
      errorCount: 20, 
      errorRate: 31,
      level: 'Beginning' 
    },
    { 
      skill: 'Pattern Recognition', 
      currentScore: 80, 
      targetScore: 90, 
      totalAssignments: 55, 
      errorCount: 11, 
      errorRate: 20,
      level: 'Developing' 
    },
    { 
      skill: 'Speed Reading', 
      currentScore: 60, 
      targetScore: 80, 
      totalAssignments: 42, 
      errorCount: 17, 
      errorRate: 40,
      level: 'Beginning' 
    },
  ];

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Parent Dashboard">
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="font-semibold text-gray-800">{user.name}'s Progress</p>
            <p className="text-sm text-gray-600">Age {user.age} • Level {user.level}</p>
          </div>
          <span className="text-2xl">{user.avatar}</span>
          <Link href="/child-dashboard">
            <Button variant="outline" size="sm">
              <User className="w-4 h-4 mr-2" />
              Child View
            </Button>
          </Link>
          <Link href="/progress-report">
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Full Report
            </Button>
          </Link>
          <Link href="/auth/sign-out">
            <Button variant="ghost" size="sm">
              Sign Out
            </Button>
          </Link>
        </div>
      </Header>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.points}</div>
              <p className="text-xs text-green-600">+23 from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Level</CardTitle>
              <Target className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.level}</div>
              <p className="text-xs text-blue-600">{100 - (user.points % 100)} points to next level</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
              <Calendar className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7 days</div>
              <p className="text-xs text-orange-600">Keep it up!</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Achievements</CardTitle>
              <Trophy className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.achievements.length}</div>
              <p className="text-xs text-purple-600">3 this week</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <Tabs defaultValue="progress" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="recommendations">Tips</TabsTrigger>
          </TabsList>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span>Weekly Learning Progress</span>
                  </CardTitle>
                  <CardDescription>
                    Track your child's daily engagement across different learning modules
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weeklyProgress}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="reading.score" 
                        stroke="#3B82F6" 
                        strokeWidth={3}
                        name="Reading"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="attention.score" 
                        stroke="#8B5CF6" 
                        strokeWidth={3}
                        name="Attention"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="speed.score" 
                        stroke="#F97316" 
                        strokeWidth={3}
                        name="Speed Reading"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Time</CardTitle>
                  <CardDescription>Daily learning session duration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Today</span>
                      <span className="font-semibold">45 minutes</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">This week average</span>
                      <span className="font-semibold">38 minutes</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Recommended</span>
                      <span className="text-green-600 font-semibold">30-45 minutes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Module Performance</CardTitle>
                  <CardDescription>Current performance by learning area</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <BookOpen className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">Reading</span>
                        </div>
                        <span className="text-sm font-semibold">Score: 92/100</span>
                      </div>
                      <Progress value={92} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Errors: 28/156 tasks</span>
                        <span className="text-yellow-600">18% error rate</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Brain className="w-4 h-4 text-purple-500" />
                          <span className="text-sm">Attention</span>
                        </div>
                        <span className="text-sm font-semibold">Score: 85/100</span>
                      </div>
                      <Progress value={85} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Errors: 15/78 tasks</span>
                        <span className="text-yellow-600">19% error rate</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Zap className="w-4 h-4 text-orange-500" />
                          <span className="text-sm">Speed Reading</span>
                        </div>
                        <span className="text-sm font-semibold">Score: 72/100</span>
                      </div>
                      <Progress value={72} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Errors: 18/65 tasks</span>
                        <span className="text-red-600">28% error rate</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Skill Development</CardTitle>
                  <CardDescription>
                    Detailed breakdown of specific skills and competencies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {skillProgress.map((skill, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{skill.skill}</span>
                          <div className="flex items-center space-x-2">
                            <Badge variant={skill.level === 'Proficient' ? 'default' : skill.level === 'Developing' ? 'secondary' : 'outline'}>
                              {skill.level}
                            </Badge>
                            <span className="text-sm text-gray-600">{skill.currentScore}/{skill.targetScore}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Score Progress</span>
                            <span>{Math.round((skill.currentScore / skill.targetScore) * 100)}%</span>
                          </div>
                          <Progress value={(skill.currentScore / skill.targetScore) * 100} className="h-2" />
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Errors: {skill.errorCount}/{skill.totalAssignments}</span>
                            <span className={`font-medium ${skill.errorRate > 25 ? 'text-red-600' : skill.errorRate > 15 ? 'text-yellow-600' : 'text-green-600'}`}>
                              {skill.errorRate}% error rate
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div 
                              className={`h-1 rounded-full ${skill.errorRate > 25 ? 'bg-red-500' : skill.errorRate > 15 ? 'bg-yellow-500' : 'bg-green-500'}`}
                              style={{ width: `${skill.errorRate}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span>Achievements & Milestones</span>
                  </CardTitle>
                  <CardDescription>
                    Celebrate your child's learning accomplishments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {user.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                          <Star className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{achievement}</h4>
                          <p className="text-sm text-gray-600">Completed recently</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Personalized Learning Tips</CardTitle>
                  <CardDescription>
                    Recommendations based on your child's learning patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2">Reading Focus</h4>
                      <p className="text-blue-700">
                        {user.name} shows good progress with current score of 92/100 but has 18% error rate (28 errors in 156 tasks). Focus on accuracy improvement.
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">Optimal Learning Time</h4>
                      <p className="text-green-700">
                        Based on error rate analysis, {user.name} performs best during morning sessions with only 12% error rate compared to 25% in afternoons.
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-800 mb-2">Attention Training</h4>
                      <p className="text-purple-700">
                        Attention tasks show 19% error rate (15/78 tasks). Current score 85/100 indicates good progress but focus on reducing errors in sustained attention tasks.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}