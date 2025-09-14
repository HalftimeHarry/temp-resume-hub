# Digital Resume Hub

A modern, full-stack resume builder and sharing platform built with SvelteKit and PocketBase.

## 🌟 Features

- ✅ **Modern UI**: Built with SvelteKit, TailwindCSS, and shadcn-svelte
- ✅ **User Authentication**: Secure login/register with PocketBase
- ✅ **Resume Builder**: Create and edit resumes with rich content
- ✅ **Public Sharing**: Share resumes via custom URLs
- ✅ **Responsive Design**: Works on desktop and mobile
- ✅ **Real-time Updates**: Live preview and auto-save
- ✅ **Multiple Templates**: Various resume layouts
- ✅ **Export Options**: PDF and print-friendly formats

## 🏗️ Architecture

```
Frontend (SvelteKit)     Backend (PocketBase)
digitalresumehub.com  ←→  api.digitalresumehub.com
     ↓                         ↓
   Netlify/Vercel           Railway
```

## 🚀 Tech Stack

### Frontend
- **SvelteKit** - Full-stack web framework
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first styling
- **shadcn-svelte** - Beautiful UI components
- **Vitest** - Testing framework

### Backend
- **PocketBase** - Backend-as-a-Service
- **SQLite** - Database
- **Railway** - Cloud hosting

## 🛠️ Development Setup

### Prerequisites
- Node.js 20+
- pnpm (recommended) or npm

### 1. Clone Repository
```bash
git clone https://github.com/your-username/temp-resume-hub.git
cd temp-resume-hub
```

### 2. Backend Setup
```bash
cd backend

# Download PocketBase (Linux/Mac)
wget https://github.com/pocketbase/pocketbase/releases/download/v0.22.21/pocketbase_0.22.21_linux_amd64.zip
unzip pocketbase_0.22.21_linux_amd64.zip

# Start PocketBase
./pocketbase serve --http=0.0.0.0:8080
```

Visit `http://localhost:8080/_/` to set up admin account.

### 3. Frontend Setup
```bash
cd app

# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Start development server
pnpm run dev
```

Visit `http://localhost:5173` to see the app.

## 📁 Project Structure

```
temp-resume-hub/
├── app/                    # SvelteKit frontend
│   ├── src/
│   │   ├── lib/
│   │   │   ├── components/ui/  # shadcn-svelte components
│   │   │   ├── pocketbase.ts   # PocketBase client
│   │   │   └── config.ts       # App configuration
│   │   ├── routes/             # SvelteKit routes
│   │   └── tests/              # Test files
│   ├── static/                 # Static assets
│   └── package.json
├── backend/                # PocketBase backend
│   ├── pb_hooks/          # Custom API hooks
│   ├── pb_migrations/     # Database migrations
│   ├── Dockerfile         # Railway deployment
│   └── railway.toml       # Railway configuration
├── .github/workflows/     # CI/CD pipelines
├── DEPLOYMENT.md          # Deployment guide
└── DNS_SETUP.md          # Domain configuration
```

## 🧪 Testing

```bash
cd app

# Run tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Run tests with UI
pnpm run test:ui
```

## 🚀 Deployment

### Quick Deploy

1. **Backend (Railway)**:
   - Fork this repository
   - Connect to Railway
   - Deploy `backend` directory
   - Set custom domain: `api.digitalresumehub.com`

2. **Frontend (Netlify)**:
   - Connect repository to Netlify
   - Set build directory: `app`
   - Set custom domain: `digitalresumehub.com`

3. **DNS Configuration**:
   - See [DNS_SETUP.md](DNS_SETUP.md) for detailed instructions

### Detailed Instructions
See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment guide.

## 🔧 Configuration

### Environment Variables

#### Frontend (`app/.env`)
```bash
PUBLIC_POCKETBASE_URL=https://api.digitalresumehub.com
PUBLIC_APP_URL=https://digitalresumehub.com
```

#### Backend (Railway)
```bash
PORT=8080
```

## 📊 Database Schema

### Collections

#### Users
- `id` - Unique identifier
- `email` - User email (auth)
- `name` - Display name
- `avatar` - Profile picture

#### Resumes
- `id` - Unique identifier
- `title` - Resume title
- `user` - Owner (relation to users)
- `content` - Resume data (JSON)
- `template` - Template name
- `is_public` - Public sharing flag
- `slug` - Custom URL slug

## 🎨 UI Components

Available shadcn-svelte components:
- Button (variants: default, outline, ghost, etc.)
- Card (with header, content, footer)
- Input, Label, Textarea
- Dialog, Sheet, Popover
- Badge, Avatar, Separator

Add more components:
```bash
cd app
pnpm dlx shadcn-svelte@latest add [component-name]
```

## 🔐 Authentication

- Email/password authentication
- OAuth providers (configurable)
- JWT-based sessions
- Automatic token refresh
- Server-side auth verification

## 📱 Features Roadmap

- [ ] Resume templates
- [ ] PDF export
- [ ] Resume analytics
- [ ] Team collaboration
- [ ] Custom domains for users
- [ ] Resume themes
- [ ] Import from LinkedIn
- [ ] ATS optimization tips

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the docs in this repository
- **Issues**: [GitHub Issues](https://github.com/your-username/temp-resume-hub/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/temp-resume-hub/discussions)

## 🙏 Acknowledgments

- [SvelteKit](https://kit.svelte.dev/) - Amazing full-stack framework
- [PocketBase](https://pocketbase.io/) - Fantastic backend solution
- [shadcn-svelte](https://www.shadcn-svelte.com/) - Beautiful UI components
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Railway](https://railway.app/) - Simple cloud deployment