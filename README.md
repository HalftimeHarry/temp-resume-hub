# 🎯 Resume Hub

A modern, full-stack resume builder application with real-time preview and professional templates.

## ✨ Features

- 📝 **Multi-step Resume Builder** - Guided form with live preview
- 🎨 **Professional Templates** - Multiple customizable designs  
- 👤 **User Profiles** - Personal information and preferences
- 🔐 **Secure Authentication** - User accounts with social login
- 📱 **Responsive Design** - Works on all devices
- 🌐 **Public Sharing** - Share resumes with custom URLs
- 📄 **PDF Export** - Download professional PDFs

## 🚀 Quick Start

```bash
# Frontend
cd app
npm install
npm run dev

# Backend  
cd backend
./pocketbase serve
```

Visit http://localhost:5173 to see the app.

## 📚 Documentation

- **[Development Guide](docs/DEVELOPMENT.md)** - Setup, workflow, and troubleshooting
- **[Backend Documentation](docs/BACKEND.md)** - PocketBase setup and API
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment instructions

## 📁 Project Structure

```
temp-resume-hub/
├── app/                    # SvelteKit frontend
│   ├── src/
│   │   ├── lib/           # Components & utilities
│   │   ├── routes/        # Pages and API routes
│   │   └── stores/        # Svelte stores
├── backend/               # PocketBase backend
│   ├── pb_data/          # Database files
│   └── pb_migrations/    # Database migrations
└── docs/                 # Documentation
```

## 🔧 Environment Setup

```bash
# Frontend environment (app/.env)
PUBLIC_POCKETBASE_URL=http://localhost:8090

# Backend runs on port 8090 by default
# Frontend dev server runs on port 5173
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for creating professional resumes**