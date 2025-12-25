import 'dotenv/config';
import { ArticleEnhancer } from './services/ArticleEnhancer.js';
import { LaravelApiClient } from './services/LaravelApiClient.js';
import { GoogleSearchService } from './services/GoogleSearchService.js';
import { ArticleScraper } from './services/ArticleScraper.js';
import { LLMService } from './services/LLMService.js';

async function main() {
    console.log('🚀 Starting Article Enhancement Pipeline...\n');

    try {
        // Initialize services
        const apiClient = new LaravelApiClient(process.env.LARAVEL_API_URL || 'http://localhost:8000/api');
        const googleSearch = new GoogleSearchService(process.env.SERPER_API_KEY);
        const scraper = new ArticleScraper();
        const llmService = new LLMService(process.env.OPENAI_API_KEY);

        const enhancer = new ArticleEnhancer(apiClient, googleSearch, scraper, llmService);

        // Step 1: Fetch the latest article from Laravel API
        console.log('📥 Step 1: Fetching latest article from Laravel API...');
        const latestArticle = await apiClient.getLatestArticle();
        
        if (!latestArticle) {
            console.log('❌ No articles found in the database. Please run the scraper first.');
            process.exit(1);
        }

        console.log(`✅ Found article: "${latestArticle.title}"\n`);

        // Step 2: Search Google for the article title
        console.log('🔍 Step 2: Searching Google for related articles...');
        const searchResults = await googleSearch.search(latestArticle.title);
        
        if (searchResults.length < 2) {
            console.log('⚠️ Not enough search results found. Using available results.');
        }

        console.log(`✅ Found ${searchResults.length} search results\n`);

        // Step 3: Scrape content from top 2 articles
        console.log('📄 Step 3: Scraping content from top articles...');
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
            console.log('❌ Could not scrape any reference articles. Aborting.');
            process.exit(1);
        }

        console.log(`✅ Scraped ${scrapedArticles.length} reference articles\n`);

        // Step 4: Use LLM to enhance the article
        console.log('🤖 Step 4: Enhancing article with LLM...');
        const enhancedContent = await llmService.enhanceArticle(
            latestArticle,
            scrapedArticles
        );

        console.log('✅ Article enhanced successfully\n');

        // Step 5: Publish the enhanced article
        console.log('📤 Step 5: Publishing enhanced article...');
        
        const references = scrapedArticles.map(article => ({
            title: article.title,
            url: article.url
        }));

        const enhancedArticle = await apiClient.createArticle({
            title: `${latestArticle.title} (Enhanced)`,
            content: enhancedContent,
            excerpt: latestArticle.excerpt,
            author: latestArticle.author,
            original_url: latestArticle.original_url,
            featured_image: latestArticle.featured_image,
            published_at: new Date().toISOString(),
            is_enhanced: true,
            enhanced_content: enhancedContent,
            references: references,
            meta_description: latestArticle.meta_description,
            meta_keywords: latestArticle.meta_keywords
        });

        console.log('✅ Enhanced article published successfully!\n');
        console.log('📋 Summary:');
        console.log(`   Original: "${latestArticle.title}"`);
        console.log(`   Enhanced: "${enhancedArticle.title}"`);
        console.log(`   References: ${references.length} articles cited`);
        console.log('\n🎉 Article enhancement pipeline completed successfully!');

    } catch (error) {
        console.error('\n❌ Error in enhancement pipeline:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

main();

