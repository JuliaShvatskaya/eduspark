// Continuous Assessment and Formative Evaluation System
// Based on Russian educational framework for non-linear learning progress tracking

export interface LearningSession {
  id: string;
  userId: string;
  timestamp: Date;
  duration: number; // in seconds
  activities: ActivityRecord[];
  overallEngagement: 'high' | 'medium' | 'low';
  environmentalFactors: {
    timeOfDay: string;
    distractions: number;
    deviceType: string;
    location: string;
  };
  outcomes: SessionOutcome;
}

export interface ActivityRecord {
  activityId: string;
  activityType: 'reading' | 'attention' | 'speech' | 'cognitive';
  subSkill: string;
  startTime: Date;
  endTime: Date;
  attempts: number;
  accuracy: number;
  speed: number; // task-specific metric
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  engagement: 'high' | 'medium' | 'low';
  errorPatterns: string[];
  breakthroughs: string[];
  notes: string;
}

export interface SessionOutcome {
  skillsImproved: string[];
  skillsStagnant: string[];
  skillsRegressed: string[];
  newSkillsIntroduced: string[];
  adaptiveRecommendations: string[];
  nextSessionFocus: string[];
}

export interface FormativeAssessment {
  skill: string;
  category: 'reading' | 'attention' | 'speech' | 'cognitive';
  subCategory: string;
  currentLevel: number;
  targetLevel: number;
  progressRate: number; // improvement per week
  masteryIndicators: string[];
  strugglingAreas: string[];
  recommendations: AssessmentRecommendation[];
  lastAssessed: Date;
  nextAssessment: Date;
}

export interface AssessmentRecommendation {
  type: 'immediate' | 'short-term' | 'long-term';
  priority: 'high' | 'medium' | 'low';
  action: string;
  expectedOutcome: string;
  timeframe: string;
  resources: string[];
}

export interface ContinuousObservation {
  timestamp: Date;
  observationType: 'performance' | 'behavior' | 'engagement' | 'breakthrough' | 'difficulty';
  skill: string;
  observation: string;
  context: string;
  significance: 'high' | 'medium' | 'low';
  actionRequired: boolean;
  followUpDate?: Date;
}

export interface ProgressPattern {
  patternType: 'learning_curve' | 'plateau' | 'regression' | 'breakthrough' | 'inconsistency';
  skill: string;
  duration: number; // days
  description: string;
  possibleCauses: string[];
  interventions: string[];
  monitoring: string[];
}

export interface AdaptiveLearningPath {
  currentLevel: Record<string, number>;
  nextActivities: string[];
  difficultyAdjustments: Record<string, number>;
  focusAreas: string[];
  avoidanceAreas: string[];
  optimalSessionLength: number;
  preferredTimeSlots: string[];
  learningStyle: string;
}

class ContinuousAssessmentService {
  private sessions: LearningSession[] = [];
  private observations: ContinuousObservation[] = [];
  private assessments: Map<string, FormativeAssessment> = new Map();
  private patterns: ProgressPattern[] = [];

  // Record a complete learning session
  recordSession(session: Omit<LearningSession, 'id'>): string {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullSession: LearningSession = {
      ...session,
      id: sessionId,
    };

    this.sessions.push(fullSession);
    this.updateFormativeAssessments(fullSession);
    this.identifyProgressPatterns(session.userId);
    this.generateRealTimeInsights(session.userId);
    
    return sessionId;
  }

  // Add continuous observation
  addObservation(observation: ContinuousObservation): void {
    this.observations.push(observation);
    
    // Trigger immediate assessment if high significance
    if (observation.significance === 'high' && observation.actionRequired) {
      this.triggerImmediateAssessment(observation);
    }
  }

