import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, Sparkles, ExternalLink, ArrowRight } from 'lucide-react';

export default function ArticleCard({ article, index = 0 }) {
  const formattedDate = article.published_at 
    ? new Date(article.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Unknown date';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-midnight-100"
    >
      {/* Enhanced Badge */}
      {article.is_enhanced && (
        <div className="absolute top-4 right-4 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-brand-500 to-purple-500 text-white text-xs font-semibold shadow-lg shadow-brand-500/25">
            <Sparkles className="w-3.5 h-3.5" />
            AI Enhanced
          </span>
        </div>
      )}

      {/* Featured Image */}
      {article.featured_image && (
        <div className="aspect-video overflow-hidden">
          <img 
            src={article.featured_image} 
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-midnight-500 mb-3">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {formattedDate}
          </span>
          {article.author && (
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {article.author}
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-xl font-display font-semibold text-midnight-900 mb-3 group-hover:text-brand-600 transition-colors line-clamp-2">
          <Link to={`/article/${article.slug}`}>
            {article.title}
          </Link>
        </h2>

        {/* Excerpt */}
        <p className="text-midnight-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {article.excerpt || 'No excerpt available'}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-midnight-100">
          <Link 
            to={`/article/${article.slug}`}
            className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium text-sm group/link"
          >
            Read Article
            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
          </Link>

          {article.original_url && (
            <a 
              href={article.original_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-midnight-400 hover:text-midnight-600 transition-colors"
              title="View original"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* References indicator */}
        {article.references && article.references.length > 0 && (
          <div className="mt-4 pt-4 border-t border-midnight-100">
            <p className="text-xs text-midnight-500">
              📚 {article.references.length} reference{article.references.length !== 1 ? 's' : ''} cited
            </p>
          </div>
        )}
      </div>
    </motion.article>
  );
}

