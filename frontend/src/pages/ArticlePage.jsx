import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useArticles } from '../context/ArticleContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { 
  ArrowLeft, Calendar, User, ExternalLink, Sparkles, 
  BookOpen, Share2, Copy, Check 
} from 'lucide-react';

export default function ArticlePage() {
  const { slug } = useParams();
  const { getArticleBySlug, articles } = useArticles();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await getArticleBySlug(slug);
        
        if (data) {
          setArticle(data);
        } else {
          // Try to find in cached articles
          const cached = articles.find(a => a.slug === slug);
          if (cached) {
            setArticle(cached);
          } else {
            setError('Article not found');
          }
        }
      } catch (err) {
        setError('Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug, getArticleBySlug, articles]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = article?.published_at 
    ? new Date(article.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Unknown date';

  if (loading) {
    return (
      <div className="min-h-screen py-16">
        <LoadingSpinner message="Loading article..." />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-4">
          <ErrorMessage message={error || 'Article not found'} />
          <div className="text-center mt-6">
            <Link 
              to="/"
              className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Articles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      {/* Hero */}
      <header className="relative bg-gradient-to-br from-midnight-900 via-midnight-800 to-brand-900 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-midnight-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles
          </Link>

          {/* Enhanced badge */}
          {article.is_enhanced && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-500 to-purple-500 text-white text-sm font-semibold shadow-lg shadow-brand-500/25">
                <Sparkles className="w-4 h-4" />
                AI Enhanced Article
              </span>
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-6 leading-tight"
          >
            {article.title}
          </motion.h1>

          {/* Meta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-6 text-midnight-300"
          >
            <span className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {formattedDate}
            </span>
            {article.author && (
              <span className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {article.author}
              </span>
            )}
            {article.original_url && (
              <a 
                href={article.original_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-brand-400 transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
                Original Source
              </a>
            )}
          </motion.div>

          {/* Share button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  Link Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Link
                </>
              )}
            </button>
          </motion.div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Image */}
        {article.featured_image && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12 -mt-24 relative z-10"
          >
            <img 
              src={article.featured_image}
              alt={article.title}
              className="w-full rounded-2xl shadow-2xl"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </motion.div>
        )}

        {/* Excerpt */}
        {article.excerpt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-10 p-6 bg-gradient-to-r from-brand-50 to-purple-50 rounded-xl border-l-4 border-brand-500"
          >
            <p className="text-lg text-midnight-700 italic leading-relaxed">
              {article.excerpt}
            </p>
          </motion.div>
        )}

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* References */}
        {article.references && article.references.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 pt-8 border-t border-midnight-200"
          >
            <h2 className="flex items-center gap-2 text-2xl font-display font-semibold text-midnight-900 mb-6">
              <BookOpen className="w-6 h-6 text-brand-600" />
              References
            </h2>
            <div className="space-y-4">
              {article.references.map((ref, index) => (
                <a
                  key={index}
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-midnight-50 rounded-lg hover:bg-midnight-100 transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-brand-100 text-brand-600 rounded-lg flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-midnight-800 group-hover:text-brand-600 transition-colors">
                        {ref.title}
                      </p>
                      <p className="text-sm text-midnight-500 truncate mt-1">
                        {ref.url}
                      </p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-midnight-400 group-hover:text-brand-600 transition-colors flex-shrink-0" />
                  </div>
                </a>
              ))}
            </div>
          </motion.section>
        )}

        {/* Back to articles */}
        <div className="mt-12 pt-8 border-t border-midnight-200 text-center">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-midnight-900 hover:bg-midnight-800 text-white rounded-lg font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Articles
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

