# Ecosia PCCOE - Setup Guide

This guide will help you set up and run the Ecosia PCCOE educational platform locally.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18.x or higher
- **npm** 9.x or higher
- A **MongoDB Atlas** account (free tier is sufficient)
- A **Clerk** account (free tier is sufficient)

## Step 1: Clone the Repository

```bash
git clone https://github.com/heyy-kartik/ecosia-pccoe.git
cd ecosia-pccoe
```

## Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 15
- React 19
- Clerk for authentication
- Mongoose for MongoDB
- Tailwind CSS
- Shadcn UI components

## Step 3: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Sign in or create a free account
3. Create a new cluster (free tier M0 is sufficient)
4. Click "Connect" and choose "Connect your application"
5. Copy the connection string (it will look like: `mongodb+srv://username:password@cluster.mongodb.net/`)
6. Replace `<password>` with your database user password
7. Add a database name at the end: `/ecosia-pccoe`

## Step 4: Set Up Clerk Authentication

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Sign in or create a free account
3. Create a new application
4. In the application settings:
   - Go to "API Keys" section
   - Copy the "Publishable Key" (starts with `pk_`)
   - Copy the "Secret Key" (starts with `sk_`)

### Configure Clerk Webhooks (Optional but Recommended)

1. In Clerk Dashboard, go to "Webhooks"
2. Create a new endpoint
3. Set the URL to: `https://your-domain.com/api/webhook` (use ngrok for local testing)
4. Subscribe to events: `user.created`, `user.updated`, `user.deleted`
5. Copy the "Signing Secret" (starts with `whsec_`)

## Step 5: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` and fill in your credentials:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
CLERK_SECRET_KEY=sk_test_YOUR_KEY_HERE
CLERK_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecosia-pccoe

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 6: Run the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Step 7: Test the Application

1. Open your browser and navigate to `http://localhost:3000`
2. Click "Sign Up" to create a new account
3. Complete the age selection onboarding
4. You'll be redirected to your dashboard!

## Features to Test

### User Authentication
- Sign up with email/password
- Sign in to existing account
- Sign out

### Age Selection Onboarding
- Choose from Child (5-12), Teen (13-17), or Adult (18+)
- This determines what content you see

### Dashboard
- View your profile information
- See stats about available content
- Browse recent content

### Content Browsing
- Filter content by category
- Paginate through content
- Content is automatically filtered by your age group

## API Endpoints

The application provides the following API endpoints:

### Content Management
- `GET /api/content` - List all content (with filters)
- `POST /api/content` - Create new content (authenticated)
- `GET /api/content/[id]` - Get single content item
- `PUT /api/content/[id]` - Update content (author only)
- `DELETE /api/content/[id]` - Delete content (author only)

### User Management
- `GET /api/users` - Get current user profile
- `PUT /api/users` - Update user profile (age group, onboarding status)

### Webhooks
- `POST /api/webhook` - Clerk webhook for user synchronization

## Project Structure

```
ecosia-pccoe/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── content/      # Content CRUD endpoints
│   │   │   ├── users/        # User management endpoints
│   │   │   └── webhook/      # Clerk webhook
│   │   ├── sign-in/          # Sign in page
│   │   ├── sign-up/          # Sign up page
│   │   ├── onboarding/       # Age selection onboarding
│   │   ├── dashboard/        # User dashboard
│   │   ├── content/          # Content browsing
│   │   ├── layout.tsx        # Root layout with Clerk provider
│   │   └── page.tsx          # Landing page
│   ├── components/
│   │   ├── ui/               # Shadcn UI components
│   │   └── Navigation.tsx    # Main navigation component
│   ├── lib/
│   │   ├── mongodb.ts        # Database connection utility
│   │   └── utils.ts          # Utility functions
│   ├── models/
│   │   ├── User.ts           # User MongoDB schema
│   │   └── Content.ts        # Content MongoDB schema
│   └── middleware.ts         # Clerk authentication middleware
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
├── package.json              # Project dependencies
└── README.md                 # Project documentation
```

## Database Schemas

### User Schema
```typescript
{
  clerkId: string (unique)
  email: string (unique)
  firstName?: string
  lastName?: string
  age?: number
  ageGroup?: 'child' | 'teen' | 'adult'
  onboardingCompleted: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Content Schema
```typescript
{
  title: string
  description: string
  content: string
  ageGroup: 'child' | 'teen' | 'adult'
  category: string
  tags: string[]
  authorId: string
  published: boolean
  views: number
  createdAt: Date
  updatedAt: Date
}
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure your IP address is whitelisted in MongoDB Atlas Network Access
- Check that your MongoDB URI is correctly formatted
- Verify your database user has read/write permissions

### Clerk Authentication Issues
- Make sure your Clerk keys are correctly copied (no extra spaces)
- Verify that your domain is added to Clerk's allowed domains
- Check that environment variables are properly loaded (restart dev server)

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Delete `.next` folder and rebuild: `rm -rf .next && npm run build`
- Check that all environment variables are set

## Production Deployment

### Deploying to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel project settings
5. Deploy!

Vercel will automatically:
- Install dependencies
- Build your Next.js application
- Deploy to a production URL

### Environment Variables for Production

Make sure to set all environment variables in your hosting platform:
- All Clerk keys (use production keys, not test keys)
- MongoDB URI (production cluster)
- Update webhook URLs to your production domain

## Adding Content

To add content to the platform, you can either:

1. **Use the API**: Make POST requests to `/api/content` with authentication
2. **Directly in MongoDB**: Use MongoDB Compass or Atlas to insert documents
3. **Create an admin panel**: Build your own content management interface (future enhancement)

Example content creation via API:
```bash
curl -X POST http://localhost:3000/api/content \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  -d '{
    "title": "Introduction to Science",
    "description": "Learn the basics of science",
    "content": "Science is the study of...",
    "ageGroup": "child",
    "category": "science",
    "tags": ["science", "basics", "education"]
  }'
```

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the console logs for error messages
3. Ensure all environment variables are correctly set
4. Create an issue on GitHub with detailed error information

## License

MIT License - See LICENSE file for details
