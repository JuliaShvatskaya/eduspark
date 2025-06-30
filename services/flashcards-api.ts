// Flashcards API Integration Service
// This service handles communication with kids-flashcards.com API

export interface Flashcard {
  id: string;
  word: string;
  definition: string;
  imageUrl?: string;
  audioUrl?: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  syllables?: string[];
  phonetics?: string;
}

export interface FlashcardSet {
  id: string;
  title: string;
  description: string;
  cards: Flashcard[];
  category: string;
  ageGroup: string;
}

class FlashcardsAPIService {
  private baseUrl = 'https://api.kids-flashcards.com/v1';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Flashcards API Error:', error);
      throw error;
    }
  }

  // Get flashcard sets by category
  async getFlashcardSetsByCategory(category: string): Promise<FlashcardSet[]> {
    return this.request<FlashcardSet[]>(`/sets?category=${encodeURIComponent(category)}`);
  }

  // Get a specific flashcard set
  async getFlashcardSet(setId: string): Promise<FlashcardSet> {
    return this.request<FlashcardSet>(`/sets/${setId}`);
  }

  // Get flashcards by difficulty level
  async getFlashcardsByDifficulty(difficulty: string, limit: number = 20): Promise<Flashcard[]> {
    return this.request<Flashcard[]>(`/cards?difficulty=${difficulty}&limit=${limit}`);
  }

  // Search flashcards by keyword
  async searchFlashcards(query: string, filters?: {
    category?: string;
    difficulty?: string;
    ageGroup?: string;
  }): Promise<Flashcard[]> {
    const params = new URLSearchParams({ q: query });
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }

    return this.request<Flashcard[]>(`/cards/search?${params.toString()}`);
  }

  // Transform flashcard into interactive exercise data
  transformToReadingExercise(flashcard: Flashcard): any {
    return {
      id: flashcard.id,
      type: 'syllable-reading',
      word: flashcard.word,
      syllables: flashcard.syllables || this.generateSyllables(flashcard.word),
      imageUrl: flashcard.imageUrl,
      audioUrl: flashcard.audioUrl,
      difficulty: flashcard.difficulty,
      instructions: `Read the word "${flashcard.word}" by breaking it into syllables`,
    };
  }

  // Transform flashcard into attention exercise
  transformToAttentionExercise(flashcards: Flashcard[]): any {
    return {
      type: 'memory-match',
      cards: flashcards.slice(0, 8).map(card => ({
        id: card.id,
        word: card.word,
        imageUrl: card.imageUrl,
      })),
      instructions: 'Match the words with their pictures',
    };
  }

  // Transform flashcard into speed reading exercise
  transformToSpeedReadingExercise(flashcards: Flashcard[]): any {
    return {
      type: 'flash-reading',
      words: flashcards.map(card => card.word),
      duration: 2000, // 2 seconds per word
      instructions: 'Read each word as quickly as possible',
    };
  }

  // Helper method to generate syllables (basic implementation)
  private generateSyllables(word: string): string[] {
    // Simple syllable generation - in production, use a proper syllable library
    const vowels = 'aeiouAEIOU';
    const syllables: string[] = [];
    let currentSyllable = '';

    for (let i = 0; i < word.length; i++) {
      currentSyllable += word[i];
      
      if (vowels.includes(word[i]) && i < word.length - 1) {
        syllables.push(currentSyllable);
        currentSyllable = '';
      }
    }

    if (currentSyllable) {
      syllables.push(currentSyllable);
    }

    return syllables.length > 0 ? syllables : [word];
  }

  // Get daily recommended flashcards based on user progress
  async getDailyRecommendations(userId: string, skillLevel: string): Promise<Flashcard[]> {
    return this.request<Flashcard[]>(`/recommendations/${userId}?level=${skillLevel}`);
  }

  // Track user interaction with flashcard
  async trackFlashcardInteraction(flashcardId: string, userId: string, interaction: {
    type: 'viewed' | 'completed' | 'struggled';
    duration: number;
    accuracy?: number;
  }): Promise<void> {
    await this.request('/analytics/interactions', {
      method: 'POST',
      body: JSON.stringify({
        flashcardId,
        userId,
        ...interaction,
        timestamp: new Date().toISOString(),
      }),
    });
  }
}

// Mock data for development/demo purposes
export const mockFlashcards: Flashcard[] = [
  {
    id: '1',
    word: 'butterfly',
    definition: 'A flying insect with colorful wings',
    imageUrl: 'https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg',
    category: 'animals',
    difficulty: 'intermediate',
    syllables: ['but', 'ter', 'fly'],
    phonetics: '/ˈbʌtərˌflaɪ/'
  },
  {
    id: '2',
    word: 'elephant',
    definition: 'A large gray mammal with a trunk',
    imageUrl: 'https://images.pexels.com/photos/1300510/pexels-photo-1300510.jpeg',
    category: 'animals',
    difficulty: 'beginner',
    syllables: ['el', 'e', 'phant'],
    phonetics: '/ˈɛləfənt/'
  },
  {
    id: '3',
    word: 'rainbow',
    definition: 'Colorful arc in the sky after rain',
    imageUrl: 'https://images.pexels.com/photos/1529360/pexels-photo-1529360.jpeg',
    category: 'nature',
    difficulty: 'intermediate',
    syllables: ['rain', 'bow'],
    phonetics: '/ˈreɪnˌboʊ/'
  }
];

// Export singleton instance
export const flashcardsAPI = new FlashcardsAPIService(process.env.NEXT_PUBLIC_FLASHCARDS_API_KEY || 'demo-key');