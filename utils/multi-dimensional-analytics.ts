// Multi-Dimensional Learning Analytics
// Advanced analytics system for comprehensive student progress evaluation

export interface DimensionalMetrics {
  // Чтение (Reading) - Comprehensive reading skills assessment
  reading: {
    speed: {
      wordsPerMinute: number;
      syllablesPerMinute: number;
      improvementRate: number;
      agePercentile: number;
      consistency: number;
    };
    accuracy: {
      overallAccuracy: number;
      errorTypes: Record<string, number>;
      errorFrequency: number;
      selfCorrection: number;
      contextualAccuracy: number;
    };
    comprehension: {
      literalComprehension: number;
      inferentialComprehension: number;
      criticalComprehension: number;
      vocabularyInContext: number;
      retentionRate: number;
    };
    syllableReading: {
      simpleCV: number; // consonant-vowel
      complexCVC: number; // consonant-vowel-consonant
      multisyllabic: number;
      blendingSpeed: number;
      segmentationAccuracy: number;
    };
    vocabularyGrowth: {
      activeVocabulary: number;
      passiveVocabulary: number;
      acquisitionRate: number;
      retentionRate: number;
      contextualUsage: number;
    };
  };

  // Внимание (Attention) - Detailed attention and focus metrics
  attention: {
    concentration: {
      maxDuration: number;
      averageDuration: number;
      sustainabilityIndex: number;
      fatiguePattern: string;
      recoveryTime: number;
    };
    sustainability: {
      taskPersistence: number;
      distractionResistance: number;
      motivationMaintenance: number;
      effortConsistency: number;
      enduranceImprovement: number;
    };
    taskSwitching: {
      switchingSpeed: number;
      adaptationTime: number;
      flexibilityIndex: number;
      cognitiveLoad: number;
      errorRate: number;
    };
    selectiveAttention: {
      filteringEfficiency: number;
      irrelevantInhibition: number;
      relevantFocus: number;
      dualTaskPerformance: number;
      attentionalControl: number;
    };
    workingMemory: {
      capacity: number;
      manipulation: number;
      updateSpeed: number;
      interferenceResistance: number;
      strategicUse: number;
    };
  };

  // Речь (Speech) - Comprehensive speech and language assessment
  speech: {
    pronunciation: {
      phonemeAccuracy: Record<string, number>;
      articulationClarity: number;
      prosodyNaturalness: number;
      speechRate: number;
      intelligibility: number;
    };
    connectedSpeech: {
      sentenceComplexity: number;
      grammaticalAccuracy: number;
      fluencyRate: number;
      pausePatterns: number;
      coherenceLevel: number;
    };
    comprehension: {
      auditoryProcessing: number;
      instructionFollowing: number;
      contextualUnderstanding: number;
      inferentialListening: number;
      criticalListening: number;
    };
    expressiveLanguage: {
      vocabularyDiversity: number;
      syntacticComplexity: number;
      semanticAccuracy: number;
      pragmaticAppropriate: number;
      narrativeSkills: number;
    };
    receptiveLanguage: {
      vocabularyRecognition: number;
      syntacticProcessing: number;
      semanticIntegration: number;
      pragmaticInference: number;
      discourseComprehension: number;
    };
  };

  // Мышление (Thinking) - Cognitive skills and thinking processes
  cognitive: {
    logicalThinking: {
      sequentialReasoning: number;
      patternRecognition: number;
      causeEffectUnderstanding: number;
      deductiveReasoning: number;
      inductiveReasoning: number;
    };
    criticalThinking: {
      analysisSkills: number;
      evaluationAbility: number;
      synthesisCapacity: number;
      argumentConstruction: number;
      evidenceAssessment: number;
    };
    spatialReasoning: {
      visualProcessing: number;
      mentalRotation: number;
      spatialMemory: number;
      geometricUnderstanding: number;
      navigationSkills: number;
    };
    creativeThinking: {
      originalityScore: number;
      fluencyRate: number;
      flexibilityIndex: number;
      elaborationLevel: number;
      innovationCapacity: number;
    };
    executiveFunction: {
      planningAbility: number;
      organizationSkills: number;
      timeManagement: number;
      goalSetting: number;
      selfMonitoring: number;
    };
  };
}

export interface BenchmarkComparison {
  ageGroup: string;
  skill: string;
  studentScore: number;
  benchmarkMin: number;
  benchmarkAvg: number;
  benchmarkMax: number;
  percentileRank: number;
  standardDeviation: number;
  zScore: number;
}

