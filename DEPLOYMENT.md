# Deployment Guide

This guide covers deploying the Ecosia PCCOE application to production.

## Prerequisites

- Completed local setup (see SETUP.md)
- GitHub account
- Production MongoDB Atlas cluster
- Production Clerk application

## Option 1: Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

### Step 1: Prepare Your Repository

1. Ensure all your code is committed and pushed to GitHub:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. Make sure `.env.local` is in `.gitignore` (it already is by default)

### Step 2: Create Production Accounts

#### MongoDB Atlas Production Setup
1. Create a new production cluster (can be free tier M0)
2. Configure Network Access (add 0.0.0.0/0 or Vercel's IP ranges)
3. Create a database user with read/write permissions
4. Get your production connection string

#### Clerk Production Setup
1. Go to your Clerk application
2. Switch to "Production" mode (top right)
3. Copy production API keys (different from test keys!)
4. Update your application domain in Clerk settings

### Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub

2. Click "Add New Project"

3. Import your `ecosia-pccoe` repository

4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next

5. Add Environment Variables:
   Click "Environment Variables" and add:
   
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxx
   CLERK_SECRET_KEY=sk_live_xxx
   CLERK_WEBHOOK_SECRET=whsec_xxx
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecosia-pccoe
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

6. Click "Deploy"

7. Wait for deployment to complete (usually 2-3 minutes)

### Step 4: Configure Clerk for Production

1. Go to Clerk Dashboard → Your Application → Production
2. Update "Home URL" to your Vercel URL: `https://your-app.vercel.app`
3. Add authorized domains: `your-app.vercel.app`
4. Update redirect URLs if needed

### Step 5: Set Up Clerk Webhooks

1. In Clerk Dashboard → Webhooks
2. Create a new endpoint
3. Endpoint URL: `https://your-app.vercel.app/api/webhook`
4. Subscribe to events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
5. Copy the signing secret and update `CLERK_WEBHOOK_SECRET` in Vercel

### Step 6: Test Your Deployment

1. Visit your Vercel URL
2. Sign up for a new account
3. Complete onboarding
4. Test dashboard and content pages
5. Check Vercel logs for any errors

## Option 2: Deploy to Other Platforms

### Deploy to Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build your application:
```bash
npm run build
```

3. Deploy:
```bash
netlify deploy --prod
```

4. Set environment variables in Netlify dashboard

### Deploy to Railway

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login and initialize:
```bash
railway login
railway init
```

3. Add environment variables:
```bash
railway variables set MONGODB_URI=your-uri
railway variables set CLERK_SECRET_KEY=your-key
# ... add all other variables
```

4. Deploy:
```bash
railway up
```

### Deploy to Docker/Kubernetes

1. Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

2. Update `next.config.ts` to enable standalone output:
```typescript
const config = {
  output: 'standalone',
  // ... other config
};
```

3. Build and run:
```bash
docker build -t ecosia-pccoe .
docker run -p 3000:3000 --env-file .env.local ecosia-pccoe
```

## Post-Deployment Checklist

- [ ] Test user registration and authentication
- [ ] Verify onboarding flow works
- [ ] Check dashboard loads correctly
- [ ] Test content browsing and filtering
- [ ] Verify API endpoints are working
- [ ] Check database connections
- [ ] Confirm webhooks are receiving events
- [ ] Test on mobile devices
- [ ] Verify all environment variables are set
- [ ] Check application logs for errors
- [ ] Set up monitoring (optional)
- [ ] Configure custom domain (optional)

## Monitoring and Maintenance

### Vercel Monitoring

Vercel provides built-in monitoring:
- View deployment logs in Vercel dashboard
- Check function logs for API routes
- Monitor performance metrics
- Set up deployment notifications

### Error Tracking (Optional)

Consider adding error tracking with:
- [Sentry](https://sentry.io)
- [LogRocket](https://logrocket.com)
- [Datadog](https://www.datadoghq.com)

### Database Monitoring

Monitor your MongoDB Atlas cluster:
- Set up alerts for high CPU/memory usage
- Monitor connection counts
- Track slow queries
- Set up automated backups

## Continuous Deployment

### Automatic Deployments with Vercel

Vercel automatically deploys when you push to GitHub:

1. Push to `main` branch → Production deployment
2. Push to other branches → Preview deployment
3. Pull requests → Preview deployment with unique URL

### Deployment Branches

Consider this branching strategy:
- `main` → Production (protected)
- `staging` → Staging environment
- `dev` → Development environment
- Feature branches → Preview deployments

## Rollback Strategy

If something goes wrong:

### Vercel Rollback
1. Go to Vercel dashboard
2. Find your project
3. Click "Deployments"
4. Find the last working deployment
5. Click "..." → "Promote to Production"

### Manual Rollback
1. Revert your Git commit:
```bash
git revert HEAD
git push origin main
```

2. Vercel will automatically deploy the reverted version

## Environment-Specific Configuration

### Production Optimizations

1. Enable Next.js optimizations in `next.config.ts`:
```typescript
const config = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  // ... other config
};
```

2. Use production MongoDB indexes
3. Enable CDN caching for static assets
4. Configure rate limiting on API routes

### Security Best Practices

1. Never commit `.env.local` or `.env.production`
2. Use environment variables for all secrets
3. Enable CSRF protection
4. Set up CORS if needed
5. Use HTTPS only (Vercel does this by default)
6. Implement rate limiting on public endpoints
7. Validate all user inputs
8. Keep dependencies updated

## Custom Domain Setup (Vercel)

1. Go to your Vercel project settings
2. Click "Domains"
3. Add your custom domain (e.g., `ecosia-pccoe.com`)
4. Follow DNS configuration instructions
5. Update Clerk settings with new domain
6. Update `NEXT_PUBLIC_APP_URL` environment variable

## Troubleshooting Production Issues

### Build Failures
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Verify TypeScript types are correct
- Check for missing environment variables

### Runtime Errors
- Check Vercel function logs
- Verify database connection
- Check Clerk configuration
- Verify all API endpoints return correct responses

### Performance Issues
- Enable Next.js caching
- Optimize images with next/image
- Use MongoDB indexes
- Monitor database query performance
- Consider implementing Redis caching

## Scaling Considerations

As your application grows:

1. **Database Scaling**
   - Upgrade MongoDB Atlas tier
   - Add read replicas
   - Implement connection pooling

2. **Application Scaling**
   - Vercel automatically scales
   - Consider edge functions for better performance
   - Implement caching strategies

3. **CDN Configuration**
   - Use Vercel Edge Network
   - Cache static assets
   - Optimize images

## Support

For deployment help:
- Vercel Documentation: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Clerk Production Setup: https://clerk.com/docs/deployments/overview

## Cost Estimation

### Free Tier Limits
- **Vercel**: 100GB bandwidth, unlimited hobby projects
- **MongoDB Atlas**: 512MB storage (M0 cluster)
- **Clerk**: 10,000 monthly active users

### Upgrade Considerations
Monitor your usage and upgrade when you exceed free tier limits.
