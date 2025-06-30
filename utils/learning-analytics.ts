// Learning Analytics Utilities
// Track and analyze user learning patterns and progress

export interface LearningSession {
  id: string;
  userId: string;
  moduleType: 'reading' | 'attention' | 'speed-reading';
  exerciseId: string;
  startTime: Date;
  endTime: Date;
  accuracy: number;
  pointsEarned: number;
  timeSpent: number; // in seconds
  difficulty: string;
  attempts: number;
}

export interface SkillProgress {
  skill: string;
  currentLevel: number;
  experiencePoints: number;
  accuracy: number;
  timeSpent: number;
  sessionsCompleted: number;
  lastActivity: Date;
  improvements: {
    speed: number; // percentage improvement
    accuracy: number; // percentage improvement
    consistency: number; // percentage improvement
  };
}

export interface LearningInsights {
  strongAreas: string[];
  improvementAreas: string[];
  recommendedExercises: string[];
  optimalLearningTime: string;
  averageSessionLength: number;
  weeklyProgress: number;
}

class LearningAnalyticsService {
  private sessions: LearningSession[] = [];
  private skillsProgress: Map<string, SkillProgress> = new Map();

  // Record a learning session
  recordSession(session: Omit<LearningSession, 'id'>): string {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullSession: LearningSession = {
      ...session,
      id: sessionId,
    };

    this.sessions.push(fullSession);
    this.updateSkillProgress(session);
    
    return sessionId;
  }

  // Update skill progress based on session data
  private updateSkillProgress(session: Omit<LearningSession, 'id'>): void {
    const skillKey = `${session.moduleType}_${session.exerciseId}`;
    const existing = this.skillsProgress.get(skillKey);

    if (existing) {
      existing.experiencePoints += session.pointsEarned;
      existing.timeSpent += session.timeSpent;
      existing.sessionsCompleted += 1;
      existing.lastActivity = session.endTime;
      
      // Calculate running average for accuracy
      existing.accuracy = (existing.accuracy + session.accuracy) / 2;
      
      // Update current level based on experience points
      existing.currentLevel = Math.floor(existing.experiencePoints / 100) + 1;
    } else {
      this.skillsProgress.set(skillKey, {
        skill: skillKey,
        currentLevel: 1,
        experiencePoints: session.pointsEarned,
        accuracy: session.accuracy,
        timeSpent: session.timeSpent,
        sessionsCompleted: 1,
        lastActivity: session.endTime,
        improvements: {
          speed: 0,
          accuracy: 0,
          consistency: 0
        }
      });
    }
  }

  // Generate learning insights for a user
  generateInsights(userId: string): LearningInsights {
    const userSessions = this.sessions.filter(s => s.userId === userId);
    
    if (userSessions.length === 0) {
      return {
        strongAreas: [],
        improvementAreas: [],
        recommendedExercises: [],
        optimalLearningTime: 'Morning',
        averageSessionLength: 0,
        weeklyProgress: 0
      };
    }

    // Calculate performance by module
    const modulePerformance = this.calculateModulePerformance(userSessions);
    
    // Identify strong and weak areas
    const sortedModules = Object.entries(modulePerformance)
      .sort(([, a], [, b]) => b.accuracy - a.accuracy);
    
    const strongAreas = sortedModules.slice(0, 2).map(([module]) => module);
    const improvementAreas = sortedModules.slice(-2).map(([module]) => module);

    // Calculate optimal learning time
    const timePerformance = this.calculateTimePerformance(userSessions);
    const optimalLearningTime = this.getOptimalTime(timePerformance);

    // Calculate average session length
    const averageSessionLength = userSessions.reduce((sum, session) => 
      sum + session.timeSpent, 0) / userSessions.length;

    // Calculate weekly progress
    const weeklyProgress = this.calculateWeeklyProgress(userSessions);

    // Generate recommendations
    const recommendedExercises = this.generateRecommendations(modulePerformance);

    return {
      strongAreas,
      improvementAreas,
      recommendedExercises,
      optimalLearningTime,
      averageSessionLength,
      weeklyProgress
    };
  }

  // Calculate performance metrics by module
  private calculateModulePerformance(sessions: LearningSession[]): Record<string, {
    accuracy: number;
    averageTime: number;
    sessionsCount: number;
  }> {
    const moduleStats: Record<string, {
      totalAccuracy: number;
      totalTime: number;
      sessionsCount: number;
    }> = {};

    sessions.forEach(session => {
      if (!moduleStats[session.moduleType]) {
        moduleStats[session.moduleType] = {
          totalAccuracy: 0,
          totalTime: 0,
          sessionsCount: 0
        };
      }

      moduleStats[session.moduleType].totalAccuracy += session.accuracy;
      moduleStats[session.moduleType].totalTime += session.timeSpent;
      moduleStats[session.moduleType].sessionsCount += 1;
    });

    // Calculate averages
    return Object.entries(moduleStats).reduce((acc, [module, stats]) => {
      acc[module] = {
        accuracy: stats.totalAccuracy / stats.sessionsCount,
        averageTime: stats.totalTime / stats.sessionsCount,
        sessionsCount: stats.sessionsCount
      };
      return acc;
    }, {} as Record<string, { accuracy: number; averageTime: number; sessionsCount: number; }>);
  }

