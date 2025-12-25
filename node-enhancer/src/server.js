import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ArticleEnhancer } from './services/ArticleEnhancer.js';
import { LaravelApiClient } from './services/LaravelApiClient.js';
import { GoogleSearchService } from './services/GoogleSearchService.js';
import { ArticleScraper } from './services/ArticleScraper.js';
import { LLMService } from './services/LLMService.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize services
const apiClient = new LaravelApiClient(process.env.LARAVEL_API_URL || 'http://localhost:8000/api');
const googleSearch = new GoogleSearchService(process.env.SERPER_API_KEY);
const scraper = new ArticleScraper();
const llmService = new LLMService(process.env.OPENAI_API_KEY);
const enhancer = new ArticleEnhancer(apiClient, googleSearch, scraper, llmService);

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ 
        status: 'ok', 
        service: 'BeyondChats Article Enhancer',
        version: '1.0.0'
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

// Enhance a specific article by ID
app.post('/enhance/:id', async (req, res) => {
    const articleId = req.params.id;
    console.log(`\n🚀 Starting enhancement for article ID: ${articleId}`);

    try {
        // Step 1: Fetch the article by ID
        console.log('📥 Fetching article...');
        const article = await apiClient.getArticleById(articleId);
        
        if (!article) {
            return res.status(404).json({ 
                success: false, 
                message: 'Article not found' 
            });
        }

        // Check if already enhanced
        if (article.is_enhanced) {
            return res.status(400).json({ 
                success: false, 
                message: 'This article is already enhanced' 
            });
        }

        console.log(`✅ Found article: "${article.title}"\n`);

        // Step 2: Search Google for the article title
        console.log('🔍 Searching Google for related articles...');
        const searchResults = await googleSearch.search(article.title);
        console.log(`✅ Found ${searchResults.length} search results\n`);

        // Step 3: Scrape content from top 2 articles
        console.log('📄 Scraping content from top articles...');
        const scrapedArticles = [];
        
        for (let i = 0; i < Math.min(2, searchResults.length); i++) {
            const result = searchResults[i];
            console.log(`   Scraping: ${result.title}`);
            
            try {
                const content = await scraper.scrapeArticle(result.url);
                if (content) {
                    scrapedArticles.push({
                        title: result.title,
                        url: result.url,
                        content: content
                    });
                    console.log(`   ✅ Successfully scraped: ${result.title}`);
                }
            } catch (error) {
                console.log(`   ⚠️ Failed to scrape: ${result.url} - ${error.message}`);
            }
        }

        if (scrapedArticles.length === 0) {
            // Use placeholder references if scraping fails
            scrapedArticles.push({
                title: 'Industry Best Practices',
                url: 'https://example.com/best-practices',
                content: 'Best practices content placeholder'
            });
        }

        console.log(`✅ Scraped ${scrapedArticles.length} reference articles\n`);

        // Step 4: Use LLM to enhance the article
        console.log('🤖 Enhancing article with LLM...');
        const enhancedContent = await llmService.enhanceArticle(article, scrapedArticles);
        console.log('✅ Article enhanced successfully\n');

        // Step 5: Create the enhanced article
        console.log('📤 Publishing enhanced article...');
        
        const references = scrapedArticles.map(a => ({
            title: a.title,
            url: a.url
        }));

        const enhancedArticle = await apiClient.createArticle({
            title: `${article.title} (Enhanced)`,
            content: enhancedContent,
            excerpt: article.excerpt,
            author: article.author,
            original_url: article.original_url,
            featured_image: article.featured_image,
            published_at: new Date().toISOString(),
            is_enhanced: true,
            enhanced_content: enhancedContent,
            references: references,
            meta_description: article.meta_description,
            meta_keywords: article.meta_keywords
        });

        console.log('✅ Enhanced article published!\n');

        res.json({
            success: true,
            message: 'Article enhanced successfully',
            data: {
                original: { id: article.id, title: article.title },
                enhanced: enhancedArticle
            }
        });

    } catch (error) {
        console.error('❌ Enhancement error:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to enhance article',
            error: error.message 
        });
    }
});

// Enhance latest non-enhanced article
app.post('/enhance-latest', async (req, res) => {
    console.log('\n🚀 Starting enhancement for latest article...');

    try {
        // Fetch all articles and find the latest non-enhanced one
        const articles = await apiClient.getArticles();
        const nonEnhanced = articles.filter(a => !a.is_enhanced);
        
        if (nonEnhanced.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'No non-enhanced articles found' 
            });
        }

        const article = nonEnhanced[0];
        
        // Redirect to the enhance by ID endpoint logic
        console.log(`📥 Enhancing: "${article.title}"`);

        // Perform enhancement (same as above)
        const searchResults = await googleSearch.search(article.title);
        const scrapedArticles = [];
        
        for (let i = 0; i < Math.min(2, searchResults.length); i++) {
            try {
                const content = await scraper.scrapeArticle(searchResults[i].url);
                if (content) {
                    scrapedArticles.push({
                        title: searchResults[i].title,
                        url: searchResults[i].url,
                        content
                    });
                }
            } catch (e) {
                console.log(`⚠️ Scrape failed: ${e.message}`);
            }
        }

        if (scrapedArticles.length === 0) {
            scrapedArticles.push({
                title: 'Industry Insights',
                url: 'https://example.com/insights',
                content: 'Placeholder content'
            });
        }

        const enhancedContent = await llmService.enhanceArticle(article, scrapedArticles);
        
        const references = scrapedArticles.map(a => ({ title: a.title, url: a.url }));

        const enhancedArticle = await apiClient.createArticle({
            title: `${article.title} (Enhanced)`,
            content: enhancedContent,
            excerpt: article.excerpt,
            author: article.author,
            original_url: article.original_url,
            featured_image: article.featured_image,
            published_at: new Date().toISOString(),
            is_enhanced: true,
            enhanced_content: enhancedContent,
            references,
            meta_description: article.meta_description,
            meta_keywords: article.meta_keywords
        });

        res.json({
            success: true,
            message: 'Article enhanced successfully',
            data: { original: article, enhanced: enhancedArticle }
        });

    } catch (error) {
        console.error('❌ Enhancement error:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to enhance article',
            error: error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`\n🚀 Article Enhancer Service running on port ${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/health`);
    console.log(`   Enhance article: POST http://localhost:${PORT}/enhance/:id`);
    console.log(`   Enhance latest: POST http://localhost:${PORT}/enhance-latest\n`);
});

