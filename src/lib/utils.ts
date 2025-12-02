import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Learner Progress Types
export interface LearnerProgress {
  completedLessons: number;
  totalLessons: number;
  weakTopics: string[];
  strongTopics: string[];
  currentStreak: number;
  quizAccuracy: number;
  activityPoints: number;
  recentActivity: {
    type: string;
    topic: string;
    score?: number;
    date: Date;
  }[];
  focusAreas: string[];
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
}

// Parse existing dashboard data to extract learner signals
export function parseLearnerProgress(dashboardData?: any[]): LearnerProgress {
  if (!dashboardData || !Array.isArray(dashboardData)) {
    // Return default progress for new users
    return {
      completedLessons: 0,
      totalLessons: 68,
      weakTopics: ['Climate Basics', 'Renewable Energy'],
      strongTopics: [],
      currentStreak: 0,
      quizAccuracy: 0,
      activityPoints: 0,
      recentActivity: [],
      focusAreas: ['Climate Basics'],
      difficultyLevel: 'beginner'
    };
  }

  const completed = dashboardData.filter(item => item.status === "Done");
  const inProcess = dashboardData.filter(item => item.status === "In Process");
  
  // Analyze topic performance based on target vs limit
  const weakTopics: string[] = [];
  const strongTopics: string[] = [];
  
  dashboardData.forEach(item => {
    const target = parseInt(item.target) || 0;
    const limit = parseInt(item.limit) || 0;
    const performance = target / Math.max(limit, 1);
    
    if (performance < 0.7 && item.status === "Done") {
      weakTopics.push(getTopicCategory(item.type));
    } else if (performance > 1.2 && item.status === "Done") {
      strongTopics.push(getTopicCategory(item.type));
    }
  });

  // Calculate streak based on completion pattern
  const recentCompleted = completed
    .sort((a, b) => b.id - a.id)
    .slice(0, 7);
  
  // Mock recent activity based on data
  const recentActivity = recentCompleted.slice(0, 5).map(item => ({
    type: 'lesson',
    topic: item.header,
    score: Math.floor(Math.random() * 30) + 70, // 70-100
    date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
  }));

  // Determine difficulty level based on completion ratio and performance
  const completionRatio = completed.length / dashboardData.length;
  let difficultyLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
  
  if (completionRatio > 0.7) difficultyLevel = 'advanced';
  else if (completionRatio > 0.3) difficultyLevel = 'intermediate';

  // Extract unique weak topics (remove duplicates)
  const uniqueWeakTopics = [...new Set(weakTopics)].slice(0, 3);
  const uniqueStrongTopics = [...new Set(strongTopics)].slice(0, 3);

  return {
    completedLessons: completed.length,
    totalLessons: dashboardData.length,
    weakTopics: uniqueWeakTopics,
    strongTopics: uniqueStrongTopics,
    currentStreak: Math.min(recentCompleted.length, 7),
    quizAccuracy: 75 + Math.random() * 20, // Mock quiz accuracy 75-95%
    activityPoints: completed.length * 15 + Math.floor(Math.random() * 100),
    recentActivity,
    focusAreas: uniqueWeakTopics.length > 0 ? uniqueWeakTopics : ['Climate Basics'],
    difficultyLevel
  };
}

// Helper function to categorize item types into climate topics
function getTopicCategory(type: string): string {
  const typeMap: Record<string, string> = {
    'Technical content': 'Technical Climate Solutions',
    'Narrative': 'Climate Science',
    'Research': 'Climate Research & Data',
    'Planning': 'Climate Action Planning',
    'Legal': 'Climate Policy & Law',
    'Financial': 'Green Finance',
    'Visual': 'Climate Communication'
  };
  
  return typeMap[type] || 'General Climate Knowledge';
}
