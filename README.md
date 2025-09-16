# 🎯 **Digital Resume Hub**

A modern, full-stack application for creating and sharing professional resumes online. Built with SvelteKit frontend and PocketBase backend, deployed on Railway and Netlify.

## ✨ **Features**

- 🎨 **Modern UI**: Clean, responsive design with TailwindCSS and shadcn-svelte
- 🔐 **User Authentication**: Secure login and registration system
- 📝 **Resume Builder**: Interactive resume creation and editing
- 🌐 **Public Sharing**: Share resumes with custom URLs
- 📱 **Mobile Responsive**: Works perfectly on all devices
- 🚀 **Fast Performance**: Optimized for speed and SEO
- 🔄 **Real-time Updates**: Live preview and auto-save functionality

## 🏗️ **Tech Stack**

### **Frontend**
- **Framework**: SvelteKit with TypeScript
- **Styling**: TailwindCSS + shadcn-svelte components
- **Build Tool**: Vite
- **Testing**: Vitest + Testing Library
- **Deployment**: Netlify

### **Backend**
- **Database**: PocketBase (SQLite with REST API)
- **Authentication**: JWT-based auth with PocketBase
- **File Storage**: PocketBase file handling
- **Deployment**: Railway

### **DevOps**
- **CI/CD**: GitHub Actions
- **Version Control**: Git with automated deployments
- **Monitoring**: Railway dashboard + Netlify analytics

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ and npm
- Git
- Railway account (for backend)
- Netlify account (for frontend)

### **1. Clone Repository**
```bash
git clone https://github.com/HalftimeHarry/temp-resume-hub.git
cd temp-resume-hub
```

### **2. Setup Frontend**
```bash
cd app
npm install
cp .env.example .env
# Edit .env with your backend URL
npm run dev
```

### **3. Access Live Backend**
- **API**: https://pocketbase-production-1493.up.railway.app
- **Admin Panel**: https://pocketbase-production-1493.up.railway.app/_/
- **Credentials**: ddinsmore8@gmail.com / MADcap(123)

## 🌐 **Live URLs**

### **Production**
- **Frontend**: https://digitalresumehub.com (planned)
- **Backend API**: https://pocketbase-production-1493.up.railway.app
- **Admin Panel**: https://pocketbase-production-1493.up.railway.app/_/

### **Development**
- **Frontend**: http://localhost:5173
- **Backend**: Uses production API for development

## 📁 **Project Structure**

```
temp-resume-hub/
├── app/                    # SvelteKit frontend
│   ├── src/
│   │   ├── lib/           # Shared utilities and components
│   │   ├── routes/        # SvelteKit pages and API routes
│   │   └── app.html       # HTML template
│   ├── static/            # Static assets
│   ├── tests/             # Frontend tests
│   └── package.json
├── backend/               # PocketBase configuration
│   ├── pb_hooks/          # PocketBase JavaScript hooks
│   ├── pb_migrations/     # Database schema migrations
│   └── .env               # Backend environment variables
├── .github/workflows/     # GitHub Actions CI/CD

└── README.md              # This file
```

## 🔧 **Environment Configuration**

### **Frontend (.env)**
```bash
PUBLIC_POCKETBASE_URL=https://pocketbase-production-1493.up.railway.app
POCKETBASE_URL=https://pocketbase-production-1493.up.railway.app
PUBLIC_APP_URL=https://digitalresumehub.com
ORIGIN=https://digitalresumehub.com
```

### **Backend (.env)**
```bash
ADMIN_EMAIL=ddinsmore8@gmail.com
ADMIN_PASSWORD=MADcap(123)
APP_NAME=Digital Resume Hub
API_URL=https://pocketbase-production-1493.up.railway.app
```

## 🚀 **Deployment**

### **Automated Deployment**
- **Backend**: Deploys to Railway via GitHub Actions
- **Frontend**: Deploys to Netlify on git push
- **Triggers**: Push to main branch or manual workflow dispatch

### **Manual Deployment**
```bash
# Deploy backend to Railway
npm run deploy:backend

# Deploy frontend to Netlify
npm run deploy:frontend
```

## 🧪 **Testing**

```bash
# Run frontend tests
cd app
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📚 **API Documentation**

### **Base URL**
```
https://pocketbase-production-1493.up.railway.app
```

### **Key Endpoints**
- `GET /api/health` - Health check
- `POST /api/collections/users/auth-with-password` - User login
- `GET /api/collections/resumes/records` - Get resumes
- `POST /api/collections/resumes/records` - Create resume

### **Authentication**
All protected endpoints require JWT token in Authorization header:
```bash
Authorization: Bearer <jwt_token>
```

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 **Support**

- **Issues**: [GitHub Issues](https://github.com/HalftimeHarry/temp-resume-hub/issues)
- **Discussions**: [GitHub Discussions](https://github.com/HalftimeHarry/temp-resume-hub/discussions)
- **Email**: ddinsmore8@gmail.com

## 🎯 **Roadmap**

- [ ] Custom domain setup (api.digitalresumehub.com)
- [ ] Resume templates and themes
- [ ] PDF export functionality
- [ ] Social media integration
- [ ] Analytics dashboard
- [ ] Multi-language support

---

**Built with ❤️ by the Digital Resume Hub Team**