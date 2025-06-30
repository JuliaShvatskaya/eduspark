// Advanced Progress Analytics Service
// Comprehensive tracking and analysis of student learning progress

export interface SkillMetric {
  current: number;
  target: number;
  trend: number;
  weeklyData: Array<{ date: string; value: number }>;
}

export interface ReportSummaryData {
  studentInfo: { age: number };
  summary: { overallScore: number };
  insights: ProgressInsight[];
}

export interface DetailedMetrics {
  readingSkills: {
    readingSpeed: {
      current: number;
      target: number;
      trend: number;
      weeklyData: Array<{ date: string; value: number }>;
      ageGroupPercentile: number;
    };
    accuracy: {
      current: number;
      target: number;
      trend: number;
      weeklyData: Array<{ date: string; value: number }>;
      errorPatterns: string[];
    };
    comprehension: {
      current: number;
      target: number;
      trend: number;
      weeklyData: Array<{ date: string; value: number }>;
      questionTypes: Record<string, number>;
    };
    syllableReading: {
      current: number;
      target: number;
      trend: number;
      weeklyData: Array<{ date: string; value: number }>;
      syllableComplexity: Record<string, number>;
    };
    vocabularyGrowth: {
      current: number;
      target: number;
      trend: number;
      weeklyData: Array<{ date: string; value: number }>;
      categoryBreakdown: Record<string, number>;
    };
  };
  attention: {
    concentrationDuration: {
      current: number;
      target: number;
      trend: number;
      weeklyData: Array<{ date: string; value: number }>;
      timeOfDayPerformance: Record<string, number>;
    };
    sustainability: {
      current: number;
      target: number;
      trend: number;
      weeklyData: Array<{ date: string; value: number }>;
      fatiguePatterns: string[];
    };
    taskSwitching: {
      current: number;
      target: number;
      trend: number;
      weeklyData: Array<{ date: string; value: number }>;
      switchingSpeed: number;
    };
    attentionSpan: {
      current: number;
      target: number;
      trend: number;
      weeklyData: Array<{ date: string; value: number }>;
      distractionResistance: number;
    };
    selectiveAttention: {
      current: number;
      target: number;
      trend: number;
      weeklyData: Array<{ date: string; value: number }>;
      filteringEfficiency: number;
    };
  };
  speechDevelopment: {
    pronunciationAccuracy: {
      current: number;
      target: number;
      trend: number;
      weeklyData: Array<{ date: string; value: number }>;
      phonemeAccuracy: Record<string, number>;
    };
    connectedSpeech: {
      current: number;
      target: number;
      trend: number;
      weeklyData: Array<{ date: string; value: number }>;
      sentenceComplexity: number;
    };
    speechComprehension: {
      current: number;
      target: number;
      trend: number;
      weeklyData: Array<{ date: string; value: number }>;
      contextualUnderstanding: number;
    };
    activeVocabulary: {
      current: number;
      target: number;
      trend: number;
      weeklyData: Array<{ date: string; value: number }>;
      usageFrequency: Record<string, number>;
    };
    passiveVocabulary: {
      current: number;
      target: number;
      trend: number;
      weeklyData: Array<{ date: string; value: number }>;
      recognitionAccuracy: number;
    };
  };
  cognitiveSkills: {
    logicalThinking: {
      current: number;
      target: number;
      trend: number;
      weeklyData: Array<{ date: string; value: number }>;
      problemSolvingSteps: number;
    };
    criticalThinking: {
      current: number;
      target: number;
      trend: number;
      weeklyData: Array<{ date: string; value: number }>;
      analysisDepth: number;
    };
    spatialReasoning: {
      current: number;
      target: number;
      trend: number;
      weeklyData: Array<{ date: string; value: number }>;
      visualProcessing: number;
    };
    creativeThinking: {
      current: number;
      target: number;
      trend: number;
      weeklyData: Array<{ date: string; value: number }>;
      originalityScore: number;
    };
  };
}

export interface BenchmarkData {
  ageGroup: string;
  readingSpeed: { min: number; avg: number; max: number };
  attentionSpan: { min: number; avg: number; max: number };
  vocabularySize: { min: number; avg: number; max: number };
  cognitiveScore: { min: number; avg: number; max: number };
}

export interface ProgressInsight {
  category: 'strength' | 'improvement' | 'concern' | 'achievement';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  recommendations: string[];
  timeframe: string;
}

export interface LearningPattern {
  pattern: string;
  frequency: number;
  impact: string;
  recommendation: string;
}

