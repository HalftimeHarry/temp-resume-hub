# 🛠️ **Development Guide**

Complete development setup and API documentation for Digital Resume Hub.

## 🚀 **Quick Setup**

### **Prerequisites**
- Node.js 18+ and npm
- Git
- Code editor (VS Code recommended)

### **1. Clone & Install**
```bash
git clone https://github.com/HalftimeHarry/temp-resume-hub.git
cd temp-resume-hub

# Install frontend dependencies
cd app
npm install
```

### **2. Environment Setup**
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your settings
PUBLIC_POCKETBASE_URL=https://pocketbase-production-1493.up.railway.app
POCKETBASE_URL=https://pocketbase-production-1493.up.railway.app
```

### **3. Start Development**
```bash
# Start frontend development server
npm run dev

# Open browser
http://localhost:5173
```

## 📁 **Project Structure**

```
temp-resume-hub/
├── app/                           # SvelteKit Frontend
│   ├── src/
│   │   ├── lib/
│   │   │   ├── components/        # Reusable UI components
│   │   │   ├── config.ts          # App configuration
│   │   │   ├── pocketbase.ts      # PocketBase client
│   │   │   └── utils.ts           # Utility functions
│   │   ├── routes/
│   │   │   ├── +layout.svelte     # Root layout
│   │   │   ├── +page.svelte       # Home page
│   │   │   ├── auth/              # Authentication pages
│   │   │   ├── dashboard/         # User dashboard
│   │   │   └── resume/            # Resume pages
│   │   └── app.html               # HTML template
│   ├── static/                    # Static assets
│   ├── tests/                     # Frontend tests
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env
├── backend/                       # PocketBase Backend
│   ├── pb_hooks/                  # JavaScript hooks
│   │   ├── main.pb.js            # Main hooks file
│   │   └── admin_setup.pb.js     # Admin setup
│   ├── pb_migrations/             # Database migrations
│   │   └── initial_schema.js     # Initial schema
│   └── .env                       # Backend environment
├── .github/workflows/             # CI/CD pipelines
├── Dockerfile                     # Railway deployment
├── railway.json                   # Railway configuration
└── README.md
```

## 🔧 **Development Scripts**

### **Frontend (app/)**
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test
npm run test:watch
npm run test:coverage

# Linting and formatting
npm run lint
npm run format

# Type checking
npm run check
npm run check:watch
```

### **Backend (Railway)**
```bash
# Deploy to Railway
railway up --service pocketbase-production-1493 --detach

# View logs
railway logs --service pocketbase-production-1493

# Check status
railway status
```

## 📚 **API Documentation**

### **Base URL**
```
Production: https://pocketbase-production-1493.up.railway.app
Development: Uses production API
```

### **Authentication**

#### **Login**
```bash
POST /api/collections/users/auth-with-password
Content-Type: application/json

{
  "identity": "user@example.com",
  "password": "password123"
}

# Response
{
  "token": "jwt_token_here",
  "record": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

#### **Register**
```bash
POST /api/collections/users/records
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "passwordConfirm": "password123",
  "name": "User Name"
}
```

#### **Refresh Token**
```bash
POST /api/collections/users/auth-refresh
Authorization: Bearer <jwt_token>
```

### **Resumes**

#### **Get User Resumes**
```bash
GET /api/collections/resumes/records?filter=(user='USER_ID')
Authorization: Bearer <jwt_token>

