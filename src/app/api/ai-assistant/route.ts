import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { groq } from '@ai-sdk/groq';
import { generateObject, generateText } from 'ai';
import { z } from 'zod';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Content from '@/models/Content';

// Climate education categories
const CLIMATE_CATEGORIES = {
  'climate-basics': {
    name: 'Climate Basics',
    description: 'Fundamental climate science concepts',
    topics: ['greenhouse effect', 'carbon cycle', 'weather vs climate', 'global warming'],
    ageGroups: ['child', 'teen', 'adult']
  },
  'renewable-energy': {
    name: 'Renewable Energy',
    description: 'Clean energy sources and technologies',
    topics: ['solar power', 'wind energy', 'hydropower', 'geothermal', 'energy storage'],
    ageGroups: ['teen', 'adult']
  },
  'sustainability': {
    name: 'Sustainability',
    description: 'Sustainable living and practices',
    topics: ['reduce reuse recycle', 'sustainable transportation', 'eco-friendly habits', 'circular economy'],
    ageGroups: ['child', 'teen', 'adult']
  },
  'climate-impact': {
    name: 'Climate Impact',
    description: 'Effects of climate change on ecosystems and society',
    topics: ['sea level rise', 'extreme weather', 'biodiversity loss', 'agriculture impact'],
    ageGroups: ['teen', 'adult']
  },
  'climate-solutions': {
    name: 'Climate Solutions',
    description: 'Actions and technologies to address climate change',
    topics: ['carbon capture', 'reforestation', 'policy solutions', 'individual actions'],
    ageGroups: ['teen', 'adult']
  },
  'eco-lifestyle': {
    name: 'Eco-Friendly Lifestyle',
    description: 'Practical tips for sustainable living',
    topics: ['green home', 'sustainable fashion', 'eco-diet', 'zero waste'],
    ageGroups: ['child', 'teen', 'adult']
  }
};

// Request/Response schemas
const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
  timestamp: z.union([z.date(), z.string()]).optional()
});

const AssistantRequestSchema = z.object({
  message: z.string(),
  category: z.enum(['climate-basics', 'renewable-energy', 'sustainability', 'climate-impact', 'climate-solutions', 'eco-lifestyle', 'general']).optional(),
  context: z.object({
    ageGroup: z.enum(['child', 'teen', 'adult']).optional(),
    knowledgeLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    learningStyle: z.enum(['visual', 'auditory', 'reading', 'kinesthetic']).optional()
  }).optional(),
  conversationHistory: z.array(ChatMessageSchema).optional()
});

