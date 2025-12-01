import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import Content from '@/models/Content';

// Sample climate education content
const SAMPLE_CONTENT = [
  {
    title: "Understanding the Greenhouse Effect",
    description: "Learn how greenhouse gases trap heat in Earth's atmosphere and cause global warming",
    content: "The greenhouse effect is a natural process where certain gases in Earth's atmosphere trap heat from the sun, warming our planet. However, human activities have increased greenhouse gas concentrations, enhancing this effect and causing climate change.",
    type: "article",
    difficulty: "beginner",
    ageGroup: "all",
    estimatedDuration: 15,
    category: "climate-basics",
    tags: ["greenhouse effect", "global warming", "atmosphere", "climate science"],
    prerequisites: [],
    nextSteps: ["carbon-cycle-basics", "renewable-energy-intro"]
  },
  {
    title: "Solar Power: How It Works",
    description: "Discover how solar panels convert sunlight into clean electricity",
    content: "Solar power harnesses energy from the sun using photovoltaic cells that convert sunlight directly into electricity. This renewable energy source produces no greenhouse gas emissions during operation.",
    type: "video",
    difficulty: "beginner",
    ageGroup: "teen",
    estimatedDuration: 20,
    category: "renewable-energy",
    tags: ["solar power", "renewable energy", "photovoltaic", "clean electricity"],
    prerequisites: ["energy-basics"],
    nextSteps: ["wind-energy", "energy-storage"]
  },
  {
    title: "Reduce, Reuse, Recycle in Daily Life",
    description: "Practical tips for implementing the 3 R's in your everyday routine",
    content: "The three R's - Reduce, Reuse, Recycle - are simple principles that can significantly decrease your environmental impact. Start by reducing consumption, finding creative ways to reuse items, and properly recycling materials.",
    type: "interactive",
    difficulty: "beginner",
    ageGroup: "all",
    estimatedDuration: 25,
    category: "sustainability",
    tags: ["reduce", "reuse", "recycle", "waste reduction", "sustainability"],
    prerequisites: [],
    nextSteps: ["zero-waste-lifestyle", "circular-economy"]
  },
  {
    title: "Climate Change Impact on Biodiversity",
    description: "Explore how changing climate affects plants and animals worldwide",
    content: "Climate change affects biodiversity through habitat loss, changing migration patterns, and ecosystem disruption. Rising temperatures and altered precipitation patterns threaten species survival and ecosystem balance.",
    type: "article",
    difficulty: "intermediate",
    ageGroup: "teen",
    estimatedDuration: 30,
    category: "climate-impact",
    tags: ["biodiversity", "ecosystem", "habitat loss", "species extinction"],
    prerequisites: ["climate-basics"],
    nextSteps: ["conservation-strategies", "ecosystem-restoration"]
  },
  {
    title: "Carbon Capture and Storage",
    description: "Learn about technologies that remove CO2 from the atmosphere",
    content: "Carbon capture and storage (CCS) technologies capture CO2 emissions from industrial sources or directly from the air, then store or utilize this carbon to prevent its release into the atmosphere.",
    type: "article",
    difficulty: "advanced",
    ageGroup: "adult",
    estimatedDuration: 40,
    category: "climate-solutions",
    tags: ["carbon capture", "CCS", "carbon storage", "climate technology"],
    prerequisites: ["greenhouse-effect", "industrial-emissions"],
    nextSteps: ["direct-air-capture", "carbon-utilization"]
  },
  {
    title: "Creating a Sustainable Home",
    description: "Transform your living space into an eco-friendly environment",
    content: "Making your home sustainable involves energy efficiency, water conservation, sustainable materials, and waste reduction. Small changes like LED lighting, efficient appliances, and proper insulation make big differences.",
    type: "quiz",
    difficulty: "intermediate",
    ageGroup: "adult",
    estimatedDuration: 35,
    category: "eco-lifestyle",
    tags: ["sustainable home", "energy efficiency", "green living", "eco-friendly"],
    prerequisites: ["energy-basics", "sustainability-principles"],
    nextSteps: ["renewable-energy-home", "smart-home-technology"]
  }
];

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Check if content already exists
    const existingContent = await Content.findOne({ title: SAMPLE_CONTENT[0].title });
    if (existingContent) {
      return NextResponse.json({ message: 'Sample content already exists' });
    }

    // Create sample content
    const createdContent = await Content.insertMany(SAMPLE_CONTENT);

    return NextResponse.json({
      success: true,
      message: `Created ${createdContent.length} sample content items`,
      content: createdContent
    });

  } catch (error) {
    console.error('Error creating sample content:', error);
    return NextResponse.json(
      { error: 'Failed to create sample content' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const content = await Content.find({}).limit(10);

    return NextResponse.json({
      success: true,
      count: content.length,
      content
    });

  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}