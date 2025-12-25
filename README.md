# BeyondChats Article Scraper & Enhancer

A full-stack application that scrapes articles from BeyondChats blog, enhances them using AI, and displays them in a modern React frontend.

![Project Architecture](https://img.shields.io/badge/Laravel-10.x-red?style=flat&logo=laravel)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green?style=flat&logo=node.js)
![React](https://img.shields.io/badge/React-18.x-blue?style=flat&logo=react)
![Docker](https://img.shields.io/badge/Docker-Compose-blue?style=flat&logo=docker)

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Architecture Diagram](#-architecture-diagram)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Local Setup Instructions](#-local-setup-instructions)
- [API Documentation](#-api-documentation)
- [Features](#-features)
- [Live Demo](#-live-demo)

## 🎯 Project Overview

This project is divided into three phases:

### Phase 1: Laravel Backend (Article Scraper & CRUD API)
- Scrapes the 5 oldest articles from [BeyondChats Blog](https://beyondchats.com/blogs/)
- Stores articles in a MySQL database
- Provides RESTful CRUD APIs for article management

### Phase 2: Node.js Article Enhancer
- Fetches the latest article from Laravel API
- Searches Google for related articles
- Scrapes content from top-ranking articles
- Uses OpenAI GPT-4 to enhance the original article
- Publishes enhanced article with cited references

### Phase 3: React Frontend
- Modern, responsive UI built with React 18 + Tailwind CSS
- Displays both original and AI-enhanced articles
- Beautiful article reader with reference citations

## 🏗 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           BeyondChats Article System                         │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   BeyondChats   │     │  Google Search  │     │   OpenAI API    │
│     Blog        │     │   (Serper.dev)  │     │    (GPT-4)      │
│ (Data Source)   │     │                 │     │                 │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         │ Scrape Articles       │ Search & Scrape       │ Enhance Content
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        LARAVEL BACKEND                               │   │
│  │                        (Port 8000)                                   │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐   │   │
│  │  │   Article    │  │   Scraper    │  │     API Endpoints        │   │   │
│  │  │   Model      │  │   Service    │  │  GET  /api/articles      │   │   │
│  │  │              │  │              │  │  GET  /api/articles/:slug│   │   │
│  │  │  - title     │  │  - Guzzle    │  │  POST /api/articles      │   │   │
│  │  │  - content   │  │  - DomCrawler│  │  PUT  /api/articles/:slug│   │   │
│  │  │  - slug      │  │              │  │  DELETE /api/articles/...|   │   │
│  │  │  - is_enhanced│ │              │  │  GET  /api/articles/latest│  │   │
│  │  │  - references│  │              │  │                          │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────────────────┘   │   │
│  └──────────────────────────────────┬──────────────────────────────────┘   │
│                                     │                                       │
│                                     │ MySQL Connection                      │
│                                     ▼                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         MYSQL DATABASE                               │   │
│  │                                                                      │   │
│  │   ┌─────────────────────────────────────────────────────────────┐   │   │
│  │   │                    articles table                            │   │   │
│  │   │  id | title | slug | content | is_enhanced | references | ..│   │   │
│  │   └─────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
         ▲                                                    │
         │                                                    │
         │ Fetch Article                                      │ API Requests
         │ Publish Enhanced                                   │
         │                                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          NODE.JS ENHANCER                                    │
│                                                                             │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────────────┐    │
│  │  Laravel   │  │  Google    │  │  Article   │  │      LLM           │    │
│  │  API       │  │  Search    │  │  Scraper   │  │    Service         │    │
│  │  Client    │  │  Service   │  │  (Cheerio) │  │   (OpenAI)         │    │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘  └─────────┬──────────┘    │
│        │               │               │                   │               │
│        └───────────────┴───────────────┴───────────────────┘               │
│                                │                                            │
│                    ┌───────────┴───────────┐                               │
│                    │   Article Enhancer    │                               │
│                    │   (Orchestrator)      │                               │
│                    └───────────────────────┘                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           REACT FRONTEND                                     │
│                            (Port 3000)                                       │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         Components                                   │   │
│  │  ┌──────────┐  ┌──────────────┐  ┌─────────────┐  ┌─────────────┐   │   │
│  │  │  Header  │  │ ArticleCard  │  │  HomePage   │  │ ArticlePage │   │   │
│  │  └──────────┘  └──────────────┘  └─────────────┘  └─────────────┘   │   │
│  │                                                                      │   │
│  │  ┌────────────────────────────────────────────────────────────────┐ │   │
│  │  │                    ArticleContext (State Management)           │ │   │
│  │  └────────────────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Features:                                                                  │
│  ✓ View original articles                                                   │
│  ✓ View AI-enhanced articles with references                               │
│  ✓ Filter by article type (original/enhanced)                              │
│  ✓ Responsive design with Tailwind CSS                                     │
│  ✓ Smooth animations with Framer Motion                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
1. SCRAPING FLOW:
   BeyondChats Blog → Laravel Scraper → MySQL Database

2. ENHANCEMENT FLOW:
   Laravel API → Node.js Enhancer → Google Search → Scrape Top Articles
                                  → OpenAI GPT-4 → Enhanced Content
                                  → Laravel API (Create Enhanced Article)

3. DISPLAY FLOW:
   MySQL Database → Laravel API → React Frontend → User
```

## 🛠 Tech Stack

| Component | Technology |
|-----------|------------|
| **Backend** | Laravel 10, PHP 8.2, MySQL 8 |
| **Enhancer** | Node.js 20, Axios, Cheerio, OpenAI SDK |
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion |
| **DevOps** | Docker, Docker Compose |
| **APIs** | Serper.dev (Google Search), OpenAI GPT-4 |

## 📁 Project Structure

```
beyondchats-article-project/
├── backend/                    # Laravel Backend
│   ├── app/
│   │   ├── Console/Commands/   # Artisan commands
│   │   ├── Http/Controllers/   # API controllers
│   │   ├── Models/             # Eloquent models
│   │   └── Services/           # Business logic
│   ├── database/migrations/    # Database migrations
│   ├── routes/api.php          # API routes
│   ├── Dockerfile
│   └── composer.json
│
├── node-enhancer/              # Node.js Article Enhancer
│   ├── src/
│   │   ├── services/
│   │   │   ├── ArticleEnhancer.js
│   │   │   ├── ArticleScraper.js
│   │   │   ├── GoogleSearchService.js
│   │   │   ├── LaravelApiClient.js
│   │   │   └── LLMService.js
│   │   └── index.js
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── context/            # React context
│   │   ├── pages/              # Page components
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml          # Docker orchestration
└── README.md                   # This file
```

## 🚀 Local Setup Instructions

### Prerequisites

- Docker & Docker Compose (recommended)
- OR manually install: PHP 8.2+, Composer, Node.js 20+, MySQL 8

### Option 1: Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd beyondchats-article-project
   ```

2. **Create environment file**
   ```bash
   cp backend/.env.example backend/.env
   ```

3. **Set up API keys** (optional but recommended)
   
   Create a `.env` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key
   SERPER_API_KEY=your_serper_api_key
   ```

4. **Start all services**
   ```bash
   docker-compose up -d --build
   ```

5. **Run database migrations**
   ```bash
   docker-compose exec backend php artisan migrate
   ```

6. **Scrape articles**
   ```bash
   docker-compose exec backend php artisan articles:scrape
   ```

7. **Run the article enhancer**
   ```bash
   docker-compose run node-enhancer npm start
   ```

8. **Access the application**
   - Frontend: http://localhost:3000
   - API: http://localhost:8000/api

### Option 2: Manual Setup

#### Backend (Laravel)

```bash
cd backend

# Install dependencies
composer install

# Set up environment
cp .env.example .env
php artisan key:generate

# Configure database in .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_DATABASE=beyondchats
# DB_USERNAME=root
# DB_PASSWORD=

# Run migrations
php artisan migrate

# Scrape articles
php artisan articles:scrape

# Start server
php artisan serve
```

#### Node.js Enhancer

```bash
cd node-enhancer

# Install dependencies
npm install

# Create .env file
echo "LARAVEL_API_URL=http://localhost:8000/api" > .env
echo "OPENAI_API_KEY=your_key" >> .env
echo "SERPER_API_KEY=your_key" >> .env

# Run enhancer
npm start
```

#### Frontend (React)

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:8000/api" > .env

# Start development server
npm run dev
```

## 📚 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/articles` | List all articles (paginated) |
| GET | `/articles/latest` | Get the latest original article |
| GET | `/articles/originals` | Get all original articles |
| GET | `/articles/enhanced` | Get all enhanced articles |
| GET | `/articles/{slug}` | Get a specific article |
| POST | `/articles` | Create a new article |
| PUT | `/articles/{slug}` | Update an article |
| DELETE | `/articles/{slug}` | Delete an article |
| GET | `/health` | API health check |

### Example Request

```bash
# Get all articles
curl http://localhost:8000/api/articles

# Get latest article
curl http://localhost:8000/api/articles/latest

# Create article
curl -X POST http://localhost:8000/api/articles \
  -H "Content-Type: application/json" \
  -d '{"title": "My Article", "content": "<p>Content here</p>"}'
```

## ✨ Features

### Backend
- ✅ Web scraping with Guzzle & DomCrawler
- ✅ RESTful API with Laravel
- ✅ MySQL database with proper migrations
- ✅ Article CRUD operations
- ✅ Filtering by enhanced/original status
- ✅ CORS enabled for frontend

### Node.js Enhancer
- ✅ Fetches articles from Laravel API
- ✅ Google search integration (via Serper.dev)
- ✅ Web scraping with Cheerio
- ✅ OpenAI GPT-4 integration
- ✅ Automatic reference citation
- ✅ Fallback enhancement without API keys

### Frontend
- ✅ Modern React 18 with hooks
- ✅ Beautiful UI with Tailwind CSS
- ✅ Smooth animations with Framer Motion
- ✅ Responsive design
- ✅ Article filtering (all/original/enhanced)
- ✅ Reference display for enhanced articles
- ✅ Demo data for preview without backend

## 🌐 Live Demo

**Frontend URL:** [Coming Soon]

The live demo showcases:
- Original scraped articles from BeyondChats
- AI-enhanced versions with cited references
- Side-by-side comparison capability

## 📝 Notes

- **API Keys**: The enhancer works without API keys using fallback methods, but for best results:
  - Get an OpenAI API key from https://platform.openai.com
  - Get a Serper API key from https://serper.dev (free tier available)

- **Scraping**: The scraper is configured for BeyondChats blog structure. For other sites, selectors may need adjustment.

- **Rate Limiting**: The enhancer includes delays to avoid hitting rate limits on external APIs.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for BeyondChats**