class ProgressAnalyticsService {
  private benchmarks: Record<string, BenchmarkData> = {
    '4-5': {
      ageGroup: '4-5 years',
      readingSpeed: { min: 20, avg: 35, max: 50 },
      attentionSpan: { min: 8, avg: 12, max: 18 },
      vocabularySize: { min: 150, avg: 250, max: 400 },
      cognitiveScore: { min: 60, avg: 75, max: 90 }
    },
    '6-7': {
      ageGroup: '6-7 years',
      readingSpeed: { min: 40, avg: 65, max: 90 },
      attentionSpan: { min: 12, avg: 18, max: 25 },
      vocabularySize: { min: 250, avg: 400, max: 600 },
      cognitiveScore: { min: 65, avg: 80, max: 95 }
    },
    '8-9': {
      ageGroup: '8-9 years',
      readingSpeed: { min: 60, avg: 90, max: 120 },
      attentionSpan: { min: 18, avg: 25, max: 35 },
      vocabularySize: { min: 400, avg: 600, max: 900 },
      cognitiveScore: { min: 70, avg: 85, max: 100 }
    },
    '10+': {
      ageGroup: '10+ years',
      readingSpeed: { min: 80, avg: 120, max: 160 },
      attentionSpan: { min: 25, avg: 35, max: 45 },
      vocabularySize: { min: 600, avg: 900, max: 1200 },
      cognitiveScore: { min: 75, avg: 90, max: 100 }
    }
  };

  // Generate comprehensive progress insights
  generateProgressInsights(metrics: DetailedMetrics, age: number): ProgressInsight[] {
    const insights: ProgressInsight[] = [];
    const ageGroup = this.getAgeGroup(age);
    const benchmark = this.benchmarks[ageGroup];

    // Reading insights
    if (metrics.readingSkills.readingSpeed.current >= benchmark.readingSpeed.avg * 1.1) {
      insights.push({
        category: 'strength',
        title: 'Excellent Reading Speed',
        description: `Reading speed of ${metrics.readingSkills.readingSpeed.current} WPM`,
        impact: 'high',
        actionable: true,
        recommendations: [
          'Introduce more complex texts to maintain challenge',
          'Focus on comprehension while maintaining speed',
          'Consider advanced reading materials'
        ],
        timeframe: '2-4 weeks'
      });
    }

    // Attention insights
    if (metrics.attention.concentrationDuration.trend > 15) {
      insights.push({
        category: 'achievement',
        title: 'Significant Attention Improvement',
        description: `Concentration duration has improved by ${metrics.attention.concentrationDuration.trend}%`,
        impact: 'medium',
        actionable: true,
        recommendations: [
          'Continue current attention training methods',
          'Gradually increase session lengths',
          'Introduce more complex attention tasks'
        ],
        timeframe: '4-6 weeks'
      });
    }

    // Speech development insights
    if (metrics.speechDevelopment.activeVocabulary.current < benchmark.vocabularySize.avg * 0.8) {
      insights.push({
        category: 'concern',
        title: 'Vocabulary Expansion Needed',
        description: 'Active vocabulary is below expected range for age group',
        impact: 'medium',
        actionable: true,
        recommendations: [
          'Implement daily vocabulary building activities',
          'Use context clues in reading',
          'Encourage descriptive language use',
          'Create word association games'
        ],
        timeframe: '8-12 weeks'
      });
    }

    // Cognitive insights
    if (metrics.cognitiveSkills.creativeThinking.current > 85) {
      insights.push({
        category: 'strength',
        title: 'Outstanding Creative Thinking',
        description: 'Shows exceptional creativity and original thinking abilities',
        impact: 'high',
        actionable: true,
        recommendations: [
          'Provide open-ended creative challenges',
          'Encourage artistic expression',
          'Introduce design thinking activities',
          'Support innovative problem-solving approaches'
        ],
        timeframe: 'Ongoing'
      });
    }

    return insights.sort((a, b) => {
      const impactOrder = { high: 3, medium: 2, low: 1 };
      return impactOrder[b.impact] - impactOrder[a.impact];
    });
  }

