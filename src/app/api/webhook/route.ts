import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

interface WebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses?: Array<{ email_address: string }>;
    first_name?: string;
    last_name?: string;
  };
}

export async function POST(request: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env');
  }

  // Get the headers
  const headerPayload = request.headers;
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: 'Missing svix headers' },
      { status: 400 }
    );
  }

  // Get the body
  const payload = await request.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === 'user.created') {
    await dbConnect();

    const { id, email_addresses, first_name, last_name } = evt.data;

    await User.create({
      clerkId: id,
      email: email_addresses?.[0]?.email_address || '',
      firstName: first_name,
      lastName: last_name,
    });
  }

  if (eventType === 'user.updated') {
    await dbConnect();

    const { id, email_addresses, first_name, last_name } = evt.data;

    await User.findOneAndUpdate(
      { clerkId: id },
      {
        $set: {
          email: email_addresses?.[0]?.email_address || '',
          firstName: first_name,
          lastName: last_name,
        },
      }
    );
  }

  if (eventType === 'user.deleted') {
    await dbConnect();

    const { id } = evt.data;

    await User.findOneAndDelete({ clerkId: id });
  }

  return NextResponse.json({ message: 'Webhook received' }, { status: 200 });
}
