import axios from 'axios';

export class GoogleSearchService {
    constructor(serperApiKey) {
        this.serperApiKey = serperApiKey;
        this.useSerperApi = !!serperApiKey;
    }

    /**
     * Search Google for a query and return relevant article links
     */
    async search(query) {
        if (this.useSerperApi) {
            return this.searchWithSerper(query);
        }
        
        // Fallback to DuckDuckGo if no Serper API key
        return this.searchWithDuckDuckGo(query);
    }

    /**
     * Search using Serper.dev API (Google Search API)
     */
    async searchWithSerper(query) {
        try {
            const response = await axios.post(
                'https://google.serper.dev/search',
                {
                    q: query,
                    num: 10,
                    type: 'search'
                },
                {
                    headers: {
                        'X-API-KEY': this.serperApiKey,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const results = response.data.organic || [];
            
            // Filter to get only blog/article links (not the original site)
            const filteredResults = results
                .filter(result => {
                    const url = result.link.toLowerCase();
                    // Exclude beyondchats.com and common non-article pages
                    return !url.includes('beyondchats.com') &&
                           !url.includes('wikipedia.org') &&
                           !url.includes('youtube.com') &&
                           !url.includes('twitter.com') &&
                           !url.includes('facebook.com') &&
                           !url.includes('linkedin.com/feed') &&
                           !url.includes('/search?') &&
                           !url.includes('/tag/') &&
                           !url.includes('/category/');
                })
                .map(result => ({
                    title: result.title,
                    url: result.link,
                    snippet: result.snippet
                }));

            return filteredResults.slice(0, 5);
        } catch (error) {
            console.error('Serper API error:', error.message);
            // Fallback to DuckDuckGo
            return this.searchWithDuckDuckGo(query);
        }
    }

    /**
     * Search using DuckDuckGo (free alternative)
     */
    async searchWithDuckDuckGo(query) {
        try {
            const encodedQuery = encodeURIComponent(query);
            const response = await axios.get(
                `https://api.duckduckgo.com/?q=${encodedQuery}&format=json&no_html=1`,
                {
                    timeout: 10000
                }
            );

            const results = [];
            
            // DuckDuckGo returns related topics
            if (response.data.RelatedTopics) {
                for (const topic of response.data.RelatedTopics) {
                    if (topic.FirstURL && topic.Text) {
                        // Filter out beyondchats and non-article pages
                        if (!topic.FirstURL.includes('beyondchats.com')) {
                            results.push({
                                title: topic.Text.substring(0, 100),
                                url: topic.FirstURL,
                                snippet: topic.Text
                            });
                        }
                    }
                }
            }

            // If DuckDuckGo doesn't return enough results, return sample tech blog URLs
            if (results.length < 2) {
                return this.getFallbackResults(query);
            }

            return results.slice(0, 5);
        } catch (error) {
            console.error('DuckDuckGo API error:', error.message);
            return this.getFallbackResults(query);
        }
    }

    /**
     * Fallback results when APIs fail
     */
    getFallbackResults(query) {
        // Return some general tech/AI blog URLs as fallback
        console.log('⚠️ Using fallback search results');
        return [
            {
                title: 'Understanding AI Chatbots - Medium',
                url: 'https://medium.com/tag/chatbot',
                snippet: 'Articles about AI chatbots and customer service automation'
            },
            {
                title: 'Customer Service AI Trends - HubSpot',
                url: 'https://blog.hubspot.com/service/ai-customer-service',
                snippet: 'How AI is transforming customer service'
            }
        ];
    }
}