  // Identify learning patterns
  identifyLearningPatterns(metrics: DetailedMetrics): LearningPattern[] {
    const patterns: LearningPattern[] = [];

    // Check for consistent improvement patterns
    const readingTrend = metrics.readingSkills.readingSpeed.trend;
    const attentionTrend = metrics.attention.concentrationDuration.trend;
    
    if (readingTrend > 10 && attentionTrend > 10) {
      patterns.push({
        pattern: 'Accelerated Learning',
        frequency: 85,
        impact: 'Positive correlation between reading and attention improvements',
        recommendation: 'Continue current learning approach with gradual complexity increase'
      });
    }

    // Check for time-of-day performance patterns
    const morningPerformance = metrics.attention.concentrationDuration.timeOfDayPerformance?.['morning'] || 0;
    const afternoonPerformance = metrics.attention.concentrationDuration.timeOfDayPerformance?.['afternoon'] || 0;
    
    if (morningPerformance > afternoonPerformance * 1.2) {
      patterns.push({
        pattern: 'Morning Peak Performance',
        frequency: 78,
        impact: 'Significantly better focus and learning in morning hours',
        recommendation: 'Schedule challenging learning activities between 9-11 AM'
      });
    }

    // Check for vocabulary growth patterns
    const vocabGrowth = metrics.speechDevelopment.activeVocabulary.trend;
    if (vocabGrowth > 20) {
      patterns.push({
        pattern: 'Rapid Vocabulary Acquisition',
        frequency: 92,
        impact: 'Exceptional rate of new word learning and retention',
        recommendation: 'Introduce more sophisticated vocabulary and context usage'
      });
    }

    return patterns;
  }

  // Calculate percentile ranking
  calculatePercentile(value: number, ageGroup: string, metric: keyof BenchmarkData): number {
    const benchmark = this.benchmarks[ageGroup];
    if (!benchmark || !(metric in benchmark)) return 50;

    const range = benchmark[metric] as { min: number; avg: number; max: number };
    
    if (value <= range.min) return 10;
    if (value >= range.max) return 95;
    if (value <= range.avg) {
      return 10 + ((value - range.min) / (range.avg - range.min)) * 40;
    } else {
      return 50 + ((value - range.avg) / (range.max - range.avg)) * 45;
    }
  }

  // Generate age-appropriate targets
  generateTargets(currentMetrics: any, age: number): any {
    const ageGroup = this.getAgeGroup(age);
    const benchmark = this.benchmarks[ageGroup];
    
    return {
      readingSpeed: Math.min(currentMetrics.readingSpeed * 1.15, benchmark.readingSpeed.max),
      attentionSpan: Math.min(currentMetrics.attentionSpan * 1.2, benchmark.attentionSpan.max),
      vocabulary: Math.min(currentMetrics.vocabulary * 1.25, benchmark.vocabularySize.max),
      cognitiveScore: Math.min(currentMetrics.cognitiveScore * 1.1, benchmark.cognitiveScore.max)
    };
  }

  // Predict future performance
  predictPerformance(metrics: DetailedMetrics, weeksAhead: number): any {
    const predictions: Partial<Record<keyof DetailedMetrics, Record<string, number>>> = {};
  
    Object.entries(metrics).forEach(([category, skills]) => {
      predictions[category as keyof DetailedMetrics] = {};
  
      Object.entries(skills as Record<string, { current: number; trend: number }>).forEach(([skill, data]) => {
        const currentTrend = data.trend / 100;
        const predictedValue = data.current * (1 + (currentTrend * weeksAhead / 4));
        (predictions[category as keyof DetailedMetrics] as Record<string, number>)[skill] = Math.round(predictedValue);
      });
    });
  
    return predictions;
  }

  // Generate detailed recommendations
  generateDetailedRecommendations(insights: ProgressInsight[]): any {
    const recommendations: {
      immediate: string[];
      shortTerm: string[];
      longTerm: string[];
      environmental: string[];
      curriculum: string[];
    } = {
      immediate: [],
      shortTerm: [],
      longTerm: [],
      environmental: [],
      curriculum: []
    };

    insights.forEach(insight => {
      const timeframe = insight.timeframe.toLowerCase();
      
      if (timeframe.includes('week') && parseInt(timeframe) <= 2) {
        recommendations.immediate.push(...insight.recommendations);
      } else if (timeframe.includes('week') && parseInt(timeframe) <= 8) {
        recommendations.shortTerm.push(...insight.recommendations);
      } else {
        recommendations.longTerm.push(...insight.recommendations);
      }

      // Categorize by type
      insight.recommendations.forEach(rec => {
        if (rec.includes('environment') || rec.includes('setting') || rec.includes('space')) {
          recommendations.environmental.push(rec);
        } else if (rec.includes('curriculum') || rec.includes('material') || rec.includes('text')) {
          recommendations.curriculum.push(rec);
        }
      });
    });

    return recommendations;
  }

  // Helper method to determine age group
  private getAgeGroup(age: number): string {
    if (age <= 5) return '4-5';
    if (age <= 7) return '6-7';
    if (age <= 9) return '8-9';
    return '10+';
  }

