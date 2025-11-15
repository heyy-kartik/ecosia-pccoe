import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/mongodb';
import { LearningPath, AssessmentResult } from '@/models/Assessment';
import { Content } from '@/models/Content';
import { User } from '@/models/User';

interface RecommendationRequest {
  userId?: string;
  contentId?: string;
  action: 'get_recommendations' | 'update_progress' | 'adaptive_adjustment';
  context?: {
    currentContent?: string;
    timeSpent?: number;
    completionRate?: number;
    difficulty?: number; // 1-5 scale
  };
}

interface ContentRecommendation {
  contentId: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  estimatedDuration: number;
  relevanceScore: number;
  adaptationReason: string;
  prerequisites?: string[];
  nextSteps?: string[];
}

// GET - Fetch AI-powered recommendations
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'general';
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get user's learning path
    const learningPath = await LearningPath.findOne({ userId });
    if (!learningPath) {
      return NextResponse.json({ error: 'Learning path not found' }, { status: 404 });
    }

    // Get user's latest assessment results for context
    const latestAssessment = await AssessmentResult.findOne({ 
      userId,
      assessmentType: { $in: ['onboarding', 'progress'] }
    }).sort({ completedAt: -1 });

    // Generate recommendations based on type
    let recommendations: ContentRecommendation[] = [];

    switch (type) {
      case 'next_lesson':
        recommendations = await getNextLessonRecommendations(learningPath, limit);
        break;
      case 'review':
        recommendations = await getReviewRecommendations(learningPath, limit);
        break;
      case 'challenge':
        recommendations = await getChallengeRecommendations(learningPath, latestAssessment, limit);
        break;
      default:
        recommendations = await getGeneralRecommendations(learningPath, latestAssessment, limit);
    }

    return NextResponse.json({ 
      recommendations,
      userContext: {
        knowledgeLevel: learningPath.knowledgeLevel,
        completedContent: learningPath.progress.completedContent.length,
        currentStreak: learningPath.progress.currentStreak
      }
    });

  } catch (error) {
    console.error('Recommendation fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Update learning progress and trigger adaptive recommendations
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const body: RecommendationRequest = await request.json();

    if (body.action === 'update_progress') {
      const result = await updateLearningProgress(userId, body);
      return NextResponse.json(result);
    }

    if (body.action === 'adaptive_adjustment') {
      const result = await performAdaptiveAdjustment(userId, body.context);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Progress update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// AI Recommendation Functions
async function getNextLessonRecommendations(
  learningPath: any, 
  limit: number
): Promise<ContentRecommendation[]> {
  const completedContent = learningPath.progress.completedContent;
  
  // Get recommended content that hasn't been completed
  const uncompletedRecommendations = learningPath.recommendedContent.filter(
    (rec: any) => !completedContent.includes(rec.contentId)
  );

  // Fetch actual content details
  const contentDetails = await Content.find({
    _id: { $in: uncompletedRecommendations.map((r: any) => r.contentId) }
  }).limit(limit);

  return contentDetails.map((content: any) => {
    const recommendation = uncompletedRecommendations.find(
      (r: any) => r.contentId === content._id.toString()
    );

    return {
      contentId: content._id.toString(),
      title: content.title,
      description: content.description,
      type: content.type || 'article',
      difficulty: content.difficulty,
      estimatedDuration: content.estimatedDuration || 15,
      relevanceScore: recommendation?.priority || 0,
      adaptationReason: recommendation?.reason || 'Next in your learning path',
      prerequisites: content.prerequisites || [],
      nextSteps: content.nextSteps || []
    };
  });
}

async function getReviewRecommendations(
  learningPath: any, 
  limit: number
): Promise<ContentRecommendation[]> {
  const completedContent = learningPath.progress.completedContent;
  
  if (completedContent.length === 0) {
    return [];
  }

  // Get recently completed content for review
  const recentContent = await Content.find({
    _id: { $in: completedContent.slice(-limit) }
  });

  return recentContent.map((content: any) => ({
    contentId: content._id.toString(),
    title: `Review: ${content.title}`,
    description: content.description,
    type: 'review',
    difficulty: content.difficulty,
    estimatedDuration: Math.floor((content.estimatedDuration || 15) * 0.5),
    relevanceScore: 8,
    adaptationReason: 'Spaced repetition for better retention',
    prerequisites: [],
    nextSteps: []
  }));
}

async function getChallengeRecommendations(
  learningPath: any,
  latestAssessment: any,
  limit: number
): Promise<ContentRecommendation[]> {
  let targetDifficulty = learningPath.knowledgeLevel;
  
  // Increase difficulty if user is performing well
  if (latestAssessment && latestAssessment.score > 80) {
    const difficultyMap: { [key: string]: string } = {
      'beginner': 'intermediate',
      'intermediate': 'advanced',
      'advanced': 'advanced'
    };
    targetDifficulty = difficultyMap[targetDifficulty] || targetDifficulty;
  }

  const challengeContent = await Content.find({
    difficulty: targetDifficulty,
    type: { $in: ['quiz', 'interactive', 'simulation'] },
    ageGroup: learningPath.ageGroup
  }).limit(limit);

  return challengeContent.map((content: any) => ({
    contentId: content._id.toString(),
    title: content.title,
    description: content.description,
    type: content.type,
    difficulty: content.difficulty,
    estimatedDuration: content.estimatedDuration || 20,
    relevanceScore: 9,
    adaptationReason: 'Challenge yourself with interactive content',
    prerequisites: content.prerequisites || [],
    nextSteps: content.nextSteps || []
  }));
}

async function getGeneralRecommendations(
  learningPath: any,
  latestAssessment: any,
  limit: number
): Promise<ContentRecommendation[]> {
  const completedContent = learningPath.progress.completedContent;
  
  // Smart content discovery based on learning pattern
  const baseQuery = {
    ageGroup: { $in: [learningPath.ageGroup, 'all'] },
    _id: { $nin: completedContent },
    difficulty: getDifficultyRange(learningPath.knowledgeLevel, latestAssessment)
  };

  // Prefer content matching user's learning style
  const stylePreference: { [key: string]: any } = {
    'visual': { type: { $in: ['video', 'infographic'] } },
    'auditory': { type: { $in: ['podcast', 'audio'] } },
    'reading': { type: { $in: ['article', 'document'] } },
    'kinesthetic': { type: { $in: ['interactive', 'simulation'] } }
  };

  const preferredContent = await Content.find({
    ...baseQuery,
    ...stylePreference[learningPath.learningStyle]
  }).limit(Math.floor(limit * 0.7));

  const generalContent = await Content.find(baseQuery)
    .limit(limit - preferredContent.length);

  const allContent = [...preferredContent, ...generalContent];

  return allContent.map((content: any) => ({
    contentId: content._id.toString(),
    title: content.title,
    description: content.description,
    type: content.type || 'article',
    difficulty: content.difficulty,
    estimatedDuration: content.estimatedDuration || 15,
    relevanceScore: calculateRelevanceScore(content, learningPath),
    adaptationReason: generateAdaptationReason(content, learningPath),
    prerequisites: content.prerequisites || [],
    nextSteps: content.nextSteps || []
  }));
}

async function updateLearningProgress(userId: string, request: RecommendationRequest) {
  const { contentId, context } = request;
  
  if (!contentId || !context) {
    throw new Error('Missing content ID or context');
  }

  // Update learning path progress
  const learningPath = await LearningPath.findOne({ userId });
  if (!learningPath) {
    throw new Error('Learning path not found');
  }

  // Add to completed content if completion rate > 80%
  if (context.completionRate && context.completionRate > 0.8) {
    learningPath.progress.completedContent.push(contentId);
    learningPath.progress.totalPoints += calculatePoints(context);
    
    // Update streak
    const today = new Date().toDateString();
    const lastActivity = new Date(learningPath.updatedAt).toDateString();
    
    if (today !== lastActivity) {
      learningPath.progress.currentStreak += 1;
    }
  }

  // Record performance for adaptive learning
  const performance = {
    date: new Date(),
    contentId,
    timeSpent: context.timeSpent || 0,
    completionRate: context.completionRate || 0,
    perceivedDifficulty: context.difficulty || 3
  };

  learningPath.adaptations = learningPath.adaptations || [];
  learningPath.updatedAt = new Date();
  
  await learningPath.save();

  // Trigger adaptive adjustment if needed
  if (shouldTriggerAdaptation(performance, learningPath)) {
    await performAdaptiveAdjustment(userId, context);
  }

  return { success: true, points: learningPath.progress.totalPoints };
}

async function performAdaptiveAdjustment(userId: string, context: any) {
  const learningPath = await LearningPath.findOne({ userId });
  if (!learningPath) {
    throw new Error('Learning path not found');
  }

  let adaptationMade = false;
  const adaptation = {
    date: new Date(),
    reason: '',
    changes: ''
  };

  // Adjust difficulty based on performance
  if (context?.difficulty) {
    if (context.difficulty < 2 && learningPath.knowledgeLevel === 'intermediate') {
      // Content too easy, increase difficulty
      learningPath.knowledgeLevel = 'advanced';
      adaptation.reason = 'Performance indicates readiness for advanced content';
      adaptation.changes = 'Upgraded to advanced difficulty level';
      adaptationMade = true;
    } else if (context.difficulty > 4 && learningPath.knowledgeLevel === 'advanced') {
      // Content too hard, decrease difficulty
      learningPath.knowledgeLevel = 'intermediate';
      adaptation.reason = 'Content difficulty exceeds current comfort level';
      adaptation.changes = 'Adjusted to intermediate difficulty level';
      adaptationMade = true;
    }
  }

  // Adjust learning style based on engagement
  if (context?.timeSpent && context?.completionRate) {
    const engagement = context.completionRate * (context.timeSpent / 60); // engagement score
    
    if (engagement < 0.3) {
      // Low engagement, try different content type
      const newStyle = suggestAlternativeStyle(learningPath.learningStyle);
      if (newStyle !== learningPath.learningStyle) {
        learningPath.learningStyle = newStyle;
        adaptation.reason = 'Low engagement with current content style';
        adaptation.changes = `Switched to ${newStyle} learning style`;
        adaptationMade = true;
      }
    }
  }

  if (adaptationMade) {
    learningPath.adaptations.push(adaptation);
    await learningPath.save();

    // Regenerate recommendations with new parameters
    const newRecommendations = await generateUpdatedRecommendations(learningPath);
    learningPath.recommendedContent = newRecommendations;
    await learningPath.save();
  }

  return { 
    adapted: adaptationMade, 
    adaptation: adaptationMade ? adaptation : null,
    newKnowledgeLevel: learningPath.knowledgeLevel,
    newLearningStyle: learningPath.learningStyle
  };
}

// Helper Functions
function getDifficultyRange(knowledgeLevel: string, assessment: any) {
  const baseLevel = knowledgeLevel;
  const levels = ['beginner', 'intermediate', 'advanced'];
  const currentIndex = levels.indexOf(baseLevel);
  
  // Expand range based on assessment performance
  if (assessment && assessment.score > 80) {
    return { $in: levels.slice(currentIndex, Math.min(currentIndex + 2, levels.length)) };
  }
  
  return { $in: levels.slice(Math.max(currentIndex - 1, 0), currentIndex + 1) };
}

function calculateRelevanceScore(content: any, learningPath: any): number {
  let score = 5; // base score
  
  // Goal alignment
  if (content.tags && learningPath.selectedGoals) {
    const matchingGoals = content.tags.filter((tag: string) => 
      learningPath.selectedGoals.includes(tag)
    );
    score += matchingGoals.length * 2;
  }

  // Difficulty appropriateness
  if (content.difficulty === learningPath.knowledgeLevel) score += 3;
  
  // Learning style preference
  const styleMap: { [key: string]: string[] } = {
    'visual': ['video', 'infographic'],
    'auditory': ['podcast', 'audio'],
    'reading': ['article', 'document'],
    'kinesthetic': ['interactive', 'simulation']
  };
  
  if (styleMap[learningPath.learningStyle]?.includes(content.type)) {
    score += 2;
  }

  return Math.min(score, 10);
}

function generateAdaptationReason(content: any, learningPath: any): string {
  const reasons = [];
  
  if (content.difficulty === learningPath.knowledgeLevel) {
    reasons.push('Matches your knowledge level');
  }
  
  if (content.tags && learningPath.selectedGoals.some((goal: string) => 
    content.tags.includes(goal))) {
    reasons.push('Aligns with your learning goals');
  }

  const styleMap: { [key: string]: string[] } = {
    'visual': ['video', 'infographic'],
    'auditory': ['podcast', 'audio'],
    'reading': ['article', 'document'], 
    'kinesthetic': ['interactive', 'simulation']
  };
  
  if (styleMap[learningPath.learningStyle]?.includes(content.type)) {
    reasons.push(`Fits your ${learningPath.learningStyle} learning style`);
  }

  return reasons.join(', ') || 'Recommended based on your profile';
}

function calculatePoints(context: any): number {
  let points = 10; // base points
  
  if (context.completionRate > 0.9) points += 5; // bonus for completion
  if (context.timeSpent && context.timeSpent > 600) points += 3; // bonus for engagement
  if (context.difficulty > 3) points += context.difficulty; // difficulty bonus
  
  return points;
}

function shouldTriggerAdaptation(performance: any, learningPath: any): boolean {
  // Trigger adaptation if last 3 sessions show consistent pattern
  if (learningPath.adaptations.length < 3) return false;
  
  const recentSessions = learningPath.adaptations.slice(-3);
  const avgDifficulty = recentSessions.reduce((sum: number, session: any) => 
    sum + (session.perceivedDifficulty || 3), 0) / recentSessions.length;
  
  return avgDifficulty < 2 || avgDifficulty > 4;
}

function suggestAlternativeStyle(currentStyle: string): string {
  const alternatives: { [key: string]: string } = {
    'visual': 'kinesthetic',
    'auditory': 'reading',
    'reading': 'visual',
    'kinesthetic': 'auditory'
  };
  
  return alternatives[currentStyle] || 'visual';
}

async function generateUpdatedRecommendations(learningPath: any) {
  // This would use the same logic as the original recommendation generation
  // but with updated user parameters
  const content = await Content.find({
    ageGroup: learningPath.ageGroup,
    difficulty: learningPath.knowledgeLevel
  }).limit(20);

  return content.map((item: any) => ({
    contentId: item._id.toString(),
    priority: calculateRelevanceScore(item, learningPath),
    reason: generateAdaptationReason(item, learningPath),
    estimatedDuration: item.estimatedDuration || 15
  }));
}