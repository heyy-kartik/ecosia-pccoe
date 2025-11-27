import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/mongodb';
import { LearningGoal, KnowledgeQuestion, AssessmentResult, LearningPath } from '@/models/Assessment';

// GET - Fetch learning goals for user's age group
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const ageGroup = searchParams.get('ageGroup');
    const step = searchParams.get('step') || 'goals';

    if (step === 'goals') {
      const goals = await LearningGoal.find({ 
        ageGroups: { $in: [ageGroup] } 
      }).sort({ category: 1 }); 
      
      return NextResponse.json({ goals });
    }

    if (step === 'assessment') {
      const questions = await KnowledgeQuestion.find({ 
        ageGroup: ageGroup 
      }).limit(10).sort({ difficulty: 1 });
      
      return NextResponse.json({ questions });
    }

    return NextResponse.json({ error: 'Invalid step' }, { status: 400 });

  } catch (error) {
    console.error('Learning goals fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Submit learning goals selection or assessment
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const body = await request.json();
    const { step, data } = body;

    if (step === 'assessment') {
      // Calculate assessment score
      const { responses, ageGroup } = data;
      let correctAnswers = 0;
      
      for (const response of responses) {
        const question = await KnowledgeQuestion.findOne({ id: response.questionId });
        if (question && question.correctAnswer === response.selectedAnswer) {
          correctAnswers++;
        }
      }

      const score = (correctAnswers / responses.length) * 100;
      let knowledgeLevel: 'beginner' | 'intermediate' | 'advanced';
      
      if (score < 40) knowledgeLevel = 'beginner';
      else if (score < 70) knowledgeLevel = 'intermediate';
      else knowledgeLevel = 'advanced';

      // Save assessment result
      const assessmentResult = new AssessmentResult({
        userId,
        assessmentType: 'onboarding',
        responses: responses.map((r: any) => ({
          questionId: r.questionId,
          selectedAnswer: r.selectedAnswer,
          isCorrect: r.selectedAnswer === r.correctAnswer,
          timeSpent: r.timeSpent
        })),
        score,
        knowledgeLevel
      });

      await assessmentResult.save();

      return NextResponse.json({ 
        score, 
        knowledgeLevel,
        assessmentId: assessmentResult._id 
      });
    }

    if (step === 'create_path') {
      const { ageGroup, selectedGoals, knowledgeLevel, learningStyle, assessmentId } = data;
      
      // Generate AI-powered content recommendations
      const recommendations = await generateContentRecommendations({
        ageGroup,
        selectedGoals,
        knowledgeLevel,
        learningStyle
      });

      // Create learning path
      const learningPath = new LearningPath({
        userId,
        ageGroup,
        knowledgeLevel,
        selectedGoals,
        learningStyle,
        recommendedContent: recommendations,
        progress: {
          completedContent: [],
          currentStreak: 0,
          totalPoints: 0
        }
      });

      await learningPath.save();

      return NextResponse.json({ 
        success: true, 
        learningPathId: learningPath._id,
        recommendations 
      });
    }

    return NextResponse.json({ error: 'Invalid step' }, { status: 400 });

  } catch (error) {
    console.error('Onboarding submission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// AI Content Recommendation Engine
async function generateContentRecommendations({
  ageGroup,
  selectedGoals,
  knowledgeLevel,
  learningStyle
}: {
  ageGroup: string;
  selectedGoals: string[];
  knowledgeLevel: string;
  learningStyle: string;
}) {
  // This would integrate with OpenAI API for smarter recommendations
  // For now, we'll use rule-based logic
  
  const { Content } = await import('@/models/Content');
  
  // Get content based on user profile
  const availableContent = await Content.find({
    ageGroup: { $in: [ageGroup, 'all'] },
    difficulty: { $lte: getDifficultyLevel(knowledgeLevel) }
  });

  // Score and sort content based on user preferences
  const scoredContent = availableContent.map((content: any) => {
    let score = 0;
    
    // Goal alignment scoring
    selectedGoals.forEach(goal => {
      if (content.tags?.includes(goal)) score += 10;
      if (content.category === goal) score += 15;
    });

    // Learning style scoring
    if (learningStyle === 'visual' && content.type === 'video') score += 5;
    if (learningStyle === 'reading' && content.type === 'article') score += 5;
    if (learningStyle === 'kinesthetic' && content.type === 'interactive') score += 5;

    // Knowledge level scoring
    if (content.difficulty === knowledgeLevel) score += 8;
    
    // Popularity scoring
    score += Math.min(content.views / 100, 5);

    return {
      contentId: content._id.toString(),
      priority: score,
      reason: generateRecommendationReason(content, selectedGoals, learningStyle),
      estimatedDuration: content.estimatedDuration || 15
    };
  });

  // Return top 20 recommendations sorted by score
  return scoredContent
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 20);
}

function getDifficultyLevel(knowledgeLevel: string): number {
  switch (knowledgeLevel) {
    case 'beginner': return 1;
    case 'intermediate': return 2;
    case 'advanced': return 3;
    default: return 1;
  }
}

function generateRecommendationReason(content: any, goals: string[], learningStyle: string): string {
  const reasons = [];
  
  if (goals.some(goal => content.tags?.includes(goal))) {
    reasons.push('Matches your learning goals');
  }
  
  if ((learningStyle === 'visual' && content.type === 'video') ||
      (learningStyle === 'reading' && content.type === 'article')) {
    reasons.push(`Suits your ${learningStyle} learning style`);
  }
  
  if (content.views > 1000) {
    reasons.push('Popular content');
  }

  return reasons.join(', ') || 'Recommended for you';
}