  // Update formative assessments based on session data
  private updateFormativeAssessments(session: LearningSession): void {
    session.activities.forEach(activity => {
      const assessmentKey = `${activity.activityType}_${activity.subSkill}`;
      const existing = this.assessments.get(assessmentKey);

      if (existing) {
        // Update existing assessment
        const newLevel = this.calculateNewLevel(existing, activity);
        const progressRate = this.calculateProgressRate(existing, newLevel);
        
        existing.currentLevel = newLevel;
        existing.progressRate = progressRate;
        existing.lastAssessed = new Date();
        existing.nextAssessment = this.calculateNextAssessmentDate(existing);
        
        // Update mastery indicators and struggling areas
        this.updateMasteryIndicators(existing, activity);
        this.updateRecommendations(existing, activity);
      } else {
        // Create new assessment
        this.assessments.set(assessmentKey, {
          skill: activity.subSkill,
          category: activity.activityType,
          subCategory: activity.subSkill,
          currentLevel: activity.accuracy,
          targetLevel: this.calculateTargetLevel(activity),
          progressRate: 0,
          masteryIndicators: this.identifyMasteryIndicators(activity),
          strugglingAreas: this.identifyStrugglingAreas(activity),
          recommendations: this.generateInitialRecommendations(activity),
          lastAssessed: new Date(),
          nextAssessment: this.calculateNextAssessmentDate()
        });
      }
    });
  }

  // Identify progress patterns
  private identifyProgressPatterns(userId: string): void {
    const userSessions = this.sessions.filter(s => s.userId === userId).slice(-10);
    
    if (userSessions.length < 3) return;

    // Analyze learning curves
    this.analyzeLearningCurves(userSessions);
    
    // Detect plateaus
    this.detectPlateaus(userSessions);
    
    // Check for regression patterns
    this.checkRegressionPatterns(userSessions);
  }

  private checkRegressionPatterns(sessions: LearningSession[]): void {
    const skillAccuracyMap: Record<string, number[]> = {};

    sessions.forEach(session => {
      session.activities.forEach(activity => {
        const skillKey = `${activity.activityType}_${activity.subSkill}`;
        if (!skillAccuracyMap[skillKey]) {
          skillAccuracyMap[skillKey] = [];
        }
        skillAccuracyMap[skillKey].push(activity.accuracy);
      });
    });

    Object.entries(skillAccuracyMap).forEach(([skill, accuracies]) => {
      if (accuracies.length >= 3) {
        const trend = this.calculateTrend(accuracies);
        if (trend < -0.1) {
          this.patterns.push({
            patternType: 'regression',
            skill,
            duration: sessions.length,
            description: `Noticeable regression in ${skill} performance.`,
            possibleCauses: ['Loss of motivation', 'Increased difficulty', 'External stressors'],
            interventions: ['Provide support', 'Review foundational skills'],
            monitoring: ['Monitor next 3 sessions closely']
          });
        }
      }
    });
  }
  
  // Analyze learning curves for different skills
  private analyzeLearningCurves(sessions: LearningSession[]): void {
    const skillProgress: Record<string, number[]> = {};
    
    sessions.forEach(session => {
      session.activities.forEach(activity => {
        const skillKey = `${activity.activityType}_${activity.subSkill}`;
        if (!skillProgress[skillKey]) {
          skillProgress[skillKey] = [];
        }
        skillProgress[skillKey].push(activity.accuracy);
      });
    });

    Object.entries(skillProgress).forEach(([skill, progress]) => {
      if (progress.length >= 3) {
        const trend = this.calculateTrend(progress);
        const consistency = this.calculateConsistency(progress);
        
        if (trend > 0.1 && consistency > 0.7) {
          this.patterns.push({
            patternType: 'learning_curve',
            skill,
            duration: sessions.length,
            description: `Consistent improvement in ${skill} with ${(trend * 100).toFixed(1)}% average increase`,
            possibleCauses: ['Effective teaching method', 'Good practice routine', 'Optimal difficulty level'],
            interventions: ['Continue current approach', 'Gradually increase complexity'],
            monitoring: ['Track for plateau signs', 'Monitor engagement levels']
          });
        }
      }
    });
  }