export interface ProgressTrend {
  skill: string;
  timeframe: string;
  dataPoints: Array<{ date: string; value: number }>;
  trendDirection: 'improving' | 'stable' | 'declining';
  trendStrength: number;
  projectedValue: number;
  confidenceInterval: [number, number];
}

export interface LearningProfile {
  strengths: string[];
  challenges: string[];
  learningStyle: string;
  optimalConditions: string[];
  motivationalFactors: string[];
  supportNeeds: string[];
  developmentalPriorities: string[];
}

export interface InterventionRecommendation {
  category: 'immediate' | 'short-term' | 'long-term';
  priority: 'critical' | 'high' | 'medium' | 'low';
  skill: string;
  currentLevel: number;
  targetLevel: number;
  intervention: string;
  strategies: string[];
  resources: string[];
  timeline: string;
  successCriteria: string[];
  monitoringPlan: string[];
  expectedOutcome: string;
}

export interface ComprehensiveReport {
  studentInfo: {
    name: string;
    age: number;
    grade: string;
    assessmentDate: string;
    assessmentPeriod: string;
  };
  executiveSummary: {
    overallPerformance: number;
    keyStrengths: string[];
    primaryConcerns: string[];
    developmentalStatus: string;
    recommendedActions: string[];
  };
  dimensionalAnalysis: DimensionalMetrics;
  benchmarkComparisons: BenchmarkComparison[];
  progressTrends: ProgressTrend[];
  learningProfile: LearningProfile;
  interventionPlan: InterventionRecommendation[];
  parentGuidance: {
    homeActivities: string[];
    environmentalSupports: string[];
    communicationStrategies: string[];
    progressMonitoring: string[];
  };
  educatorGuidance: {
    classroomAccommodations: string[];
    instructionalStrategies: string[];
    assessmentModifications: string[];
    collaborationPlan: string[];
  };
}

class MultiDimensionalAnalyticsService {
  private ageBenchmarks: Record<string, any> = {
    '4-5': {
      reading: { speed: { min: 20, avg: 35, max: 50, sd: 8 } },
      attention: { duration: { min: 8, avg: 12, max: 18, sd: 3 } },
      speech: { vocabulary: { min: 150, avg: 250, max: 400, sd: 60 } },
      cognitive: { logical: { min: 60, avg: 75, max: 90, sd: 10 } }
    },
    '6-7': {
      reading: { speed: { min: 40, avg: 65, max: 90, sd: 12 } },
      attention: { duration: { min: 12, avg: 18, max: 25, sd: 4 } },
      speech: { vocabulary: { min: 250, avg: 400, max: 600, sd: 80 } },
      cognitive: { logical: { min: 65, avg: 80, max: 95, sd: 12 } }
    },
    '8-9': {
      reading: { speed: { min: 60, avg: 90, max: 120, sd: 15 } },
      attention: { duration: { min: 18, avg: 25, max: 35, sd: 5 } },
      speech: { vocabulary: { min: 400, avg: 600, max: 900, sd: 120 } },
      cognitive: { logical: { min: 70, avg: 85, max: 100, sd: 15 } }
    }
  };

  // Generate comprehensive multi-dimensional analysis
  generateComprehensiveAnalysis(
    studentData: any,
    timeframe: string = '30days'
  ): ComprehensiveReport {
    const metrics = this.calculateDimensionalMetrics(studentData);
    const benchmarks = this.generateBenchmarkComparisons(metrics, studentData.age);
    const trends = this.analyzeProgressTrends(studentData.historicalData);
    const profile = this.createLearningProfile(metrics, benchmarks);
    const interventions = this.generateInterventionPlan(metrics, benchmarks, profile);

    return {
      studentInfo: {
        name: studentData.name,
        age: studentData.age,
        grade: studentData.grade || this.calculateGradeLevel(studentData.age),
        assessmentDate: new Date().toISOString(),
        assessmentPeriod: timeframe
      },
      executiveSummary: this.generateExecutiveSummary(metrics, benchmarks, profile),
      dimensionalAnalysis: metrics,
      benchmarkComparisons: benchmarks,
      progressTrends: trends,
      learningProfile: profile,
      interventionPlan: interventions,
      parentGuidance: this.generateParentGuidance(profile, interventions),
      educatorGuidance: this.generateEducatorGuidance(profile, interventions)
    };
  }

  private calculateGradeLevel(age: number): string {
    if (age <= 5) return 'Pre-K';
    if (age <= 6) return 'Kindergarten';
    return `Grade ${age - 5}`;
  }
  
