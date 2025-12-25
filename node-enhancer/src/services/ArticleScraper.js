import axios from 'axios';
import * as cheerio from 'cheerio';

export class ArticleScraper {
    constructor() {
        this.client = axios.create({
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            }
        });
    }

    /**
     * Scrape article content from a URL
     */
    async scrapeArticle(url) {
        try {
            const response = await this.client.get(url);
            const html = response.data;
            const $ = cheerio.load(html);

            // Remove unwanted elements
            $('script, style, nav, header, footer, aside, .sidebar, .comments, .advertisement, .ad, .social-share, .related-posts').remove();

            // Try multiple selectors for article content
            const contentSelectors = [
                'article',
                '.post-content',
                '.entry-content',
                '.article-content',
                '.blog-content',
                '.content',
                'main',
                '.prose',
                '[role="main"]'
            ];

            let content = '';

            for (const selector of contentSelectors) {
                const element = $(selector);
                if (element.length > 0) {
                    content = this.extractText(element);
                    if (content.length > 200) {
                        break;
                    }
                }
            }

            // Fallback to body if no content found
            if (!content || content.length < 200) {
                content = this.extractText($('body'));
            }

            // Clean up the content
            content = this.cleanContent(content);

            return content.length > 100 ? content : null;
        } catch (error) {
            console.error(`Failed to scrape ${url}:`, error.message);
            return null;
        }
    }

    /**
     * Extract text from a cheerio element
     */
    extractText(element) {
        // Get all text, preserving paragraph structure
        let text = '';
        
        element.find('p, h1, h2, h3, h4, h5, h6, li').each((i, el) => {
            const elText = cheerio.load(el).text().trim();
            if (elText) {
                text += elText + '\n\n';
            }
        });

        if (!text) {
            text = element.text();
        }

        return text;
    }

    /**
     * Clean up scraped content
     */
    cleanContent(content) {
        return content
            // Remove multiple newlines
            .replace(/\n{3,}/g, '\n\n')
            // Remove multiple spaces
            .replace(/  +/g, ' ')
            // Remove leading/trailing whitespace from each line
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .join('\n')
            // Limit content length
            .substring(0, 10000)
            .trim();
    }

    /**
     * Extract metadata from a page
     */
    async scrapeMetadata(url) {
        try {
            const response = await this.client.get(url);
            const html = response.data;
            const $ = cheerio.load(html);

            return {
                title: $('title').text() || $('h1').first().text() || '',
                description: $('meta[name="description"]').attr('content') || 
                            $('meta[property="og:description"]').attr('content') || '',
                author: $('meta[name="author"]').attr('content') || 
                       $('.author-name').text() || 
                       $('[rel="author"]').text() || '',
                publishedDate: $('meta[property="article:published_time"]').attr('content') || 
                              $('time').attr('datetime') || '',
                image: $('meta[property="og:image"]').attr('content') || 
                      $('article img').first().attr('src') || ''
            };
        } catch (error) {
            console.error(`Failed to scrape metadata from ${url}:`, error.message);
            return null;
        }
    }
}

