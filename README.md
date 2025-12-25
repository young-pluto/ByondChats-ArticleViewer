# BeyondChats Article Viewer

A full-stack application that scrapes articles from BeyondChats, enhances them using AI, and displays both original and enhanced versions in a beautiful React frontend.

![BeyondChats Article Viewer](https://img.shields.io/badge/Status-Live-brightgreen) ![Laravel](https://img.shields.io/badge/Backend-Laravel-red) ![Node.js](https://img.shields.io/badge/Enhancer-Node.js-green) ![React](https://img.shields.io/badge/Frontend-React-blue)

## 🌐 Live Demo

- **Frontend:** [https://byond-chats-article-viewer.vercel.app](https://byond-chats-article-viewer.vercel.app)
- **Backend API:** [https://beyondchats-api-7v31.onrender.com/api](https://beyondchats-api-7v31.onrender.com/api)
- **Enhancer Service:** [https://beyondchats-enhancer.onrender.com](https://beyondchats-enhancer.onrender.com)

---

## 📋 Project Overview

This project is divided into **3 phases** as per the task requirements:

### Phase 1: Laravel Backend (Moderate Difficulty) ✅

- Scrapes articles from the [BeyondChats Blog](https://beyondchats.com/blogs/)
- Stores articles in a SQLite database
- Provides full CRUD REST APIs for article management

### Phase 2: Node.js Article Enhancer (Very Difficult) ✅

- Fetches the latest article from the Laravel API
- Searches Google for the article title
- Scrapes content from top 2 competing articles
- Uses OpenAI GPT to enhance the original article
- Publishes the enhanced version with citations
- Exposed as a web service with API endpoints

### Phase 3: React Frontend (Very Easy) ✅

- Beautiful, responsive UI built with React + Tailwind CSS
- Displays both original and AI-enhanced articles
- Filter tabs: All Articles, Original, Enhanced
- **"✨ Enhance" button** to enhance articles directly from the UI
- Smooth animations with Framer Motion

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│                    React + Tailwind CSS                          │
│                    (Vercel Deployment)                           │
└─────────────────────┬───────────────────────┬───────────────────┘
                      │                       │
                      │ Fetch Articles        │ Enhance Request
                      ▼                       ▼
┌─────────────────────────────┐   ┌───────────────────────────────┐
│      LARAVEL BACKEND        │   │    NODE.JS ENHANCER           │
│                             │   │                               │
│  • Article CRUD APIs        │◄──│  • Google Search              │
│  • Web Scraper              │   │  • Article Scraper            │
│  • SQLite Database          │   │  • OpenAI Integration         │
│                             │   │  • Content Enhancement        │
│     (Render Deployment)     │   │     (Render Deployment)       │
└─────────────────────────────┘   └───────────────────────────────┘
```

---

## 🚀 Features

| Feature | Description |
|---------|-------------|
| 📰 Article Scraping | Automatically scrapes articles from BeyondChats blog |
| 🤖 AI Enhancement | Uses GPT-4 to rewrite articles with improved structure |
| 📚 Citation System | References competing articles in enhanced versions |
| ✨ One-Click Enhance | Enhance any article directly from the UI |
| 🎨 Beautiful UI | Modern design with dark gradients and smooth animations |
| 📱 Responsive | Works perfectly on desktop, tablet, and mobile |
| 🔍 Filter System | Toggle between All, Original, and Enhanced articles |

---

## 🛠️ Tech Stack

### Backend (Laravel)
- PHP 8.x
- Laravel 10
- SQLite Database
- Guzzle HTTP Client

### Enhancer (Node.js)
- Node.js 18+
- Express.js
- OpenAI API (GPT-4)
- Puppeteer (Web Scraping)
- Cheerio (HTML Parsing)

### Frontend (React)
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- Axios

---

## 📦 Local Development Setup

### Prerequisites
- PHP 8.x with Composer
- Node.js 18+
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/young-pluto/ByondChats-ArticleViewer.git
cd ByondChats-ArticleViewer
```

### 2. Backend Setup (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve
```

Backend runs at: `http://localhost:8000`

### 3. Enhancer Setup (Node.js)

```bash
cd node-enhancer
npm install
cp .env.example .env
# Add your OPENAI_API_KEY to .env
npm start
```

Enhancer runs at: `http://localhost:3001`

### 4. Frontend Setup (React)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔑 Environment Variables

### Backend (.env)
```env
APP_KEY=base64:your-app-key
APP_ENV=production
DB_CONNECTION=sqlite
```

### Enhancer (.env)
```env
LARAVEL_API_URL=http://localhost:8000/api
OPENAI_API_KEY=sk-your-openai-key
SERPER_API_KEY=optional-for-google-search
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api
VITE_ENHANCER_URL=http://localhost:3001
```

---

## 📡 API Endpoints

### Laravel Backend

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/articles` | List all articles |
| GET | `/api/articles/{slug}` | Get single article |
| POST | `/api/articles` | Create article |
| PUT | `/api/articles/{slug}` | Update article |
| DELETE | `/api/articles/{slug}` | Delete article |
| GET | `/api/articles/latest` | Get latest article |
| POST | `/api/scrape` | Trigger article scraping |

### Node.js Enhancer

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/health` | Health status |
| POST | `/enhance/:id` | Enhance specific article |
| POST | `/enhance-latest` | Enhance latest non-enhanced article |

---

## 🎯 How the Enhancement Works

1. **Fetch** - Gets the original article from Laravel API
2. **Search** - Searches Google for the article title
3. **Scrape** - Extracts content from top 2 competing articles
4. **Analyze** - Sends all content to GPT-4 for analysis
5. **Enhance** - GPT-4 rewrites the article with:
   - Better structure and formatting
   - Additional insights from competitors
   - Improved readability
6. **Publish** - Saves enhanced version with reference citations
7. **Display** - Shows both versions in the frontend

---

## 📸 Screenshots

### Homepage with Article Cards
- Filter between All, Original, and Enhanced articles
- Each card shows title, excerpt, date, and author
- Enhanced articles have a special badge

### Article Detail Page
- Full article content with rich formatting
- Reference citations for enhanced articles
- Share and copy link functionality

### Enhance Button
- Click "✨ Enhance" on any original article
- Real-time loading state
- Automatic refresh after enhancement

---

## 🚀 Deployment

### Backend → Render.com
1. Create new Web Service
2. Connect GitHub repository
3. Set root directory to `backend`
4. Set build command: `composer install --no-dev`
5. Set start command: `php artisan serve --host=0.0.0.0 --port=$PORT`

### Enhancer → Render.com
1. Create new Web Service
2. Connect GitHub repository
3. Set root directory to `node-enhancer`
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables (OPENAI_API_KEY, LARAVEL_API_URL)

### Frontend → Vercel
1. Import GitHub repository
2. Set root directory to `frontend`
3. Add environment variables (VITE_API_URL, VITE_ENHANCER_URL)
4. Deploy

---

## 👨‍💻 Author

Built for the BeyondChats Full-Stack Assessment

---

## 📄 License

MIT License - feel free to use this code for learning purposes.