# Response
{
  "page": 1,
  "perPage": 30,
  "totalItems": 5,
  "items": [
    {
      "id": "resume_id",
      "title": "Software Developer Resume",
      "content": {...},
      "user": "user_id",
      "created": "2024-01-01T00:00:00Z",
      "updated": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### **Create Resume**
```bash
POST /api/collections/resumes/records
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "My Resume",
  "content": {
    "personalInfo": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890"
    },
    "experience": [...],
    "education": [...],
    "skills": [...]
  },
  "user": "user_id"
}
```

#### **Update Resume**
```bash
PATCH /api/collections/resumes/records/RESUME_ID
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Updated Resume Title",
  "content": {...}
}
```

#### **Delete Resume**
```bash
DELETE /api/collections/resumes/records/RESUME_ID
Authorization: Bearer <jwt_token>
```

### **Health Check**
```bash
GET /api/health

# Response
{
  "message": "API is healthy.",
  "code": 200,
  "data": {}
}
```

## 🧪 **Testing**

### **Frontend Testing**
```bash
# Unit tests
npm run test

# Component tests
npm run test:component

# Integration tests
npm run test:integration

# E2E tests (planned)
npm run test:e2e
```

### **API Testing**
```bash
# Health check
curl https://pocketbase-production-1493.up.railway.app/api/health

# Test authentication
curl -X POST https://pocketbase-production-1493.up.railway.app/api/collections/users/auth-with-password \
  -H "Content-Type: application/json" \
  -d '{"identity":"test@example.com","password":"password123"}'
```

## 🎨 **UI Components**

### **shadcn-svelte Components**
```typescript
// Button component
import { Button } from "$lib/components/ui/button";

// Card component
import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";

// Input component
import { Input } from "$lib/components/ui/input";

// Usage in Svelte
<Button variant="default" size="lg">Click me</Button>
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
</Card>
```

### **Custom Components**
```typescript
// Resume builder components
import ResumeEditor from "$lib/components/ResumeEditor.svelte";
import ResumePreview from "$lib/components/ResumePreview.svelte";
import TemplateSelector from "$lib/components/TemplateSelector.svelte";

// Layout components
import Header from "$lib/components/Header.svelte";
import Footer from "$lib/components/Footer.svelte";
import Sidebar from "$lib/components/Sidebar.svelte";
```

## 🔧 **Configuration**

### **Vite Configuration**
```javascript
// vite.config.js
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    environment: 'happy-dom'
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  }
});
```

### **TailwindCSS Configuration**
```javascript
// tailwind.config.js
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {...},
        secondary: {...}
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
};
```

### **TypeScript Configuration**
```json
// tsconfig.json
{
  "extends": "./.svelte-kit/tsconfig.json",
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "strict": true,
    "moduleResolution": "bundler"
  }
}
```

## 🐛 **Debugging**

### **Frontend Debugging**
```bash
# Enable debug mode
DEBUG=true npm run dev

# Browser DevTools
# - Network tab for API calls
# - Console for JavaScript errors
# - Svelte DevTools extension

# VS Code debugging
# - Set breakpoints in .svelte files
# - Use browser debugger
```

### **Backend Debugging**
```bash
# Railway logs
railway logs --service pocketbase-production-1493 --tail

# PocketBase admin panel
https://pocketbase-production-1493.up.railway.app/_/

# API testing with curl
curl -v https://pocketbase-production-1493.up.railway.app/api/health
```

## 🔄 **Development Workflow**

### **Feature Development**
```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes
# Edit files, add tests

# 3. Test locally
npm run test
npm run build

# 4. Commit changes
git add .
git commit -m "feat: add new feature"

# 5. Push and create PR
git push origin feature/new-feature
```

### **Code Quality**
```bash
# Linting
npm run lint

# Formatting
npm run format

# Type checking
npm run check

# Pre-commit hooks (planned)
npm run pre-commit
```

## 🚨 **Common Issues**

### **CORS Errors**
```bash
# Check PocketBase CORS settings
# Verify environment variables
# Ensure correct API URL
```

### **Build Failures**
```bash
# Clear node_modules
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run check

# Verify environment variables
```

### **Authentication Issues**
```bash
# Check JWT token expiration
# Verify PocketBase user exists
# Test API endpoints directly
```

## 📊 **Performance**

### **Frontend Optimization**
- **Code Splitting**: Automatic with SvelteKit
- **Image Optimization**: Use `@sveltejs/enhanced-img`
- **Bundle Analysis**: `npm run build -- --analyze`
- **Lighthouse**: Test performance scores

### **Backend Optimization**
- **Database Indexing**: PocketBase auto-indexes
- **Caching**: Browser and CDN caching
- **Compression**: Gzip enabled on Railway

## 🎯 **Development Roadmap**

### **Phase 1: Core Features**
- [ ] User authentication
- [ ] Resume CRUD operations
- [ ] Basic templates
- [ ] PDF export

### **Phase 2: Enhanced Features**
- [ ] Advanced templates
- [ ] Real-time collaboration
- [ ] Social sharing
- [ ] Analytics dashboard

### **Phase 3: Advanced Features**
- [ ] AI-powered suggestions
- [ ] Multi-language support
- [ ] Mobile app
- [ ] Enterprise features

---

**Happy coding! 🚀**