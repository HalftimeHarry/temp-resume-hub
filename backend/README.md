# Resume Hub - PocketBase Backend

This directory contains the PocketBase backend configuration for Resume Hub.

## Railway Deployment

1. **Create a new Railway project**:
   - Go to [Railway](https://railway.app)
   - Create a new project
   - Connect your GitHub repository
   - Select this `backend` directory as the root

2. **Environment Variables**:
   Set these in Railway dashboard:
   ```
   PORT=8080
   ```

3. **Domain Configuration**:
   - Add your custom domain in Railway dashboard
   - Point digitalresumehub.com subdomain to Railway

## Local Development

1. **Download PocketBase**:
   ```bash
   cd backend
   wget https://github.com/pocketbase/pocketbase/releases/download/v0.22.21/pocketbase_0.22.21_linux_amd64.zip
   unzip pocketbase_0.22.21_linux_amd64.zip
   ```

2. **Run locally**:
   ```bash
   ./pocketbase serve --http=0.0.0.0:8080
   ```

3. **Admin UI**: Visit `http://localhost:8080/_/` to set up admin account

## Database Schema

- **users**: Extended auth collection with name and avatar
- **resumes**: User resumes with JSON content, templates, and public sharing

## API Endpoints

- `GET /api/health` - Health check
- `/api/collections/users/*` - User management
- `/api/collections/resumes/*` - Resume CRUD operations
- `/_/` - Admin dashboard

## Features

- ✅ User authentication (email/password + OAuth)
- ✅ Resume storage with JSON content
- ✅ Public resume sharing via slugs
- ✅ File uploads for avatars
- ✅ CORS configured for frontend
- ✅ Database migrations
- ✅ Custom hooks for API extensions