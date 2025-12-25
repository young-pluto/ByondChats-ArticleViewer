import { Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-midnight-900 text-midnight-300 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-display text-lg font-semibold text-white mb-4">
              About This Project
            </h3>
            <p className="text-sm leading-relaxed text-midnight-400">
              A full-stack application demonstrating web scraping, API development, 
              and AI-powered content enhancement. Built with Laravel, Node.js, and React.
            </p>
          </div>

          {/* Tech Stack */}
          <div>
            <h3 className="font-display text-lg font-semibold text-white mb-4">
              Tech Stack
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-brand-500 rounded-full"></span>
                Laravel 10 (Backend API)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Node.js (Article Enhancer)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                React 18 (Frontend)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                OpenAI GPT-4 (LLM)
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-display text-lg font-semibold text-white mb-4">
              Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://beyondchats.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-brand-400 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  BeyondChats
                </a>
              </li>
              <li>
                <a 
                  href="https://beyondchats.com/blogs/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-brand-400 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Original Blog
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-midnight-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-midnight-500">
            © {new Date().getFullYear()} BeyondChats Article Project. All rights reserved.
          </p>
          <p className="text-sm text-midnight-500 flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for BeyondChats
          </p>
        </div>
      </div>
    </footer>
  );
}

