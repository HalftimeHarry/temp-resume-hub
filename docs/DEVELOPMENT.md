# Development Guide

## Quick Start

```bash
# Frontend Development
cd app
npm install
npm run dev

# Backend Development  
cd backend
./pocketbase serve
```

## Project Structure

```
temp-resume-hub/
├── app/                    # SvelteKit frontend
│   ├── src/
│   │   ├── lib/           # Shared components & utilities
│   │   ├── routes/        # Page routes
│   │   └── stores/        # Svelte stores
├── backend/               # PocketBase backend
│   ├── pb_data/          # Database files
│   └── pb_migrations/    # Database migrations
└── docs/                 # Documentation
```

## Development Workflow

### Frontend (SvelteKit)
- **Dev Server**: `npm run dev` (usually port 5173)
- **Build**: `npm run build`
- **Preview**: `npm run preview`
- **Type Check**: `npm run check`

### Backend (PocketBase)
- **Start**: `./pocketbase serve` (port 8090)
- **Admin UI**: http://localhost:8090/_/
- **API**: http://localhost:8090/api/

### Key Features
- **Resume Builder**: Multi-step form with live preview
- **Templates**: Dynamic resume templates with customization
- **User Profiles**: Personal information and preferences
- **Authentication**: PocketBase auth with social login
- **File Upload**: Profile images and resume exports

## Environment Setup

### Required Environment Variables
```bash
# app/.env
PUBLIC_POCKETBASE_URL=http://localhost:8090
```

### Database Collections
- `users` - User authentication
- `user_profiles` - Extended user information
- `user_settings` - User preferences
- `resumes` - Resume data
- `templates` - Resume templates

## Common Development Tasks

### Adding New Components
```bash
# Create component
touch app/src/lib/components/MyComponent.svelte

# Add to index if needed
echo "export { default as MyComponent } from './MyComponent.svelte';" >> app/src/lib/components/index.js
```

### Database Migrations
```bash
# Create migration
cd backend
./pocketbase migrate create "migration_name"

# Apply migrations
./pocketbase migrate up
```

### Debugging
- **Frontend**: Browser DevTools + Svelte DevTools
- **Backend**: PocketBase logs in terminal
- **Database**: PocketBase Admin UI

## Troubleshooting

### Common Issues
1. **Port conflicts**: Change ports in vite.config.js or PocketBase flags
2. **CORS errors**: Check PocketBase settings in Admin UI
3. **Build errors**: Clear `.svelte-kit` and `node_modules/.vite`
4. **Database issues**: Check PocketBase logs and collection schemas

### Reset Development Environment
```bash
# Frontend
cd app
rm -rf .svelte-kit node_modules/.vite
npm install

# Backend (⚠️ This deletes all data)
cd backend
rm -rf pb_data
./pocketbase serve
```