  // Calculate performance by time of day
  private calculateTimePerformance(sessions: LearningSession[]): Record<string, number> {
    type TimeSlotKey = 'Morning (6-12)' | 'Afternoon (12-18)' | 'Evening (18-24)';
    
    const timeSlots: Record<TimeSlotKey, number> = {
      'Morning (6-12)': 0,
      'Afternoon (12-18)': 0,
      'Evening (18-24)': 0
    };

    const timeCounts: Record<TimeSlotKey, number> = { ...timeSlots };

    sessions.forEach(session => {
      const hour = session.startTime.getHours();
      let slot: TimeSlotKey;
      
      if (hour >= 6 && hour < 12) slot = 'Morning (6-12)';
      else if (hour >= 12 && hour < 18) slot = 'Afternoon (12-18)';
      else slot = 'Evening (18-24)';

      timeSlots[slot] += session.accuracy;
      timeCounts[slot] += 1;
    });

    // Calculate averages
    (Object.keys(timeSlots) as TimeSlotKey[]).forEach(slot => {
      if (timeCounts[slot] > 0) {
        timeSlots[slot] = timeSlots[slot] / timeCounts[slot];
      }
    });

    return timeSlots;
  }

  // Get optimal learning time
  private getOptimalTime(timePerformance: Record<string, number>): string {
    return Object.entries(timePerformance)
      .sort(([, a], [, b]) => b - a)[0][0]
      .split(' ')[0]; // Extract just "Morning", "Afternoon", or "Evening"
  }

  // Calculate weekly progress
  private calculateWeeklyProgress(sessions: LearningSession[]): number {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentSessions = sessions.filter(s => s.startTime >= oneWeekAgo);
    const olderSessions = sessions.filter(s => s.startTime < oneWeekAgo);

    if (olderSessions.length === 0) return 0;

    const recentAvgAccuracy = recentSessions.reduce((sum, s) => sum + s.accuracy, 0) / recentSessions.length;
    const olderAvgAccuracy = olderSessions.reduce((sum, s) => sum + s.accuracy, 0) / olderSessions.length;

    return ((recentAvgAccuracy - olderAvgAccuracy) / olderAvgAccuracy) * 100;
  }

  // Generate exercise recommendations
  private generateRecommendations(modulePerformance: Record<string, any>): string[] {
    const recommendations: string[] = [];

    Object.entries(modulePerformance).forEach(([module, performance]) => {
      if (performance.accuracy < 70) {
        recommendations.push(`Focus more on ${module} exercises`);
      } else if (performance.accuracy > 90) {
        recommendations.push(`Try advanced ${module} challenges`);
      }
    });

    if (recommendations.length === 0) {
      recommendations.push('Continue with current learning path');
    }

    return recommendations;
  }

  // Get skill progress for a user
  getSkillProgress(userId: string): SkillProgress[] {
    return Array.from(this.skillsProgress.values());
  }

  // Calculate adaptive difficulty for next exercise
  calculateAdaptiveDifficulty(userId: string, moduleType: string): 'beginner' | 'intermediate' | 'advanced' {
    const userSessions = this.sessions
      .filter(s => s.userId === userId && s.moduleType === moduleType)
      .slice(-5); // Last 5 sessions

    if (userSessions.length === 0) return 'beginner';

    const avgAccuracy = userSessions.reduce((sum, s) => sum + s.accuracy, 0) / userSessions.length;
    const avgTime = userSessions.reduce((sum, s) => sum + s.timeSpent, 0) / userSessions.length;

    if (avgAccuracy >= 85 && avgTime <= 60) return 'advanced';
    else if (avgAccuracy >= 70 && avgTime <= 90) return 'intermediate';
    else return 'beginner';
  }

  // Export analytics data (for parent dashboard)
  exportAnalytics(userId: string): any {
    const userSessions = this.sessions.filter(s => s.userId === userId);
    const insights = this.generateInsights(userId);
    const skillProgress = this.getSkillProgress(userId);

    return {
      totalSessions: userSessions.length,
      totalTimeSpent: userSessions.reduce((sum, s) => sum + s.timeSpent, 0),
      totalPointsEarned: userSessions.reduce((sum, s) => sum + s.pointsEarned, 0),
      averageAccuracy: userSessions.reduce((sum, s) => sum + s.accuracy, 0) / userSessions.length,
      insights,
      skillProgress,
      recentSessions: userSessions.slice(-10),
    };
  }
}

// Export singleton instance
export const learningAnalytics = new LearningAnalyticsService();

// Utility functions for data visualization
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const getProgressColor = (percentage: number): string => {
  if (percentage >= 80) return 'text-green-600';
  if (percentage >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

export const getSkillLevel = (experiencePoints: number): string => {
  const level = Math.floor(experiencePoints / 100) + 1;
  if (level <= 3) return 'Beginner';
  if (level <= 7) return 'Intermediate';
  return 'Advanced';
};