  private generateExecutiveSummary(
    metrics: DimensionalMetrics,
    benchmarks: BenchmarkComparison[],
    profile: LearningProfile
  ): any {
    const overallPerformance = benchmarks.reduce((sum, b) => sum + b.percentileRank, 0) / benchmarks.length;
    
    return {
      overallPerformance: Math.round(overallPerformance),
      keyStrengths: profile.strengths.slice(0, 3),
      primaryConcerns: profile.challenges.slice(0, 3),
      developmentalStatus: this.getDevelopmentalStatus(overallPerformance),
      recommendedActions: this.getRecommendedActions(profile.challenges)
    };
  }

  // Calculate comprehensive dimensional metrics
  private calculateDimensionalMetrics(studentData: any): DimensionalMetrics {
    return {
      reading: {
        speed: {
          wordsPerMinute: studentData.reading?.speed?.current || 0,
          syllablesPerMinute: (studentData.reading?.speed?.current || 0) * 2,
          improvementRate: studentData.reading?.speed?.trend || 0,
          agePercentile: this.calculatePercentile(
            studentData.reading?.speed?.current || 0,
            'reading',
            'speed',
            studentData.age
          ),
          consistency: this.calculateConsistency(studentData.reading?.speed?.history || [])
        },
        accuracy: {
          overallAccuracy: studentData.reading?.accuracy?.current || 0,
          errorTypes: studentData.reading?.accuracy?.errorTypes || {},
          errorFrequency: this.calculateErrorFrequency(studentData.reading?.errors || []),
          selfCorrection: studentData.reading?.selfCorrection || 0,
          contextualAccuracy: studentData.reading?.contextualAccuracy || 0
        },
        comprehension: {
          literalComprehension: studentData.reading?.comprehension?.literal || 0,
          inferentialComprehension: studentData.reading?.comprehension?.inferential || 0,
          criticalComprehension: studentData.reading?.comprehension?.critical || 0,
          vocabularyInContext: studentData.reading?.vocabularyInContext || 0,
          retentionRate: studentData.reading?.retentionRate || 0
        },
        syllableReading: {
          simpleCV: studentData.reading?.syllables?.simple || 0,
          complexCVC: studentData.reading?.syllables?.complex || 0,
          multisyllabic: studentData.reading?.syllables?.multi || 0,
          blendingSpeed: studentData.reading?.blendingSpeed || 0,
          segmentationAccuracy: studentData.reading?.segmentation || 0
        },
        vocabularyGrowth: {
          activeVocabulary: studentData.speech?.activeVocabulary?.current || 0,
          passiveVocabulary: studentData.speech?.passiveVocabulary?.current || 0,
          acquisitionRate: studentData.vocabulary?.acquisitionRate || 0,
          retentionRate: studentData.vocabulary?.retentionRate || 0,
          contextualUsage: studentData.vocabulary?.contextualUsage || 0
        }
      },
      attention: {
        concentration: {
          maxDuration: studentData.attention?.maxDuration || 0,
          averageDuration: studentData.attention?.concentrationDuration?.current || 0,
          sustainabilityIndex: this.calculateSustainabilityIndex(studentData.attention),
          fatiguePattern: this.analyzeFatiguePattern(studentData.attention?.sessions || []),
          recoveryTime: studentData.attention?.recoveryTime || 0
        },
        sustainability: {
          taskPersistence: studentData.attention?.persistence || 0,
          distractionResistance: studentData.attention?.selectiveAttention?.current || 0,
          motivationMaintenance: studentData.attention?.motivation || 0,
          effortConsistency: studentData.attention?.consistency || 0,
          enduranceImprovement: studentData.attention?.enduranceImprovement || 0
        },
        taskSwitching: {
          switchingSpeed: studentData.attention?.taskSwitching?.current || 0,
          adaptationTime: studentData.attention?.adaptationTime || 0,
          flexibilityIndex: studentData.attention?.flexibility || 0,
          cognitiveLoad: studentData.attention?.cognitiveLoad || 0,
          errorRate: studentData.attention?.switchingErrors || 0
        },
        selectiveAttention: {
          filteringEfficiency: studentData.attention?.filtering || 0,
          irrelevantInhibition: studentData.attention?.inhibition || 0,
          relevantFocus: studentData.attention?.focus || 0,
          dualTaskPerformance: studentData.attention?.dualTask || 0,
          attentionalControl: studentData.attention?.control || 0
        },
        workingMemory: {
          capacity: studentData.memory?.capacity || 0,
          manipulation: studentData.memory?.manipulation || 0,
          updateSpeed: studentData.memory?.updateSpeed || 0,
          interferenceResistance: studentData.memory?.interference || 0,
          strategicUse: studentData.memory?.strategy || 0
        }
      },
      speech: {
        pronunciation: {
          phonemeAccuracy: studentData.speech?.phonemes || {},
          articulationClarity: studentData.speech?.clarity || 0,
          prosodyNaturalness: studentData.speech?.prosody || 0,
          speechRate: studentData.speech?.rate || 0,
          intelligibility: studentData.speech?.intelligibility || 0
        },
        connectedSpeech: {
          sentenceComplexity: studentData.speech?.complexity || 0,
          grammaticalAccuracy: studentData.speech?.grammar || 0,
          fluencyRate: studentData.speech?.fluency || 0,
          pausePatterns: studentData.speech?.pauses || 0,
          coherenceLevel: studentData.speech?.coherence || 0
        },
        comprehension: {
          auditoryProcessing: studentData.speech?.auditory || 0,
          instructionFollowing: studentData.speech?.instructions || 0,
          contextualUnderstanding: studentData.speech?.contextual || 0,
          inferentialListening: studentData.speech?.inferential || 0,
          criticalListening: studentData.speech?.critical || 0
        },
        expressiveLanguage: {
          vocabularyDiversity: studentData.speech?.diversity || 0,
          syntacticComplexity: studentData.speech?.syntax || 0,
          semanticAccuracy: studentData.speech?.semantic || 0,
          pragmaticAppropriate: studentData.speech?.pragmatic || 0,
          narrativeSkills: studentData.speech?.narrative || 0
        },
        receptiveLanguage: {
          vocabularyRecognition: studentData.speech?.recognition || 0,
          syntacticProcessing: studentData.speech?.syntaxProcessing || 0,
          semanticIntegration: studentData.speech?.semanticIntegration || 0,
          pragmaticInference: studentData.speech?.pragmaticInference || 0,
          discourseComprehension: studentData.speech?.discourse || 0
        }
      },
      cognitive: {
        logicalThinking: {
          sequentialReasoning: studentData.cognitive?.sequential || 0,
          patternRecognition: studentData.cognitive?.patterns || 0,
          causeEffectUnderstanding: studentData.cognitive?.causeEffect || 0,
          deductiveReasoning: studentData.cognitive?.deductive || 0,
          inductiveReasoning: studentData.cognitive?.inductive || 0
        },
        criticalThinking: {
          analysisSkills: studentData.cognitive?.analysis || 0,
          evaluationAbility: studentData.cognitive?.evaluation || 0,
          synthesisCapacity: studentData.cognitive?.synthesis || 0,
          argumentConstruction: studentData.cognitive?.arguments || 0,
          evidenceAssessment: studentData.cognitive?.evidence || 0
        },
        spatialReasoning: {
          visualProcessing: studentData.cognitive?.visual || 0,
          mentalRotation: studentData.cognitive?.rotation || 0,
          spatialMemory: studentData.cognitive?.spatialMemory || 0,
          geometricUnderstanding: studentData.cognitive?.geometry || 0,
          navigationSkills: studentData.cognitive?.navigation || 0
        },
        creativeThinking: {
          originalityScore: studentData.cognitive?.originality || 0,
          fluencyRate: studentData.cognitive?.fluency || 0,
          flexibilityIndex: studentData.cognitive?.flexibility || 0,
          elaborationLevel: studentData.cognitive?.elaboration || 0,
          innovationCapacity: studentData.cognitive?.innovation || 0
        },
        executiveFunction: {
          planningAbility: studentData.cognitive?.planning || 0,
          organizationSkills: studentData.cognitive?.organization || 0,
          timeManagement: studentData.cognitive?.timeManagement || 0,
          goalSetting: studentData.cognitive?.goalSetting || 0,
          selfMonitoring: studentData.cognitive?.selfMonitoring || 0
        }
      }
    };
  }

