#!/bin/bash

echo "🚀 Library Management System - Deployment Helper"
echo "================================================"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Prerequisites check passed!"

echo ""
echo "📋 Deployment Checklist:"
echo "1. ✅ Git installed"
echo "2. ✅ Node.js installed"
echo "3. ⏳ Create Railway account (https://railway.app)"
echo "4. ⏳ Create Vercel account (https://vercel.com)"
echo "5. ⏳ Set up PostgreSQL database"
echo "6. ⏳ Configure environment variables"
echo "7. ⏳ Deploy backend to Railway"
echo "8. ⏳ Deploy frontend to Vercel"
echo "9. ⏳ Test the application"

echo ""
echo "🔧 Quick Setup Commands:"
echo ""
echo "# Backend Setup:"
echo "cd backend"
echo "npm install"
echo "cp env.example .env"
echo "# Edit .env with your database URL and JWT secret"
echo ""
echo "# Frontend Setup:"
echo "cd frontend"
echo "npm install"
echo "cp env.example .env"
echo "# Edit .env with your backend API URL"
echo ""
echo "# Test locally:"
echo "cd backend && npm start"
echo "cd frontend && npm run dev"

echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo ""
echo "🎯 Recommended deployment order:"
echo "1. Set up PostgreSQL database on Railway"
echo "2. Deploy backend to Railway"
echo "3. Deploy frontend to Vercel"
echo "4. Update CORS settings"
echo "5. Test the application"

echo ""
echo "🔗 Useful Links:"
echo "- Railway: https://railway.app"
echo "- Vercel: https://vercel.com"
echo "- Supabase: https://supabase.com"
echo "- PostgreSQL: https://www.postgresql.org/"

echo ""
echo "Happy deploying! 🎉" 