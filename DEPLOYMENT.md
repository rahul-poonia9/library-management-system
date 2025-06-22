# 🚀 Library Management System - Deployment Guide

This guide will help you deploy the Library Management System to production.

## 📋 Prerequisites

- [Git](https://git-scm.com/) installed
- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/) database (or cloud database)
- Accounts on deployment platforms (Vercel, Railway, etc.)

## 🎯 Recommended Deployment Strategy

### Frontend: Vercel
### Backend: Railway
### Database: Railway PostgreSQL

---

## 🗄️ Step 1: Database Setup

### Option A: Railway PostgreSQL (Recommended)

1. **Create Railway Account**
   - Go to [Railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create PostgreSQL Database**
   - Click "New Project"
   - Select "Provision PostgreSQL"
   - Note down the connection details

3. **Get Database URL**
   - Go to your PostgreSQL service
   - Click "Connect" → "PostgreSQL"
   - Copy the connection URL

### Option B: Supabase (Alternative)

1. **Create Supabase Account**
   - Go to [Supabase.com](https://supabase.com)
   - Create new project

2. **Get Database URL**
   - Go to Settings → Database
   - Copy the connection string

---

## 🔧 Step 2: Backend Deployment (Railway)

### 1. Prepare Backend Repository

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp env.example .env
```

### 2. Update Environment Variables

Edit `backend/.env`:

```env
DATABASE_URL=postgresql://your-railway-db-url
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

### 3. Deploy to Railway

1. **Connect Repository**
   - Go to [Railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Set root directory to `backend`

2. **Configure Environment Variables**
   - Go to your service → Variables
   - Add all variables from your `.env` file

3. **Deploy**
   - Railway will automatically detect the Node.js app
   - It will run `npm install` and `npm start`

4. **Get Backend URL**
   - Note down your Railway app URL (e.g., `https://your-app.railway.app`)

---

## 🎨 Step 3: Frontend Deployment (Vercel)

### 1. Prepare Frontend Repository

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
cp env.example .env
```

### 2. Update API Configuration

Edit `frontend/src/config/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-backend-url.railway.app/api';

export const API_ENDPOINTS = {
  AUTH_LOGIN: '/auth/login',
  AUTH_ME: '/auth/me',
  BOOKS: '/books',
  BOOK_BY_ID: (id) => `/books/${id}`,
  BOOKS_SEARCH: '/books/search',
  BOOKS_AVAILABLE: '/books/available',
  STUDENTS: '/students',
  STUDENT_BY_ID: (id) => `/students/${id}`,
  ISSUES: '/issues',
  ISSUE_BY_ID: (id) => `/issues/${id}`,
  ISSUES_OVERDUE: '/issues/overdue',
  DASHBOARD_STATISTICS: '/dashboard/statistics',
  DASHBOARD_RECENT_ACTIVITY: '/dashboard/recent-activity',
  DASHBOARD_OVERDUE_BOOKS: '/dashboard/overdue-books',
  DASHBOARD_DEPARTMENT_STATS: '/dashboard/department-stats',
  DASHBOARD_BOOK_CATEGORIES: '/dashboard/book-categories',
  DASHBOARD_DAILY_ACTIVITY: '/dashboard/daily-activity',
};

export default API_BASE_URL;
```

### 3. Deploy to Vercel

1. **Connect Repository**
   - Go to [Vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your repository

2. **Configure Build Settings**
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add: `VITE_API_BASE_URL=https://your-backend-url.railway.app/api`

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your app

5. **Get Frontend URL**
   - Note down your Vercel app URL (e.g., `https://your-app.vercel.app`)

---

## 🔄 Step 4: Update CORS Configuration

### Update Backend CORS

In `backend/src/index.js`, update the CORS origins:

```javascript
app.use(cors({
  origin: [
    'https://your-frontend-domain.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Redeploy Backend

After updating CORS, redeploy your backend on Railway.

---

## 🗃️ Step 5: Database Migration

### Run Migrations

1. **Connect to Railway Database**
   - Go to your Railway PostgreSQL service
   - Click "Connect" → "PostgreSQL"
   - Use a database client (pgAdmin, DBeaver, etc.)

2. **Run Schema Migration**
   ```sql
   -- Run the schema.sql file
   -- This will create all necessary tables
   ```

3. **Load Sample Data**
   ```sql
   -- Run the sample-data.sql file
   -- This will populate the database with sample data
   ```

---

## 🧪 Step 6: Testing

### Test Your Deployment

1. **Frontend**
   - Visit your Vercel URL
   - Test login functionality
   - Test all CRUD operations

2. **Backend**
   - Test health endpoint: `https://your-backend-url.railway.app/health`
   - Test API endpoints

3. **Database**
   - Verify data is being saved/retrieved correctly

---

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure frontend URL is in backend CORS origins
   - Check environment variables

2. **Database Connection**
   - Verify DATABASE_URL is correct
   - Check if database is accessible

3. **Build Errors**
   - Check Node.js version compatibility
   - Verify all dependencies are installed

4. **Environment Variables**
   - Ensure all required variables are set
   - Check variable names and values

### Debug Commands

```bash
# Check backend logs
railway logs

# Check frontend build
npm run build

# Test API locally
curl https://your-backend-url.railway.app/health
```

---

## 📊 Monitoring

### Railway Monitoring
- Check Railway dashboard for app health
- Monitor database usage
- Set up alerts for errors

### Vercel Analytics
- Enable Vercel Analytics
- Monitor frontend performance
- Track user interactions

---

## 🔒 Security Considerations

1. **Environment Variables**
   - Never commit `.env` files
   - Use strong JWT secrets
   - Rotate secrets regularly

2. **Database Security**
   - Use strong database passwords
   - Enable SSL connections
   - Regular backups

3. **API Security**
   - Implement rate limiting
   - Validate all inputs
   - Use HTTPS only

---

## 🚀 Your App is Live!

Your Library Management System should now be accessible at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.railway.app`
- **Database**: Managed by Railway

### Next Steps
1. Set up custom domain (optional)
2. Configure email notifications
3. Set up monitoring and alerts
4. Regular backups and maintenance

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review platform documentation
3. Check application logs
4. Verify environment variables

Happy deploying! 🎉 