  // Generate benchmark comparisons
  private generateBenchmarkComparisons(
    metrics: DimensionalMetrics,
    age: number
  ): BenchmarkComparison[] {
    const ageGroup = this.getAgeGroup(age);
    const benchmarks: BenchmarkComparison[] = [];

    // Reading speed comparison
    const readingBenchmark = this.ageBenchmarks[ageGroup]?.reading?.speed;
    if (readingBenchmark) {
      benchmarks.push({
        ageGroup,
        skill: 'Reading Speed',
        studentScore: metrics.reading.speed.wordsPerMinute,
        benchmarkMin: readingBenchmark.min,
        benchmarkAvg: readingBenchmark.avg,
        benchmarkMax: readingBenchmark.max,
        percentileRank: this.calculatePercentile(
          metrics.reading.speed.wordsPerMinute,
          'reading',
          'speed',
          age
        ),
        standardDeviation: readingBenchmark.sd,
        zScore: this.calculateZScore(
          metrics.reading.speed.wordsPerMinute,
          readingBenchmark.avg,
          readingBenchmark.sd
        )
      });
    }

    // Add more benchmark comparisons for other skills...

    return benchmarks;
  }

  // Analyze progress trends
  private analyzeProgressTrends(historicalData: any[]): ProgressTrend[] {
    const trends: ProgressTrend[] = [];

    if (!historicalData || historicalData.length < 3) {
      return trends;
    }

    // Analyze reading speed trend
    const readingSpeedData = historicalData.map(d => ({
      date: d.date,
      value: d.reading?.speed || 0
    }));

    trends.push({
      skill: 'Reading Speed',
      timeframe: '30 days',
      dataPoints: readingSpeedData,
      trendDirection: this.calculateTrendDirection(readingSpeedData),
      trendStrength: this.calculateTrendStrength(readingSpeedData),
      projectedValue: this.projectFutureValue(readingSpeedData, 30),
      confidenceInterval: this.calculateConfidenceInterval(readingSpeedData)
    });

    // Add more trend analyses...

    return trends;
  }

