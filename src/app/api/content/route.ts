import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import Content from '@/models/Content';

// GET /api/content - Get all content (filtered by age group if user is logged in)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const ageGroup = searchParams.get('ageGroup');
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const query: Record<string, unknown> = { published: true };
    
    if (ageGroup) {
      query.ageGroup = ageGroup;
    }
    
    if (category) {
      query.category = category;
    }

    const skip = (page - 1) * limit;

    const [content, total] = await Promise.all([
      Content.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Content.countDocuments(query),
    ]);

    return NextResponse.json({
      content,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

// POST /api/content - Create new content (authenticated users only)
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

    const body = await request.json();
    const { title, description, content, ageGroup, category, tags } = body;

    if (!title || !description || !content || !ageGroup || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newContent = await Content.create({
      title,
      description,
      content,
      ageGroup,
      category,
      tags: tags || [],
      authorId: userId,
      published: false,
    });

    return NextResponse.json(newContent, { status: 201 });
  } catch (error) {
    console.error('Error creating content:', error);
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    );
  }
}
