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
        "version": "1.0.0"
    })
})