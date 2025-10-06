import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// GET /api/users - Get current user profile
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    let user = await User.findOne({ clerkId: userId });

    // If user doesn't exist in DB, create from Clerk data
    if (!user) {
      const clerkUser = await currentUser();
      
      if (clerkUser) {
        user = await User.create({
          clerkId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
        });
      }
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PUT /api/users - Update user profile
export async function PUT(request: NextRequest) {
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
    const { age, ageGroup, onboardingCompleted } = body;

    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      {
        $set: {
          ...(age !== undefined && { age }),
          ...(ageGroup && { ageGroup }),
          ...(onboardingCompleted !== undefined && { onboardingCompleted }),
        },
      },
      { new: true, upsert: true }
    );

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
