
# Ecosia PCCOE

Hackathon project for an educational platform with age-appropriate content.

## Features

✅ **Setup & Foundation**
- Next.js 15 with TypeScript
- Tailwind CSS + Shadcn UI components
- MongoDB Atlas integration
- Clerk Authentication
- Environment variables configuration

✅ **Core Backend**
- MongoDB schemas (User, Content)
- Auth middleware with Clerk
- RESTful API endpoints for CRUD operations
- Database connection utility

✅ **Frontend**
- Authentication pages (Sign In/Sign Up)
- Age selection onboarding flow
- Dashboard with user stats
- Content browsing and filtering
- Responsive navigation system

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account
- Clerk account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/heyy-kartik/ecosia-pccoe.git
cd ecosia-pccoe
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in your credentials:
     - Get Clerk keys from [Clerk Dashboard](https://dashboard.clerk.com)
     - Get MongoDB URI from [MongoDB Atlas](https://cloud.mongodb.com)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── content/        # Content CRUD endpoints
│   │   ├── users/          # User management endpoints
│   │   └── webhook/        # Clerk webhooks
│   ├── sign-in/            # Sign in page
│   ├── sign-up/            # Sign up page
│   ├── onboarding/         # Age selection onboarding
│   ├── dashboard/          # User dashboard
│   ├── content/            # Content browsing
│   └── layout.tsx          # Root layout with Clerk
├── components/
│   ├── ui/                 # Shadcn UI components
│   └── Navigation.tsx      # Main navigation
├── lib/
│   ├── mongodb.ts          # Database connection
│   └── utils.ts            # Utility functions
└── models/
    ├── User.ts             # User schema
    └── Content.ts          # Content schema
```

## API Endpoints

### Content
- `GET /api/content` - Get all content (with filters)
- `POST /api/content` - Create new content (authenticated)
- `GET /api/content/[id]` - Get single content
- `PUT /api/content/[id]` - Update content (author only)
- `DELETE /api/content/[id]` - Delete content (author only)

### Users
- `GET /api/users` - Get current user profile
- `PUT /api/users` - Update user profile

### Webhooks
- `POST /api/webhook` - Clerk user sync webhook

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI
- **Authentication:** Clerk
- **Database:** MongoDB with Mongoose
- **Deployment:** Vercel-ready

## Environment Variables

See `.env.example` for required environment variables.

## License

MIT
=======


=======
# ecosia-pccoe
Hackathon Repo for Ecosia 
