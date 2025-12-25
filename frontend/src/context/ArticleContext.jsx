import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ArticleContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export function ArticleProvider({ children }) {
  const [articles, setArticles] = useState([]);
  const [originalArticles, setOriginalArticles] = useState([]);
  const [enhancedArticles, setEnhancedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/articles`);
      
      if (response.data.success) {
        const allArticles = response.data.data.data || response.data.data;
        setArticles(allArticles);
        setOriginalArticles(allArticles.filter(a => !a.is_enhanced));
        setEnhancedArticles(allArticles.filter(a => a.is_enhanced));
      }
    } catch (err) {
      console.error('Failed to fetch articles:', err);
      setError('Failed to load articles. Please make sure the API is running.');
      
      // Set demo data for development
      const demoArticles = getDemoArticles();
      setArticles(demoArticles);
      setOriginalArticles(demoArticles.filter(a => !a.is_enhanced));
      setEnhancedArticles(demoArticles.filter(a => a.is_enhanced));
    } finally {
      setLoading(false);
    }
  };

  const getArticleBySlug = async (slug) => {
    // First check if we already have the article in state
    const cachedArticle = articles.find(a => a.slug === slug);
    if (cachedArticle) {
      return cachedArticle;
    }
    
    // If not in state, try to fetch from API
    try {
      const response = await axios.get(`${API_URL}/articles/${slug}`);
      
      if (response.data.success) {
        return response.data.data;
      }
      
      return null;
    } catch (err) {
      console.error('Failed to fetch article:', err);
      // Return from articles list as fallback
      return articles.find(a => a.slug === slug) || null;
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <ArticleContext.Provider value={{
      articles,
      originalArticles,
      enhancedArticles,
      loading,
      error,
      fetchArticles,
      getArticleBySlug
    }}>
      {children}
    </ArticleContext.Provider>
  );
}

export function useArticles() {
  const context = useContext(ArticleContext);
  if (!context) {
    throw new Error('useArticles must be used within an ArticleProvider');
  }
  return context;
}

// Demo articles for development/preview
function getDemoArticles() {
  return [
    {
      id: 1,
      title: 'How AI is Transforming Customer Service',
      slug: 'how-ai-is-transforming-customer-service',
      content: '<p>Artificial Intelligence is revolutionizing the way businesses interact with their customers...</p>',
      excerpt: 'Discover how AI-powered chatbots and virtual assistants are changing the customer service landscape.',
      author: 'BeyondChats',
      original_url: 'https://beyondchats.com/blogs/ai-customer-service',
      featured_image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800',
      published_at: '2024-01-15T10:00:00Z',
      is_enhanced: false,
      references: null
    },
    {
      id: 2,
      title: 'How AI is Transforming Customer Service (Enhanced)',
      slug: 'how-ai-is-transforming-customer-service-enhanced',
      content: '<h2>Introduction</h2><p>In today\'s digital age, Artificial Intelligence has become a cornerstone of modern customer service...</p>',
      excerpt: 'An enhanced, comprehensive guide to AI in customer service with industry insights.',
      author: 'BeyondChats',
      original_url: 'https://beyondchats.com/blogs/ai-customer-service',
      featured_image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800',
      published_at: '2024-01-16T10:00:00Z',
      is_enhanced: true,
      references: [
        { title: 'The Future of AI in Business', url: 'https://example.com/ai-business' },
        { title: 'Customer Service Trends 2024', url: 'https://example.com/cs-trends' }
      ]
    },
    {
      id: 3,
      title: 'Building Effective Chatbots for Your Business',
      slug: 'building-effective-chatbots',
      content: '<p>Creating a chatbot that truly helps customers requires careful planning and execution...</p>',
      excerpt: 'A practical guide to designing and implementing chatbots that deliver real value.',
      author: 'BeyondChats',
      original_url: 'https://beyondchats.com/blogs/effective-chatbots',
      featured_image: 'https://images.unsplash.com/photo-1676299081847-824916de030a?w=800',
      published_at: '2024-01-10T10:00:00Z',
      is_enhanced: false,
      references: null
    }
  ];
}