const ResponseSchema = z.object({
  message: z.string(),
  category: z.string(),
  confidence: z.number(),
  followUpQuestions: z.array(z.string()),
  relatedTopics: z.array(z.string()),
  resourceRecommendations: z.array(z.object({
    title: z.string(),
    type: z.enum(['article', 'video', 'quiz', 'interactive']),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    estimatedDuration: z.number()
  }))
});

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request
    const body = await request.json();
    const validatedRequest = AssistantRequestSchema.parse(body);
    const { message, category, context, conversationHistory = [] } = validatedRequest;

    // Connect to database and get user info
    await dbConnect();
    const user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Determine user context
    const userContext = {
      ageGroup: context?.ageGroup || user.ageGroup || 'adult',
      knowledgeLevel: context?.knowledgeLevel || 'beginner',
      learningStyle: context?.learningStyle || 'visual'
    };

    // Categorize the question if not provided
    const detectedCategory = category || await categorizeQuestion(message, userContext);
    
    // Get relevant content for context
    const relevantContent = await getRelevantContent(detectedCategory, userContext);
    
    // Generate AI response
    const aiResponse = await generateClimateResponse(
      message,
      detectedCategory,
      userContext,
      conversationHistory,
      relevantContent
    );

    // Log interaction for learning analytics
    await logInteraction(userId, {
      question: message,
      category: detectedCategory,
      userContext,
      response: aiResponse
    });

    return NextResponse.json({
      success: true,
      response: aiResponse,
      userContext,
      category: detectedCategory
    });

  } catch (error) {
    console.error('AI Assistant Error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request format', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Retrieve available categories and topics
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const ageGroup = searchParams.get('ageGroup') as 'child' | 'teen' | 'adult' || 'adult';

    // Filter categories by age group
    const availableCategories = Object.entries(CLIMATE_CATEGORIES)
      .filter(([_, categoryInfo]) => categoryInfo.ageGroups.includes(ageGroup))
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, typeof CLIMATE_CATEGORIES[keyof typeof CLIMATE_CATEGORIES]>);

    return NextResponse.json({
      categories: availableCategories,
      suggestedQuestions: getSuggestedQuestions(ageGroup)
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper Functions

async function categorizeQuestion(question: string, userContext: any): Promise<string> {
  try {
    const { text } = await generateText({
      model: groq('llama-3.1-8b-instant'),
      prompt: `Categorize this climate education question into exactly one of these categories. Respond with only the category name:
      
      Categories:
      - climate-basics (fundamental climate science)
      - renewable-energy (clean energy technologies)
      - sustainability (sustainable practices and living)
      - climate-impact (effects of climate change)
      - climate-solutions (actions to address climate change)
      - eco-lifestyle (practical eco-friendly tips)
      - general (doesn't fit specific categories)
      
      Question: "${question}"
      User: ${userContext.ageGroup}, ${userContext.knowledgeLevel} level
      
      Category:`
    });

    const category = text.trim().toLowerCase();
    const validCategories = ['climate-basics', 'renewable-energy', 'sustainability', 'climate-impact', 'climate-solutions', 'eco-lifestyle', 'general'];
    
    return validCategories.includes(category) ? category : 'general';
  } catch (error) {
    console.error('Error categorizing question:', error);
    return 'general';
  }
}

async function getRelevantContent(category: string, userContext: any) {
  try {
    const categoryInfo = CLIMATE_CATEGORIES[category as keyof typeof CLIMATE_CATEGORIES];
    if (!categoryInfo) return [];

    const content = await Content.find({
      $or: [
        { tags: { $in: categoryInfo.topics } },
        { category: category }
      ],
      ageGroup: { $in: [userContext.ageGroup, 'all'] },
      difficulty: userContext.knowledgeLevel
    }).limit(5);

    return content.map(item => ({
      title: item.title,
      description: item.description,
      type: item.type || 'article',
      difficulty: item.difficulty || 'beginner',
      tags: item.tags || []
    }));
  } catch (error) {
    console.error('Error fetching relevant content:', error);
    return [];
  }
}

async function generateClimateResponse(
  question: string,
  category: string,
  userContext: any,
  conversationHistory: any[],
  relevantContent: any[]
) {
  const categoryInfo = CLIMATE_CATEGORIES[category as keyof typeof CLIMATE_CATEGORIES];
  const ageAppropriate = getAgeAppropriateLanguage(userContext.ageGroup);
  
  // Build conversation context
  const conversationContext = conversationHistory
    .slice(-6) // Last 6 messages for context
    .map(msg => `${msg.role}: ${msg.content}`)
    .join('\n');

  const contentContext = relevantContent.length > 0 
    ? `\n\nRelevant educational content:\n${relevantContent.map(c => `- ${c.title}: ${c.description}`).join('\n')}`
    : '';

  try {
    const { text: responseText } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      prompt: `You are Ecosia AI Assistant, a helpful climate education expert for ${userContext.ageGroup}s.
      
      User Profile:
      - Age Group: ${userContext.ageGroup}
      - Knowledge Level: ${userContext.knowledgeLevel}
      - Learning Style: ${userContext.learningStyle}
      
      Question Category: ${categoryInfo?.name || category}
      Category Focus: ${categoryInfo?.description || 'General climate topics'}
      
      ${ageAppropriate.instructions}
      
      Recent Conversation:
      ${conversationContext}
      
      Current Question: "${question}"
      ${contentContext}
      
      Provide a comprehensive, engaging response that:
      1. Directly answers the question in ${ageAppropriate.language}
      2. Includes practical examples relevant to ${userContext.ageGroup}s
      3. Suggests 2-3 follow-up questions to encourage learning
      4. Recommends related topics for deeper exploration
      5. Suggests educational resources (articles, videos, quizzes)
      
      Keep the tone ${ageAppropriate.tone} and ensure scientific accuracy.
      
      Format your response as a helpful, conversational answer.`
    });

    // Create structured response from text
    const response = {
      message: responseText,
      category,
      confidence: 0.8,
      followUpQuestions: generateFollowUpQuestions(category, userContext.ageGroup),
      relatedTopics: categoryInfo?.topics.slice(0, 3) || [],
      resourceRecommendations: generateResourceRecommendations(category, userContext.knowledgeLevel)
    };

    return response;
  } catch (error) {
    console.error('Error generating AI response:', error);
    
    // Fallback response
    return {
      message: `I understand you're asking about ${category.replace('-', ' ')}. This is an important climate topic! Let me help you learn more about it. Could you be more specific about what aspect you'd like to understand better?`,
      category,
      confidence: 0.7,
      followUpQuestions: [
        `What specific aspect of ${category.replace('-', ' ')} interests you most?`,
        'Would you like to know how this relates to your daily life?',
        'Are you looking for ways to take action on this topic?'
      ],
      relatedTopics: categoryInfo?.topics || [],
      resourceRecommendations: []
    };
  }
}

function getAgeAppropriateLanguage(ageGroup: string) {
  switch (ageGroup) {
    case 'child':
      return {
        language: 'simple, clear language with fun examples',
        tone: 'friendly, encouraging, and playful',
        instructions: 'Use simple vocabulary, short sentences, and relatable examples from nature and daily life. Make it fun and engaging without being scary.'
      };
    case 'teen':
      return {
        language: 'conversational but informative language with real-world examples',
        tone: 'engaging, empowering, and solution-focused',
        instructions: 'Use clear explanations with current examples, social media references when appropriate, and emphasize how they can make a difference.'
      };
    case 'adult':
      return {
        language: 'comprehensive, detailed explanations with scientific backing',
        tone: 'professional, informative, and action-oriented',
        instructions: 'Provide thorough explanations with data, research citations when relevant, and practical implementation strategies.'
      };
    default:
      return {
        language: 'clear, accessible language',
        tone: 'helpful and informative',
        instructions: 'Provide accurate, helpful information appropriate for the user.'
      };
  }
}

function getSuggestedQuestions(ageGroup: string): string[] {
  const questions = {
    child: [
      'What is the greenhouse effect?',
      'Why do polar bears need ice?',
      'How can I help the Earth at home?',
      'What makes energy clean or dirty?',
      'Why is recycling important?'
    ],
    teen: [
      'How do renewable energy sources work?',
      'What can teenagers do to fight climate change?',
      'How does fast fashion impact the environment?',
      'What are the biggest causes of climate change?',
      'How will climate change affect my future?'
    ],
    adult: [
      'What are the most effective climate solutions?',
      'How can I make my home more energy efficient?',
      'What investment opportunities exist in clean energy?',
      'How do carbon offset programs work?',
      'What policy changes would have the biggest impact?'
    ]
  };

  return questions[ageGroup as keyof typeof questions] || questions.adult;
}

function generateFollowUpQuestions(category: string, ageGroup: string): string[] {
  const questionSets: Record<string, Record<string, string[]>> = {
    'climate-basics': {
      child: ['How do clouds help cool the Earth?', 'What animals are affected by climate change?'],
      teen: ['How do we measure global temperature?', "What's the difference between weather and climate?"],
      adult: ['How do climate feedback loops work?', 'What are the main greenhouse gases?']
    },
    'renewable-energy': {
      child: ['How do wind turbines make electricity?', 'Can we use sunshine to power our house?'],
      teen: ['What are the costs of renewable vs fossil fuel energy?', 'How do we store renewable energy?'],
      adult: ['What are the economic benefits of renewable energy transition?', 'How can communities implement renewable energy projects?']
    },
    'sustainability': {
      child: ['What can I do to help the Earth today?', 'Why is it important to turn off lights?'],
      teen: ['How can schools become more sustainable?', "What's the impact of fast fashion?"],
      adult: ['How can businesses implement sustainable practices?', 'What are the most effective personal sustainability actions?']
    }
  };
  
  const defaultQuestions = [
    'Can you tell me more about this topic?',
    'How does this affect me personally?',
    'What actions can I take?'
  ];
  
  return questionSets[category]?.[ageGroup] || defaultQuestions;
}

function generateResourceRecommendations(category: string, knowledgeLevel: string) {
  const resources = {
    'climate-basics': [
      { title: 'Climate Science Basics', type: 'article' as const, difficulty: 'beginner' as const, estimatedDuration: 15 },
      { title: 'Understanding Greenhouse Effect', type: 'video' as const, difficulty: 'beginner' as const, estimatedDuration: 10 }
    ],
    'renewable-energy': [
      { title: 'Solar Energy Fundamentals', type: 'interactive' as const, difficulty: 'intermediate' as const, estimatedDuration: 25 },
      { title: 'Wind Power Quiz', type: 'quiz' as const, difficulty: 'beginner' as const, estimatedDuration: 12 }
    ],
    'sustainability': [
      { title: 'Sustainable Living Guide', type: 'article' as const, difficulty: 'beginner' as const, estimatedDuration: 20 },
      { title: 'Eco-Friendly Home Tour', type: 'video' as const, difficulty: 'intermediate' as const, estimatedDuration: 18 }
    ]
  };
  
  return resources[category as keyof typeof resources] || [];
}

async function logInteraction(userId: string, interactionData: any) {
  try {
    // This could be expanded to include detailed analytics
    console.log(`AI Interaction logged for user ${userId}:`, {
      category: interactionData.category,
      timestamp: new Date(),
      questionLength: interactionData.question.length,
      userContext: interactionData.userContext
    });
    
    // Could store in a separate Analytics collection
    // await Analytics.create({ userId, ...interactionData, timestamp: new Date() });
  } catch (error) {
    console.error('Error logging interaction:', error);
  }
}