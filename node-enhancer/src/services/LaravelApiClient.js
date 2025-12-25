import axios from 'axios';

export class LaravelApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.client = axios.create({
            baseURL: baseUrl,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 30000
        });
    }

    /**
     * Get the latest original article from the API
     */
    async getLatestArticle() {
        try {
            const response = await this.client.get('/articles/latest');
            
            if (response.data.success && response.data.data) {
                return response.data.data;
            }
            
            return null;
        } catch (error) {
            if (error.response?.status === 404) {
                return null;
            }
            throw new Error(`Failed to fetch latest article: ${error.message}`);
        }
    }

    /**
     * Get all articles from the API
     */
    async getAllArticles() {
        try {
            const response = await this.client.get('/articles');
            
            if (response.data.success) {
                return response.data.data.data || response.data.data;
            }
            
            return [];
        } catch (error) {
            throw new Error(`Failed to fetch articles: ${error.message}`);
        }
    }

    /**
     * Get a specific article by slug
     */
    async getArticle(slug) {
        try {
            const response = await this.client.get(`/articles/${slug}`);
            
            if (response.data.success) {
                return response.data.data;
            }
            
            return null;
        } catch (error) {
            throw new Error(`Failed to fetch article: ${error.message}`);
        }
    }

    /**
     * Create a new article
     */
    async createArticle(articleData) {
        try {
            const response = await this.client.post('/articles', articleData);
            
            if (response.data.success) {
                return response.data.data;
            }
            
            throw new Error('Failed to create article');
        } catch (error) {
            if (error.response?.data?.message) {
                throw new Error(`Failed to create article: ${error.response.data.message}`);
            }
            throw new Error(`Failed to create article: ${error.message}`);
        }
    }

    /**
     * Update an existing article
     */
    async updateArticle(slug, articleData) {
        try {
            const response = await this.client.put(`/articles/${slug}`, articleData);
            
            if (response.data.success) {
                return response.data.data;
            }
            
            throw new Error('Failed to update article');
        } catch (error) {
            throw new Error(`Failed to update article: ${error.message}`);
        }
    }

    /**
     * Check API health
     */
    async healthCheck() {
        try {
            const response = await this.client.get('/health');
            return response.data.success;
        } catch (error) {
            return false;
        }
    }
}

