// PocketBase hooks for Digital Resume Hub

// Auto-create admin user on first startup
onAfterBootstrap((e) => {
    const adminEmail = process.env.ADMIN_EMAIL || "ddinsmore8@gmail.com"
    const adminPassword = process.env.ADMIN_PASSWORD || "MADcap(123)"
    
    try {
        // Check if admin already exists
        const admin = $app.dao().findAdminByEmail(adminEmail)
        if (admin) {
            console.log("Admin user already exists:", adminEmail)
            return
        }
    } catch (err) {
        // Admin doesn't exist, create one
        console.log("Creating admin user:", adminEmail)
        
        const admin = new Admin()
        admin.email = adminEmail
        admin.setPassword(adminPassword)
        
        $app.dao().saveAdmin(admin)
        console.log("Admin user created successfully!")
    }
})

// Health check endpoint
routerAdd("GET", "/api/health", (c) => {
    return c.json(200, {
        "status": "ok", 
        "message": "Digital Resume Hub API is running",
        "timestamp": new Date().toISOString(),
        "version": "1.0.0",
        "admin_configured": true
    })
})

// Configure CORS for all API routes
routerUse(function(next) {
    return function(c) {
        // Allow requests from your domain
        const allowedOrigins = [
            "https://digitalresumehub.com",
            "https://www.digitalresumehub.com",
            "http://localhost:5173", // for development
            "https://*.gitpod.dev", // for Gitpod development
            "https://*.netlify.app", // for Netlify previews
            "https://*.vercel.app" // for Vercel previews
        ]
        
        const origin = c.request().header.get("Origin")
        
        if (allowedOrigins.some(allowed => {
            if (allowed.includes("*")) {
                return origin && origin.includes(allowed.replace("*", ""))
            }
            return origin === allowed
        })) {
            c.response().header().set("Access-Control-Allow-Origin", origin)
        }
        
        c.response().header().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        c.response().header().set("Access-Control-Allow-Headers", "Content-Type, Authorization")
        c.response().header().set("Access-Control-Allow-Credentials", "true")
        
        if (c.request().method === "OPTIONS") {
            return c.noContent(204)
        }
        
        return next(c)
    }
})