  // Create learning profile
  private createLearningProfile(
    metrics: DimensionalMetrics,
    benchmarks: BenchmarkComparison[]
  ): LearningProfile {
    const strengths: string[] = [];
    const challenges: string[] = [];

    // Identify strengths (above 80th percentile)
    benchmarks.forEach(benchmark => {
      if (benchmark.percentileRank > 80) {
        strengths.push(benchmark.skill);
      } else if (benchmark.percentileRank < 30) {
        challenges.push(benchmark.skill);
      }
    });

    return {
      strengths,
      challenges,
      learningStyle: this.determineLearningStyle(metrics),
      optimalConditions: this.identifyOptimalConditions(metrics),
      motivationalFactors: this.identifyMotivationalFactors(metrics),
      supportNeeds: this.identifySupportNeeds(challenges),
      developmentalPriorities: this.prioritizeDevelopment(challenges)
    };
  }

  // Generate intervention plan
  private generateInterventionPlan(
    metrics: DimensionalMetrics,
    benchmarks: BenchmarkComparison[],
    profile: LearningProfile
  ): InterventionRecommendation[] {
    const interventions: InterventionRecommendation[] = [];

    profile.challenges.forEach(challenge => {
      const benchmark = benchmarks.find(b => b.skill === challenge);
      if (benchmark && benchmark.percentileRank < 30) {
        interventions.push({
          category: 'immediate',
          priority: 'high',
          skill: challenge,
          currentLevel: benchmark.studentScore,
          targetLevel: benchmark.benchmarkAvg,
          intervention: this.getInterventionStrategy(challenge),
          strategies: this.getSpecificStrategies(challenge),
          resources: this.getRequiredResources(challenge),
          timeline: '4-6 weeks',
          successCriteria: this.getSuccessCriteria(challenge),
          monitoringPlan: this.getMonitoringPlan(challenge),
          expectedOutcome: this.getExpectedOutcome(challenge)
        });
      }
    });

    return interventions;
  }

  // Helper methods
  private getAgeGroup(age: number): string {
    if (age <= 5) return '4-5';
    if (age <= 7) return '6-7';
    if (age <= 9) return '8-9';
    return '10+';
  }

  private calculatePercentile(
    score: number,
    domain: string,
    skill: string,
    age: number
  ): number {
    const ageGroup = this.getAgeGroup(age);
    const benchmark = this.ageBenchmarks[ageGroup]?.[domain]?.[skill];
    
    if (!benchmark) return 50;

    const zScore = this.calculateZScore(score, benchmark.avg, benchmark.sd);
    return this.zScoreToPercentile(zScore);
  }

  private calculateZScore(value: number, mean: number, sd: number): number {
    return (value - mean) / sd;
  }

  private zScoreToPercentile(zScore: number): number {
    // Simplified normal distribution approximation
    if (zScore < -3) return 1;
    if (zScore > 3) return 99;
    
    // Approximate percentile conversion
    return Math.round(50 + (zScore * 15));
  }