  // Detect learning plateaus
  private detectPlateaus(sessions: LearningSession[]): void {
    const recentSessions = sessions.slice(-5);
    const skillAverages: Record<string, number[]> = {};
    
    recentSessions.forEach(session => {
      session.activities.forEach(activity => {
        const skillKey = `${activity.activityType}_${activity.subSkill}`;
        if (!skillAverages[skillKey]) {
          skillAverages[skillKey] = [];
        }
        skillAverages[skillKey].push(activity.accuracy);
      });
    });

    Object.entries(skillAverages).forEach(([skill, averages]) => {
      if (averages.length >= 3) {
        const variance = this.calculateVariance(averages);
        const trend = this.calculateTrend(averages);
        
        if (variance < 0.05 && Math.abs(trend) < 0.02) {
          this.patterns.push({
            patternType: 'plateau',
            skill,
            duration: recentSessions.length,
            description: `Performance plateau detected in ${skill}`,
            possibleCauses: ['Skill mastery reached', 'Need for increased challenge', 'Motivation decrease'],
            interventions: ['Introduce new challenges', 'Change activity format', 'Add gamification'],
            monitoring: ['Weekly progress checks', 'Engagement assessment']
          });
        }
      }
    });
  }

  // Generate adaptive learning path
  generateAdaptiveLearningPath(userId: string): AdaptiveLearningPath {
    const userSessions = this.sessions.filter(s => s.userId === userId).slice(-10);
    const userAssessments = Array.from(this.assessments.values());
    
    // Calculate current levels
    const currentLevel: Record<string, number> = {};
    userAssessments.forEach(assessment => {
      currentLevel[assessment.skill] = assessment.currentLevel;
    });

    // Determine optimal session characteristics
    const sessionLengths = userSessions.map(s => s.duration);
    const optimalSessionLength = this.calculateOptimalSessionLength(sessionLengths);
    
    // Identify preferred time slots
    const timeSlots = userSessions.map(s => this.getTimeSlot(s.timestamp));
    const preferredTimeSlots = this.getPreferredTimeSlots(timeSlots);
    
    // Generate next activities based on current performance
    const nextActivities = this.generateNextActivities(userAssessments);
    
    // Calculate difficulty adjustments
    const difficultyAdjustments = this.calculateDifficultyAdjustments(userAssessments);
    
    // Identify focus and avoidance areas
    const focusAreas = this.identifyFocusAreas(userAssessments);
    const avoidanceAreas = this.identifyAvoidanceAreas(userAssessments);
    
    // Determine learning style
    const learningStyle = this.determineLearningStyle(userSessions);

    return {
      currentLevel,
      nextActivities,
      difficultyAdjustments,
      focusAreas,
      avoidanceAreas,
      optimalSessionLength,
      preferredTimeSlots,
      learningStyle
    };
  }

  // Generate real-time insights
  generateRealTimeInsights(userId: string): any {
    const recentSessions = this.sessions.filter(s => s.userId === userId).slice(-3);
    const recentObservations = this.observations.filter(o => 
      Date.now() - o.timestamp.getTime() < 24 * 60 * 60 * 1000 // Last 24 hours
    );

    return {
      currentPerformance: this.calculateCurrentPerformance(recentSessions),
      engagementLevel: this.calculateEngagementLevel(recentSessions),
      attentionSpan: this.calculateAttentionSpan(recentSessions),
      learningVelocity: this.calculateLearningVelocity(recentSessions),
      strugglingAreas: this.identifyCurrentStrugglingAreas(recentSessions),
      breakthroughMoments: this.identifyBreakthroughMoments(recentObservations),
      immediateRecommendations: this.generateImmediateRecommendations(recentSessions),
      nextSessionOptimization: this.optimizeNextSession(userId)
    };
  }

