<?php

namespace App\Console\Commands;

use App\Services\ArticleScraperService;
use Illuminate\Console\Command;

class ScrapeArticles extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'articles:scrape {--count=5 : Number of oldest articles to scrape}';

    /**
     * The console command description.
     */
    protected $description = 'Scrape the oldest articles from BeyondChats blog';

    /**
     * Execute the console command.
     */
    public function handle(ArticleScraperService $scraper): int
    {
        $count = (int) $this->option('count');
        
        $this->info("Starting to scrape {$count} oldest articles from BeyondChats...");
        
        $articles = $scraper->scrapeOldestArticles($count);
        
        if (empty($articles)) {
            $this->error('No articles were scraped. Please check the logs.');
            return Command::FAILURE;
        }

        $this->info("Found " . count($articles) . " articles. Saving to database...");
        
        $saved = $scraper->saveArticles($articles);
        
        $this->info("Successfully saved {$saved} new articles to the database.");
        
        // Display scraped articles
        $this->table(
            ['Title', 'Author', 'URL'],
            array_map(function ($article) {
                return [
                    substr($article['title'], 0, 50) . '...',
                    $article['author'],
                    substr($article['original_url'], 0, 40) . '...',
                ];
            }, $articles)
        );

        return Command::SUCCESS;
    }
}