  // Export comprehensive report data
  exportReportData(metrics: DetailedMetrics, age: number): any {
    const insights = this.generateProgressInsights(metrics, age);
    const patterns = this.identifyLearningPatterns(metrics);
    const predictions = this.predictPerformance(metrics, 12); // 3 months ahead
    const recommendations = this.generateDetailedRecommendations(insights);

    return {
      studentInfo: {
        age,
        ageGroup: this.getAgeGroup(age),
        reportDate: new Date().toISOString(),
        reportPeriod: 'Last 30 days'
      },
      metrics,
      insights,
      patterns,
      predictions,
      recommendations,
      benchmarks: this.benchmarks[this.getAgeGroup(age)],
      summary: {
        overallScore: this.calculateOverallScore(metrics),
        strongestArea: this.identifyStrongestArea(metrics),
        improvementArea: this.identifyImprovementArea(metrics),
        nextMilestone: this.getNextMilestone(metrics, age)
      }
    };
  }

  // Calculate overall performance score
  private calculateOverallScore(metrics: DetailedMetrics): number {
    const allScores: number[] = [];
    
    Object.values(metrics).forEach((category) => {
      Object.values(category as Record<string, SkillMetric>).forEach((skill) => {
        allScores.push((skill.current / skill.target) * 100);
      });
    });

    
    return Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length);
  }

  // Identify strongest performing area
  private identifyStrongestArea(metrics: DetailedMetrics): string {
    const categoryAverages = {} as Record<string, number>;
    
    Object.entries(metrics).forEach(([category, skills]) => {
      const scores = Object.values(skills as Record<string, SkillMetric>).map(
        (skill) => (skill.current / skill.target) * 100
      );

      categoryAverages[category] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    });
    
    return Object.entries(categoryAverages).reduce((a, b) => 
      categoryAverages[a[0]] > categoryAverages[b[0]] ? a : b
    )[0];
  }

  // Identify area needing most improvement
  private identifyImprovementArea(metrics: DetailedMetrics): string {
    const categoryAverages = {} as Record<string, number>;
    
    Object.entries(metrics).forEach(([category, skills]) => {
      const scores = Object.values(skills as Record<string, SkillMetric>).map(
        (skill) => (skill.current / skill.target) * 100
      );
      categoryAverages[category] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    });
    
    return Object.entries(categoryAverages).reduce((a, b) => 
      categoryAverages[a[0]] < categoryAverages[b[0]] ? a : b
    )[0];
  }

  // Get next achievable milestone
  private getNextMilestone(metrics: DetailedMetrics, age: number): string {
    const ageGroup = this.getAgeGroup(age);
    const benchmark = this.benchmarks[ageGroup];
    
    // Find the skill closest to reaching its target
    let closestSkill = '';
    let smallestGap = Infinity;
    
    Object.entries(metrics).forEach(([category, skills]) => {
      Object.entries(skills as Record<string, SkillMetric>).forEach(([skill, data]) => {
        const gap = data.target - data.current;
        if (gap > 0 && gap < smallestGap) {
          smallestGap = gap;
          closestSkill = `${category}: ${skill}`;
        }
      });
    });
    
    return closestSkill || 'Continue current progress';
  }
}

// Export singleton instance
export const progressAnalytics = new ProgressAnalyticsService();

// Utility functions for report formatting
export const formatMetricValue = (value: number, type: string): string => {
  switch (type) {
    case 'speed':
      return `${value} WPM`;
    case 'duration':
      return `${value} min`;
    case 'percentage':
      return `${value}%`;
    case 'count':
      return value.toString();
    default:
      return value.toString();
  }
};

export const getPerformanceLevel = (percentage: number): string => {
  if (percentage >= 90) return 'Excellent';
  if (percentage >= 80) return 'Good';
  if (percentage >= 70) return 'Satisfactory';
  if (percentage >= 60) return 'Developing';
  return 'Needs Support';
};

export const getProgressDirection = (trend: number): 'improving' | 'stable' | 'declining' => {
  if (trend > 5) return 'improving';
  if (trend < -5) return 'declining';
  return 'stable';
};

export const generateReportSummary = (
  data: ReportSummaryData
): string => {
  const { studentInfo, summary, insights } = data;

  const strongInsights = insights.filter((i) => i.category === 'strength').length;
  const improvementInsights = insights.filter((i) => i.category === 'improvement').length;

  return `${studentInfo.age}-year-old learner showing ${summary.overallScore}% overall performance. 
    Strongest in ${strongInsights} area(s), ${improvementInsights} area(s) need improvement.`;
};