  private calculateConsistency(history: number[]): number {
    if (history.length < 2) return 0;
    
    const mean = history.reduce((sum, val) => sum + val, 0) / history.length;
    const variance = history.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / history.length;
    const standardDeviation = Math.sqrt(variance);
    
    return Math.max(0, 100 - (standardDeviation / mean) * 100);
  }

  private calculateErrorFrequency(errors: any[]): number {
    return errors.length;
  }

  private calculateSustainabilityIndex(attentionData: any): number {
    // Complex calculation based on multiple attention factors
    return (attentionData?.sustainability?.current || 0);
  }

  private analyzeFatiguePattern(sessions: any[]): string {
    // Analyze session data to identify fatigue patterns
    if (sessions.length < 3) return 'insufficient_data';
    
    const durations = sessions.map(s => s.duration);
    const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    
    if (avgDuration < 10) return 'early_fatigue';
    if (avgDuration < 20) return 'moderate_endurance';
    return 'good_endurance';
  }

  private calculateTrendDirection(dataPoints: Array<{ date: string; value: number }>): 'improving' | 'stable' | 'declining' {
    if (dataPoints.length < 2) return 'stable';
    
    const firstValue = dataPoints[0].value;
    const lastValue = dataPoints[dataPoints.length - 1].value;
    const change = ((lastValue - firstValue) / firstValue) * 100;
    
    if (change > 5) return 'improving';
    if (change < -5) return 'declining';
    return 'stable';
  }

  private calculateTrendStrength(dataPoints: Array<{ date: string; value: number }>): number {
    // Calculate correlation coefficient for trend strength
    if (dataPoints.length < 2) return 0;
    
    const n = dataPoints.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = dataPoints.map(d => d.value);
    
    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = y.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + (val * y[i]), 0);
    const sumX2 = x.reduce((sum, val) => sum + (val * val), 0);
    const sumY2 = y.reduce((sum, val) => sum + (val * val), 0);
    
    const numerator = (n * sumXY) - (sumX * sumY);
    const denominator = Math.sqrt(((n * sumX2) - (sumX * sumX)) * ((n * sumY2) - (sumY * sumY)));
    
