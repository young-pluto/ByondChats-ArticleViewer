<?php

namespace App\Services;

use App\Models\Article;
use GuzzleHttp\Client;
use Symfony\Component\DomCrawler\Crawler;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class ArticleScraperService
{
    protected Client $client;
    protected string $baseUrl = 'https://beyondchats.com/blogs/';

    public function __construct()
    {
        $this->client = new Client([
            'timeout' => 30,
            'headers' => [
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language' => 'en-US,en;q=0.5',
            ],
        ]);
    }

    /**
     * Scrape the 5 oldest articles from BeyondChats blog.
     */
    public function scrapeOldestArticles(int $count = 5): array
    {
        $articles = [];
        
        try {
            // Get the last page of blogs (oldest articles)
            $lastPageUrl = $this->getLastPageUrl();
            Log::info("Scraping from: {$lastPageUrl}");
            
            // Get article links from the last page
            $articleLinks = $this->getArticleLinksFromPage($lastPageUrl);
            Log::info("Found " . count($articleLinks) . " article links");
            
            // Take only the last 5 (oldest) articles
            $articleLinks = array_slice($articleLinks, -$count);
            
            // Scrape each article
            foreach ($articleLinks as $link) {
                try {
                    $articleData = $this->scrapeArticle($link);
                    if ($articleData) {
                        $articles[] = $articleData;
                        Log::info("Scraped: {$articleData['title']}");
                    }
                } catch (\Exception $e) {
                    Log::error("Failed to scrape article: {$link} - " . $e->getMessage());
                }
            }
        } catch (\Exception $e) {
            Log::error("Scraping failed: " . $e->getMessage());
        }

        return $articles;
    }

    /**
     * Get the URL of the last page of the blog.
     */
    protected function getLastPageUrl(): string
    {
        $response = $this->client->get($this->baseUrl);
        $html = (string) $response->getBody();
        $crawler = new Crawler($html);

        // Try to find pagination and get the last page
        $lastPageLink = $crawler->filter('.pagination a, .page-numbers a, a[rel="next"]')->last();
        
        if ($lastPageLink->count() > 0) {
            // Try to find the actual last page
            $paginationLinks = $crawler->filter('.pagination a, .page-numbers a')->each(function (Crawler $node) {
                return [
                    'href' => $node->attr('href'),
                    'text' => trim($node->text()),
                ];
            });

            // Find the highest page number
            $maxPage = 1;
            $lastPageUrl = $this->baseUrl;
            
            foreach ($paginationLinks as $link) {
                if (is_numeric($link['text']) && (int)$link['text'] > $maxPage) {
                    $maxPage = (int)$link['text'];
                    $lastPageUrl = $link['href'];
                }
            }

            return $lastPageUrl ?: $this->baseUrl;
        }

        // If no pagination, return the base URL
        return $this->baseUrl;
    }

    /**
     * Get all article links from a page.
     */
    protected function getArticleLinksFromPage(string $pageUrl): array
    {
        $response = $this->client->get($pageUrl);
        $html = (string) $response->getBody();
        $crawler = new Crawler($html);

        $links = [];

        // Common selectors for blog article links
        $selectors = [
            'article a',
            '.blog-post a',
            '.post a',
            '.entry a',
            'h2 a',
            'h3 a',
            '.card a',
            '.blog-card a',
            'a.post-link',
            '.article-link',
        ];

        foreach ($selectors as $selector) {
            $crawler->filter($selector)->each(function (Crawler $node) use (&$links) {
                $href = $node->attr('href');
                if ($href && !in_array($href, $links)) {
                    // Filter to only include article URLs (not category, tag, etc.)
                    if (strpos($href, '/blogs/') !== false || strpos($href, '/blog/') !== false) {
                        $links[] = $href;
                    }
                }
            });
        }

        return array_unique($links);
    }

    /**
     * Scrape a single article.
     */
    public function scrapeArticle(string $url): ?array
    {
        $response = $this->client->get($url);
        $html = (string) $response->getBody();
        $crawler = new Crawler($html);

        // Extract title
        $title = $this->extractText($crawler, [
            'h1',
            '.entry-title',
            '.post-title',
            '.article-title',
            'article h1',
            '.blog-title',
        ]);

        if (!$title) {
            return null;
        }

        // Extract content
        $content = $this->extractHtml($crawler, [
            '.entry-content',
            '.post-content',
            '.article-content',
            'article .content',
            '.blog-content',
            'main article',
            '.prose',
        ]);

        // Extract author
        $author = $this->extractText($crawler, [
            '.author-name',
            '.post-author',
            '.entry-author',
            'a[rel="author"]',
            '.byline',
        ]);

        // Extract featured image
        $featuredImage = $this->extractAttribute($crawler, [
            '.featured-image img',
            '.post-thumbnail img',
            'article img',
            '.entry-image img',
        ], 'src');

        // Extract excerpt/description
        $excerpt = $this->extractText($crawler, [
            '.excerpt',
            '.post-excerpt',
            'meta[name="description"]',
        ]);

        if (!$excerpt) {
            // Generate excerpt from content
            $excerpt = Str::limit(strip_tags($content), 200);
        }

        // Extract published date
        $publishedAt = $this->extractText($crawler, [
            'time',
            '.published',
            '.post-date',
            '.entry-date',
        ]);

        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'content' => $content,
            'excerpt' => $excerpt,
            'author' => $author ?: 'BeyondChats',
            'original_url' => $url,
            'featured_image' => $featuredImage,
            'published_at' => $this->parseDate($publishedAt),
            'is_enhanced' => false,
        ];
    }

    /**
     * Extract text from multiple selectors.
     */
    protected function extractText(Crawler $crawler, array $selectors): ?string
    {
        foreach ($selectors as $selector) {
            try {
                $node = $crawler->filter($selector)->first();
                if ($node->count() > 0) {
                    $text = trim($node->text());
                    if (!empty($text)) {
                        return $text;
                    }
                }
            } catch (\Exception $e) {
                continue;
            }
        }
        return null;
    }

    /**
     * Extract HTML from multiple selectors.
     */
    protected function extractHtml(Crawler $crawler, array $selectors): string
    {
        foreach ($selectors as $selector) {
            try {
                $node = $crawler->filter($selector)->first();
                if ($node->count() > 0) {
                    return $node->html();
                }
            } catch (\Exception $e) {
                continue;
            }
        }
        return '';
    }

    /**
     * Extract attribute from multiple selectors.
     */
    protected function extractAttribute(Crawler $crawler, array $selectors, string $attribute): ?string
    {
        foreach ($selectors as $selector) {
            try {
                $node = $crawler->filter($selector)->first();
                if ($node->count() > 0) {
                    return $node->attr($attribute);
                }
            } catch (\Exception $e) {
                continue;
            }
        }
        return null;
    }

    /**
     * Parse date string to datetime.
     */
    protected function parseDate(?string $dateString): ?\DateTime
    {
        if (!$dateString) {
            return new \DateTime();
        }

        try {
            return new \DateTime($dateString);
        } catch (\Exception $e) {
            return new \DateTime();
        }
    }

    /**
     * Save scraped articles to database.
     */
    public function saveArticles(array $articles): int
    {
        $count = 0;
        
        foreach ($articles as $articleData) {
            // Check if article already exists
            $exists = Article::where('slug', $articleData['slug'])
                ->orWhere('original_url', $articleData['original_url'])
                ->exists();

            if (!$exists) {
                Article::create($articleData);
                $count++;
            }
        }

        return $count;
    }
}

