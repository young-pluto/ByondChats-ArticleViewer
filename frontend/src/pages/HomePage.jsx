import { useState } from 'react';
import { motion } from 'framer-motion';
import { useArticles } from '../context/ArticleContext';
import ArticleCard from '../components/ArticleCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Sparkles, FileText, Filter } from 'lucide-react';

export default function HomePage() {
  const { articles, originalArticles, enhancedArticles, loading, error, fetchArticles } = useArticles();
  const [filter, setFilter] = useState('all'); // 'all', 'original', 'enhanced'

  const filteredArticles = filter === 'all' 
    ? articles 
    : filter === 'original' 
      ? originalArticles 
      : enhancedArticles;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-midnight-900 via-midnight-800 to-brand-900 py-20 lg:py-28">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-brand-300 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Enhanced Content
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              BeyondChats{' '}
              <span className="bg-gradient-to-r from-brand-400 to-purple-400 text-transparent bg-clip-text">
                Article Viewer
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-midnight-300 max-w-2xl mx-auto mb-8">
              Browse original articles and their AI-enhanced versions. 
              See how we combine web scraping with intelligent content improvement.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <p className="text-4xl font-bold text-white">{originalArticles.length}</p>
                <p className="text-midnight-400 text-sm mt-1">Original Articles</p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <p className="text-4xl font-bold text-brand-400">{enhancedArticles.length}</p>
                <p className="text-midnight-400 text-sm mt-1">Enhanced Articles</p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <p className="text-4xl font-bold text-purple-400">{articles.length}</p>
                <p className="text-midnight-400 text-sm mt-1">Total Articles</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 100L60 90C120 80 240 60 360 55C480 50 600 60 720 65C840 70 960 70 1080 65C1200 60 1320 50 1380 45L1440 40V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0Z" fill="#f8fafc"/>
          </svg>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-16 bg-midnight-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <button
              onClick={() => setFilter('all')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
                filter === 'all'
                  ? 'bg-midnight-900 text-white shadow-lg'
                  : 'bg-white text-midnight-600 hover:bg-midnight-100 border border-midnight-200'
              }`}
            >
              <Filter className="w-4 h-4" />
              All Articles ({articles.length})
            </button>
            <button
              onClick={() => setFilter('original')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
                filter === 'original'
                  ? 'bg-midnight-900 text-white shadow-lg'
                  : 'bg-white text-midnight-600 hover:bg-midnight-100 border border-midnight-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              Original ({originalArticles.length})
            </button>
            <button
              onClick={() => setFilter('enhanced')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
                filter === 'enhanced'
                  ? 'bg-gradient-to-r from-brand-600 to-purple-600 text-white shadow-lg shadow-brand-500/25'
                  : 'bg-white text-midnight-600 hover:bg-midnight-100 border border-midnight-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Enhanced ({enhancedArticles.length})
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <LoadingSpinner message="Loading articles..." />
          ) : error && articles.length === 0 ? (
            <ErrorMessage message={error} onRetry={fetchArticles} />
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-midnight-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-midnight-400" />
              </div>
              <h3 className="text-lg font-semibold text-midnight-800 mb-2">
                No articles found
              </h3>
              <p className="text-midnight-500">
                {filter === 'enhanced' 
                  ? 'No enhanced articles yet. Run the enhancer to create some!'
                  : 'No articles available. Run the scraper to fetch articles.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article, index) => (
                <ArticleCard 
                  key={article.id} 
                  article={article} 
                  index={index}
                  onEnhanced={() => fetchArticles()} 
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