    return denominator === 0 ? 0 : Math.abs(numerator / denominator);
  }

  private projectFutureValue(dataPoints: Array<{ date: string; value: number }>, daysAhead: number): number {
    if (dataPoints.length < 2) return dataPoints[0]?.value || 0;
    
    // Simple linear projection
    const firstValue = dataPoints[0].value;
    const lastValue = dataPoints[dataPoints.length - 1].value;
    const totalDays = dataPoints.length - 1;
    const dailyChange = (lastValue - firstValue) / totalDays;
    
    return lastValue + (dailyChange * daysAhead);
  }

  private calculateConfidenceInterval(dataPoints: Array<{ date: string; value: number }>): [number, number] {
    if (dataPoints.length < 2) return [0, 0];
    
    const values = dataPoints.map(d => d.value);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (values.length - 1);
    const standardError = Math.sqrt(variance / values.length);
    const marginOfError = 1.96 * standardError; // 95% confidence interval
    
    return [mean - marginOfError, mean + marginOfError];
  }

  private determineLearningStyle(metrics: DimensionalMetrics): string {
    // Analyze metrics to determine learning style
    const visualStrength = metrics.cognitive.spatialReasoning.visualProcessing;
    const auditoryStrength = metrics.speech.comprehension.auditoryProcessing;
    const kinestheticStrength = metrics.attention.taskSwitching.flexibilityIndex;
    
    if (visualStrength > auditoryStrength && visualStrength > kinestheticStrength) {
      return 'visual';
    } else if (auditoryStrength > kinestheticStrength) {
      return 'auditory';
    } else {
      return 'kinesthetic';
    }
  }

  private identifyOptimalConditions(metrics: DimensionalMetrics): string[] {
    const conditions: string[] = [];
    
    if (metrics.attention.concentration.averageDuration > 20) {
      conditions.push('Extended focus sessions');
    } else {
      conditions.push('Short, frequent sessions');
    }
    
    if (metrics.attention.sustainability.distractionResistance > 80) {
      conditions.push('Can work in busy environments');
    } else {
      conditions.push('Requires quiet, distraction-free environment');
    }
    
    return conditions;
  }

  private identifyMotivationalFactors(metrics: DimensionalMetrics): string[] {
    const factors: string[] = [];
    
    if (metrics.cognitive.creativeThinking.originalityScore > 80) {
      factors.push('Creative challenges');
      factors.push('Open-ended tasks');
    }
    
    if (metrics.attention.sustainability.motivationMaintenance > 75) {
      factors.push('Goal-oriented activities');
      factors.push('Progress tracking');
    }
    
    return factors;
  }

  private identifySupportNeeds(challenges: string[]): string[] {
    const needs: string[] = [];
    
    challenges.forEach(challenge => {
      switch (challenge) {
        case 'Reading Speed':
          needs.push('Fluency practice', 'Timed reading exercises');
          break;
        case 'Attention Duration':
          needs.push('Attention training', 'Break scheduling');
          break;
        case 'Speech Clarity':
          needs.push('Articulation therapy', 'Speech practice');
          break;
        default:
          needs.push('Targeted intervention');
      }
    });
    
    return [...new Set(needs)];
  }

  private prioritizeDevelopment(challenges: string[]): string[] {
    // Prioritize based on foundational importance
    const priorities = [
      'Attention Duration',
      'Reading Accuracy',
      'Speech Clarity',
      'Reading Speed',
      'Vocabulary Growth'
    ];
    
    return priorities.filter(priority => challenges.includes(priority));
  }

  private getDevelopmentalStatus(overallPerformance: number): string {
    if (overallPerformance >= 80) return 'Above average development';
    if (overallPerformance >= 60) return 'Typical development';
    if (overallPerformance >= 40) return 'Some areas need support';
    return 'Requires comprehensive support';
  }

  private getRecommendedActions(challenges: string[]): string[] {
    return challenges.slice(0, 3).map(challenge => 
      `Focus on improving ${challenge.toLowerCase()}`
    );
  }

  private generateParentGuidance(profile: LearningProfile, interventions: InterventionRecommendation[]): any {
    return {
      homeActivities: this.getHomeActivities(profile.challenges),
      environmentalSupports: this.getEnvironmentalSupports(profile.optimalConditions),
      communicationStrategies: this.getCommunicationStrategies(profile.challenges),
      progressMonitoring: this.getProgressMonitoring(interventions)
    };
  }

  private generateEducatorGuidance(profile: LearningProfile, interventions: InterventionRecommendation[]): any {
    return {
      classroomAccommodations: this.getClassroomAccommodations(profile.challenges),
      instructionalStrategies: this.getInstructionalStrategies(profile.learningStyle),
      assessmentModifications: this.getAssessmentModifications(profile.challenges),
      collaborationPlan: this.getCollaborationPlan(interventions)
    };
  }

  // Additional helper methods for guidance generation
  private getHomeActivities(challenges: string[]): string[] {
    const activities: string[] = [];
    
    challenges.forEach(challenge => {
      switch (challenge) {
        case 'Reading Speed':
          activities.push('Daily 15-minute reading practice', 'Use timer for reading exercises');
          break;
        case 'Vocabulary Growth':
          activities.push('Word games during meals', 'Read diverse books together');
          break;
        default:
          activities.push('Practice relevant skills daily');
      }
    });
    
    return [...new Set(activities)];
  }

  private getEnvironmentalSupports(conditions: string[]): string[] {
    return conditions.map(condition => {
      if (condition.includes('quiet')) {
        return 'Create quiet study space';
      } else if (condition.includes('short')) {
        return 'Use timer for study sessions';
      }
      return 'Optimize learning environment';
    });
  }

  private getCommunicationStrategies(challenges: string[]): string[] {
    return challenges.map(challenge => {
      if (challenge.includes('Speech')) {
        return 'Practice clear communication daily';
      } else if (challenge.includes('Attention')) {
        return 'Use clear, simple instructions';
      }
      return 'Maintain positive communication';
    });
  }

  private getProgressMonitoring(interventions: InterventionRecommendation[]): string[] {
    return interventions.map(intervention => 
      `Monitor ${intervention.skill} progress weekly`
    );
  }

  private getClassroomAccommodations(challenges: string[]): string[] {
    return challenges.map(challenge => {
      switch (challenge) {
        case 'Attention Duration':
          return 'Provide frequent breaks';
        case 'Reading Speed':
          return 'Allow extra time for reading tasks';
        default:
          return 'Provide appropriate accommodations';
      }
    });
  }

  private getInstructionalStrategies(learningStyle: string): string[] {
    switch (learningStyle) {
      case 'visual':
        return ['Use visual aids', 'Provide graphic organizers', 'Include charts and diagrams'];
      case 'auditory':
        return ['Use verbal instructions', 'Include discussions', 'Provide audio materials'];
      case 'kinesthetic':
        return ['Include hands-on activities', 'Allow movement', 'Use manipulatives'];
      default:
        return ['Use multi-sensory approaches'];
    }
  }

  private getAssessmentModifications(challenges: string[]): string[] {
    return challenges.map(challenge => {
      if (challenge.includes('Reading')) {
        return 'Provide alternative assessment formats';
      } else if (challenge.includes('Attention')) {
        return 'Break assessments into shorter segments';
      }
      return 'Modify assessment as needed';
    });
  }

  private getCollaborationPlan(interventions: InterventionRecommendation[]): string[] {
    return [
      'Weekly progress meetings',
      'Shared intervention strategies',
      'Consistent communication between home and school',
      'Regular data collection and analysis'
    ];
  }

  // Intervention strategy methods
  private getInterventionStrategy(skill: string): string {
    const strategies: Record<string, string> = {
      'Reading Speed': 'Implement fluency-building exercises with repeated reading and timed practice',
      'Reading Accuracy': 'Use systematic phonics instruction and error correction procedures',
      'Attention Duration': 'Gradually increase focus time with structured attention training',
      'Speech Clarity': 'Provide articulation therapy with targeted phoneme practice',
      'Vocabulary Growth': 'Implement explicit vocabulary instruction with multiple exposures'
    };
    
    return strategies[skill] || 'Implement targeted intervention strategies';
  }

  private getSpecificStrategies(skill: string): string[] {
    const strategies: Record<string, string[]> = {
      'Reading Speed': [
        'Repeated reading of familiar texts',
        'Phrase reading practice',
        'Timed reading exercises',
        'Fluency modeling'
      ],
      'Attention Duration': [
        'Progressive attention training',
        'Mindfulness exercises',
        'Environmental modifications',
        'Break scheduling'
      ]
    };
    
    return strategies[skill] || ['Implement evidence-based strategies'];
  }

  private getRequiredResources(skill: string): string[] {
    const resources: Record<string, string[]> = {
      'Reading Speed': ['Leveled readers', 'Timer', 'Progress charts'],
      'Attention Duration': ['Attention training apps', 'Quiet space', 'Visual timers']
    };
    
    return resources[skill] || ['Appropriate learning materials'];
  }

  private getSuccessCriteria(skill: string): string[] {
    const criteria: Record<string, string[]> = {
      'Reading Speed': ['Increase WPM by 20%', 'Maintain 95% accuracy'],
      'Attention Duration': ['Sustain focus for 25 minutes', 'Complete tasks with minimal prompting']
    };
    
    return criteria[skill] || ['Achieve measurable improvement'];
  }

  private getMonitoringPlan(skill: string): string[] {
    return [
      'Weekly progress assessments',
      'Data collection and graphing',
      'Regular strategy adjustments',
      'Stakeholder communication'
    ];
  }

  private getExpectedOutcome(skill: string): string {
    const outcomes: Record<string, string> = {
      'Reading Speed': 'Student will achieve age-appropriate reading fluency within 6-8 weeks',
      'Attention Duration': 'Student will demonstrate sustained attention for academic tasks within 4-6 weeks'
    };
    
    return outcomes[skill] || 'Student will show measurable improvement in targeted skill';
  }
}

