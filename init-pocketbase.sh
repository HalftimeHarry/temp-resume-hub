#!/bin/bash

echo "🚀 Initializing PocketBase..."

cd backend

# Remove any existing database to start fresh
rm -f pb_data/data.db

# Start PocketBase in the background
echo "Starting PocketBase server..."
./pocketbase serve --http=0.0.0.0:8090 &

# Wait for PocketBase to start
echo "Waiting for PocketBase to initialize..."
sleep 5

# Check if it's running
if curl -s http://localhost:8090/api/health > /dev/null 2>&1; then
    echo "✅ PocketBase is running successfully!"
    echo "🌐 Admin interface: http://localhost:8090/_/"
    echo "📧 Admin email: ddinsmore8@gmail.com"
    echo "🔑 Admin password: (check the startup logs above)"
else
    echo "❌ PocketBase failed to start properly"
    echo "📋 Checking process..."
    ps aux | grep pocketbase
fi

echo ""
echo "📝 Next steps:"
echo "1. Open http://localhost:8090/_ in your browser"
echo "2. Log in with the admin credentials"
echo "3. Create the user_profiles collection using the GUI"