import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import Content from '@/models/Content';

// GET /api/content/[id] - Get single content by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const content = await Content.findById(id);

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    // Increment views
    await Content.findByIdAndUpdate(id, { $inc: { views: 1 } });

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

// PUT /api/content/[id] - Update content
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const { id } = await params;

    const content = await Content.findById(id);

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    // Check if user is the author
    if (content.authorId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updatedContent = await Content.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}

// DELETE /api/content/[id] - Delete content
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const { id } = await params;

    const content = await Content.findById(id);

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    // Check if user is the author
    if (content.authorId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    await Content.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json(
      { error: 'Failed to delete content' },
      { status: 500 }
    );
  }
}
