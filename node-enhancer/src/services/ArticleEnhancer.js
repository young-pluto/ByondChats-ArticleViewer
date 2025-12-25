/**
 * Main orchestrator for the article enhancement pipeline
 */
export class ArticleEnhancer {
    constructor(apiClient, googleSearch, scraper, llmService) {
        this.apiClient = apiClient;
        this.googleSearch = googleSearch;
        this.scraper = scraper;
        this.llmService = llmService;
    }

    /**
     * Run the complete enhancement pipeline for a specific article
     */
    async enhanceArticle(articleSlug) {
        // Step 1: Fetch the article
        const article = await this.apiClient.getArticle(articleSlug);
        
        if (!article) {
            throw new Error(`Article not found: ${articleSlug}`);
        }

        // Step 2: Search for related articles
        const searchResults = await this.googleSearch.search(article.title);
        
        if (searchResults.length === 0) {
            throw new Error('No search results found for the article title');
        }

        // Step 3: Scrape reference articles
        const referenceArticles = [];
        
        for (const result of searchResults.slice(0, 2)) {
            const content = await this.scraper.scrapeArticle(result.url);
            
            if (content) {
                referenceArticles.push({
                    title: result.title,
                    url: result.url,
                    content: content
                });
            }
        }

        if (referenceArticles.length === 0) {
            throw new Error('Could not scrape any reference articles');
        }

        // Step 4: Enhance with LLM
        const enhancedContent = await this.llmService.enhanceArticle(article, referenceArticles);

        // Step 5: Create enhanced article
        const references = referenceArticles.map(a => ({
            title: a.title,
            url: a.url
        }));

        const enhancedArticle = await this.apiClient.createArticle({
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

        return enhancedArticle;
    }

    /**
     * Enhance all original articles that haven't been enhanced yet
     */
    async enhanceAllArticles() {
        const articles = await this.apiClient.getAllArticles();
        const originalArticles = articles.filter(a => !a.is_enhanced);
        
        const results = [];
        
        for (const article of originalArticles) {
            try {
                console.log(`Enhancing: ${article.title}`);
                const enhanced = await this.enhanceArticle(article.slug);
                results.push({
                    original: article.title,
                    enhanced: enhanced.title,
                    success: true
                });
            } catch (error) {
                console.error(`Failed to enhance "${article.title}":`, error.message);
                results.push({
                    original: article.title,
                    enhanced: null,
                    success: false,
                    error: error.message
                });
            }
        }

        return results;
    }
}