// Export singleton instance
export const multiDimensionalAnalytics = new MultiDimensionalAnalyticsService();

// Utility functions for report generation
export const formatPercentileRank = (percentile: number): string => {
  if (percentile >= 90) return 'Well Above Average';
  if (percentile >= 75) return 'Above Average';
  if (percentile >= 25) return 'Average';
  if (percentile >= 10) return 'Below Average';
  return 'Well Below Average';
};

export const getPerformanceLevel = (score: number, max: number = 100): string => {
  const percentage = (score / max) * 100;
  if (percentage >= 90) return 'Advanced';
  if (percentage >= 80) return 'Proficient';
  if (percentage >= 70) return 'Developing';
  if (percentage >= 60) return 'Beginning';
  return 'Below Basic';
};

export const generateReportNarrative = (report: ComprehensiveReport): string => {
  const { studentInfo, executiveSummary, learningProfile } = report;
  
  return `${studentInfo.name}, age ${studentInfo.age}, demonstrates ${executiveSummary.developmentalStatus.toLowerCase()}. 
    Key strengths include ${executiveSummary.keyStrengths.join(', ')}. 
    Areas for growth include ${executiveSummary.primaryConcerns.join(', ')}. 
    The student's learning style is ${learningProfile.learningStyle}, and they benefit from ${learningProfile.optimalConditions.join(' and ')}.`;
};