  // Helper methods
  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    
    const n = values.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, index) => sum + (index * val), 0);
    const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;
    
    return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  }

  private calculateConsistency(values: number[]): number {
    const variance = this.calculateVariance(values);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    return 1 - (Math.sqrt(variance) / mean);
  }

  private calculateNewLevel(assessment: FormativeAssessment, activity: ActivityRecord): number {
    // Weighted average of current level and new performance
    const weight = 0.3; // How much new data influences the assessment
    return assessment.currentLevel * (1 - weight) + activity.accuracy * weight;
  }

  private calculateProgressRate(assessment: FormativeAssessment, newLevel: number): number {
    const timeDiff = Date.now() - assessment.lastAssessed.getTime();
    const weeksDiff = timeDiff / (7 * 24 * 60 * 60 * 1000);
    const levelDiff = newLevel - assessment.currentLevel;
    return weeksDiff > 0 ? levelDiff / weeksDiff : 0;
  }

  private calculateTargetLevel(activity: ActivityRecord): number {
    // Age-appropriate targets based on activity type and difficulty
    const baseTargets = {
      reading: { beginner: 80, intermediate: 90, advanced: 95 },
      attention: { beginner: 75, intermediate: 85, advanced: 92 },
      speech: { beginner: 85, intermediate: 92, advanced: 97 },
      cognitive: { beginner: 70, intermediate: 80, advanced: 90 }
    };
    
    return baseTargets[activity.activityType]?.[activity.difficulty] || 85;
  }

  private calculateNextAssessmentDate(assessment?: FormativeAssessment): Date {
    const baseInterval = 7; // days
    const nextDate = new Date();
    
    if (assessment) {
      // Adjust interval based on progress rate
      const interval = assessment.progressRate > 0.1 ? baseInterval : baseInterval * 2;
      nextDate.setDate(nextDate.getDate() + interval);
    } else {
      nextDate.setDate(nextDate.getDate() + baseInterval);
    }
    
    return nextDate;
  }

  private identifyMasteryIndicators(activity: ActivityRecord): string[] {
    const indicators: string[] = [];
    
    if (activity.accuracy >= 90) indicators.push('High accuracy achieved');
    if (activity.attempts <= 2) indicators.push('Quick task completion');
    if (activity.engagement === 'high') indicators.push('Strong engagement');
    if (activity.errorPatterns.length === 0) indicators.push('Error-free performance');
    
    return indicators;
  }

  private identifyStrugglingAreas(activity: ActivityRecord): string[] {
    const areas: string[] = [];
    
    if (activity.accuracy < 70) areas.push('Low accuracy');
    if (activity.attempts > 5) areas.push('Multiple attempts needed');
    if (activity.engagement === 'low') areas.push('Low engagement');
    if (activity.errorPatterns.length > 2) areas.push('Multiple error types');
    
    return areas;
  }

  private generateInitialRecommendations(activity: ActivityRecord): AssessmentRecommendation[] {
    const recommendations: AssessmentRecommendation[] = [];
    
    if (activity.accuracy < 70) {
      recommendations.push({
        type: 'immediate',
        priority: 'high',
        action: 'Reduce difficulty level and provide additional support',
        expectedOutcome: 'Improved confidence and accuracy',
        timeframe: '1-2 sessions',
        resources: ['Simplified materials', 'Additional practice time']
      });
    }
    
    if (activity.engagement === 'low') {
      recommendations.push({
        type: 'short-term',
        priority: 'medium',
        action: 'Introduce gamification elements and variety',
        expectedOutcome: 'Increased motivation and participation',
        timeframe: '1 week',
        resources: ['Interactive games', 'Reward system']
      });
    }
    
    return recommendations;
  }

  private updateMasteryIndicators(assessment: FormativeAssessment, activity: ActivityRecord): void {
    const newIndicators = this.identifyMasteryIndicators(activity);
    assessment.masteryIndicators = [...new Set([...assessment.masteryIndicators, ...newIndicators])];
  }

  private updateRecommendations(assessment: FormativeAssessment, activity: ActivityRecord): void {
    // Update recommendations based on latest performance
    const newRecommendations = this.generateInitialRecommendations(activity);
    assessment.recommendations = newRecommendations;
  }

  private triggerImmediateAssessment(observation: ContinuousObservation): void {
    // Implement immediate assessment logic for high-significance observations
    console.log(`Immediate assessment triggered for: ${observation.skill}`);
  }

  // Additional helper methods for adaptive learning path generation
  private calculateOptimalSessionLength(sessionLengths: number[]): number {
    return sessionLengths.reduce((sum, length) => sum + length, 0) / sessionLengths.length;
  }

  private getTimeSlot(timestamp: Date): string {
    const hour = timestamp.getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  }

  private getPreferredTimeSlots(timeSlots: string[]): string[] {
    const counts = timeSlots.reduce((acc, slot) => {
      acc[slot] = (acc[slot] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(counts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)
      .map(([slot]) => slot);
  }

  private generateNextActivities(assessments: FormativeAssessment[]): string[] {
    return assessments
      .filter(a => a.currentLevel < a.targetLevel)
      .sort((a, b) => (a.targetLevel - a.currentLevel) - (b.targetLevel - b.currentLevel))
      .slice(0, 5)
      .map(a => a.skill);
  }

  private calculateDifficultyAdjustments(assessments: FormativeAssessment[]): Record<string, number> {
    const adjustments: Record<string, number> = {};
    
    assessments.forEach(assessment => {
      const performance = assessment.currentLevel / assessment.targetLevel;
      if (performance > 0.9) {
        adjustments[assessment.skill] = 1.1; // Increase difficulty
      } else if (performance < 0.7) {
        adjustments[assessment.skill] = 0.9; // Decrease difficulty
      } else {
        adjustments[assessment.skill] = 1.0; // Maintain difficulty
      }
    });
    
    return adjustments;
  }

  private identifyFocusAreas(assessments: FormativeAssessment[]): string[] {
    return assessments
      .filter(a => a.currentLevel < a.targetLevel * 0.8)
      .map(a => a.skill);
  }

  private identifyAvoidanceAreas(assessments: FormativeAssessment[]): string[] {
    return assessments
      .filter(a => a.progressRate < 0)
      .map(a => a.skill);
  }

  private determineLearningStyle(sessions: LearningSession[]): string {
    // Analyze session patterns to determine learning style
    const avgEngagement = sessions.reduce((sum, s) => {
      const engagementScore = s.overallEngagement === 'high' ? 3 : s.overallEngagement === 'medium' ? 2 : 1;
      return sum + engagementScore;
    }, 0) / sessions.length;
    
    if (avgEngagement > 2.5) return 'highly_engaged';
    if (avgEngagement > 1.5) return 'moderately_engaged';
    return 'needs_motivation';
  }

  private calculateCurrentPerformance(sessions: LearningSession[]): number {
    if (sessions.length === 0) return 0;
    
    const allActivities = sessions.flatMap(s => s.activities);
    return allActivities.reduce((sum, a) => sum + a.accuracy, 0) / allActivities.length;
  }

  private calculateEngagementLevel(sessions: LearningSession[]): string {
    if (sessions.length === 0) return 'unknown';
    
    const engagementScores = sessions.map(s => 
      s.overallEngagement === 'high' ? 3 : s.overallEngagement === 'medium' ? 2 : 1
    );
    const avgScore = engagementScores.reduce((sum, score) => sum + score, 0) / engagementScores.length;
    
    if (avgScore > 2.5) return 'high';
    if (avgScore > 1.5) return 'medium';
    return 'low';
  }

  private calculateAttentionSpan(sessions: LearningSession[]): number {
    return sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length / 60; // in minutes
  }

  private calculateLearningVelocity(sessions: LearningSession[]): number {
    // Calculate improvement rate across recent sessions
    if (sessions.length < 2) return 0;
    
    const firstSession = sessions[0];
    const lastSession = sessions[sessions.length - 1];
    
    const firstAvg = firstSession.activities.reduce((sum, a) => sum + a.accuracy, 0) / firstSession.activities.length;
    const lastAvg = lastSession.activities.reduce((sum, a) => sum + a.accuracy, 0) / lastSession.activities.length;
    
    return lastAvg - firstAvg;
  }

  private identifyCurrentStrugglingAreas(sessions: LearningSession[]): string[] {
    const skillPerformance: Record<string, number[]> = {};
    
    sessions.forEach(session => {
      session.activities.forEach(activity => {
        const skillKey = `${activity.activityType}_${activity.subSkill}`;
        if (!skillPerformance[skillKey]) {
          skillPerformance[skillKey] = [];
        }
        skillPerformance[skillKey].push(activity.accuracy);
      });
    });
    
    return Object.entries(skillPerformance)
      .filter(([, performances]) => {
        const avg = performances.reduce((sum, p) => sum + p, 0) / performances.length;
        return avg < 75;
      })
      .map(([skill]) => skill);
  }

  private identifyBreakthroughMoments(observations: ContinuousObservation[]): string[] {
    return observations
      .filter(o => o.observationType === 'breakthrough')
      .map(o => o.observation);
  }

  private generateImmediateRecommendations(sessions: LearningSession[]): string[] {
    const recommendations: string[] = [];
    
    if (sessions.length === 0) return recommendations;
    
    const lastSession = sessions[sessions.length - 1];
    const avgAccuracy = lastSession.activities.reduce((sum, a) => sum + a.accuracy, 0) / lastSession.activities.length;
    
    if (avgAccuracy < 70) {
      recommendations.push('Consider reducing difficulty level for next session');
    }
    
    if (lastSession.overallEngagement === 'low') {
      recommendations.push('Introduce more interactive and gamified activities');
    }
    
    if (lastSession.duration < 600) { // Less than 10 minutes
      recommendations.push('Session was short - check for attention or motivation issues');
    }
    
    return recommendations;
  }

  private optimizeNextSession(userId: string): any {
    const adaptivePath = this.generateAdaptiveLearningPath(userId);
    
    return {
      recommendedDuration: adaptivePath.optimalSessionLength,
      suggestedActivities: adaptivePath.nextActivities.slice(0, 3),
      difficultySettings: adaptivePath.difficultyAdjustments,
      focusAreas: adaptivePath.focusAreas,
      avoidanceAreas: adaptivePath.avoidanceAreas,
      optimalTiming: adaptivePath.preferredTimeSlots[0] || 'morning'
    };
  }

  // Export methods for external use
  getFormativeAssessments(): FormativeAssessment[] {
    return Array.from(this.assessments.values());
  }

  getProgressPatterns(): ProgressPattern[] {
    return this.patterns;
  }

  getContinuousObservations(): ContinuousObservation[] {
    return this.observations;
  }

  getSessionHistory(userId: string): LearningSession[] {
    return this.sessions.filter(s => s.userId === userId);
  }
}

// Export singleton instance
export const continuousAssessment = new ContinuousAssessmentService();

// Utility functions for assessment formatting
export const formatAssessmentLevel = (score: number, errorRate: number): string => {
  if (score >= 90 && errorRate < 10) return 'Mastery';
  if (score >= 80 && errorRate < 20) return 'Proficient';
  if (score >= 70 && errorRate < 30) return 'Developing';
  if (score >= 60 && errorRate < 40) return 'Beginning';
  return 'Needs Support';
};

export const getAssessmentColor = (score: number, errorRate: number): string => {
  if (score >= 90 && errorRate < 10) return 'text-green-600';
  if (score >= 80 && errorRate < 20) return 'text-blue-600';
  if (score >= 70 && errorRate < 30) return 'text-yellow-600';
  return 'text-red-600';
};

export const formatProgressRate = (rate: number): string => {
  if (rate > 0.1) return 'Rapid Progress';
  if (rate > 0.05) return 'Steady Progress';
  if (rate > 0) return 'Slow Progress';
  if (rate === 0) return 'Stable';
  return 'Regression';
};

export const generateAssessmentSummary = (assessments: FormativeAssessment[]): string => {
  const totalSkills = assessments.length;
  const masteredSkills = assessments.filter(
    a => a.currentLevel >= a.targetLevel * 0.9
  ).length;

  const strugglingSkills = assessments.filter(
    a => a.currentLevel < a.targetLevel * 0.7
  ).length;

  return `${masteredSkills}/${totalSkills} skills at mastery level, ${strugglingSkills} skills need focused attention based on current performance levels.`;
};
