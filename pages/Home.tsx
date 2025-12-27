
import React, { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { Shield, ArrowRight, Zap, TrendingUp, Calendar, Search as SearchIcon } from 'lucide-react';
import { articleService } from '../services/articleService';
import { Article } from '../types';
import { ArticleCard, Sidebar } from '../components/NewsComponents';
import { format } from 'date-fns';

const Home: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q');

  const [articles, setArticles] = useState<Article[]>([]);
  const [displayArticles, setDisplayArticles] = useState<Article[]>([]);
  
  useEffect(() => {
    const allArticles = articleService.getArticles().filter(a => a.status === 'published');
    setArticles(allArticles);

    let filtered = [...allArticles];
    
    if (category) {
      filtered = allArticles.filter(a => 
        a.category.toLowerCase().replace(/ /g, '-') === category.toLowerCase()
      );
    } else if (query) {
      filtered = articleService.searchArticles(query);
    }

    setDisplayArticles(filtered);
    window.scrollTo(0, 0);
  }, [category, query]);

  const featuredArticle = displayArticles.find(a => a.isFeatured) || articles.find(a => a.isFeatured);
  const regularArticles = displayArticles.filter(a => a.id !== featuredArticle?.id);
  const trendingArticles = articles.slice(0, 5);

  return (
    <main className="min-h-screen">
      {/* Breaking News Banner */}
      <div className="bg-blue-600 text-white py-3 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center">
          <span className="flex items-center text-[10px] font-black uppercase tracking-widest bg-white text-blue-600 px-2 py-1 rounded mr-4 whitespace-nowrap">
            <Zap className="h-3 w-3 mr-1 fill-current" /> Breaking
          </span>
          <div className="text-sm font-bold truncate animate-pulse">
            {featuredArticle?.title || "Monitoring global threat landscape for new exploits..."}
          </div>
        </div>
      </div>

      {/* Hero Section - Only show on main home or if featured matches search */}
      {featuredArticle && !query && (
        <section className="bg-slate-900 py-12 lg:py-20 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7">
                <div className="flex items-center space-x-3 text-blue-400 mb-6 font-bold uppercase tracking-widest text-xs">
                  <Shield className="h-4 w-4" />
                  <span>Featured Intelligence</span>
                </div>
                <h1 className="text-4xl lg:text-6xl font-black mb-8 leading-[1.1] tracking-tight">
                  {featuredArticle.title}
                </h1>
                <p className="text-xl text-slate-400 mb-10 leading-relaxed font-medium">
                  {featuredArticle.excerpt}
                </p>
                <div className="flex flex-wrap items-center gap-6">
                  <Link 
                    to={`/article/${featuredArticle.slug}`}
                    className="px-8 py-4 bg-white text-slate-900 font-black rounded-lg hover:bg-slate-200 transition-all uppercase tracking-widest flex items-center"
                  >
                    Read Story <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <div className="flex items-center text-slate-500 font-bold uppercase tracking-widest text-xs">
                    <Calendar className="h-4 w-4 mr-2" />
                    {format(new Date(featuredArticle.publishedAt), 'MMMM dd, yyyy')}
                  </div>
                </div>
              </div>
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl transform lg:rotate-2 hover:rotate-0 transition-transform duration-700">
                  <img 
                    src={featuredArticle.featuredImage} 
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover aspect-[4/3]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent opacity-60"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content Grid */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {query && (
            <div className="mb-12">
              <h1 className="text-3xl font-black text-slate-900 uppercase">Search Results for: <span className="text-blue-600">"{query}"</span></h1>
              <p className="text-slate-500 mt-2">{displayArticles.length} matches found in the archive.</p>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* News Feed */}
            <div className="lg:w-2/3">
              <div className="flex items-center justify-between mb-12 border-b border-slate-200 pb-6">
                <h2 className="text-2xl font-black uppercase tracking-tight flex items-center">
                  <TrendingUp className="h-6 w-6 mr-3 text-blue-600" />
                  {category ? category.replace(/-/g, ' ') : 'Latest Intelligence'}
                </h2>
                <div className="hidden sm:flex space-x-6 text-sm font-bold uppercase tracking-widest text-slate-400">
                  <Link to="/" className={`${!category ? 'text-blue-600' : 'hover:text-blue-600'}`}>All</Link>
                  <button className="hover:text-blue-600">Critical</button>
                  <button className="hover:text-blue-600">Archive</button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {regularArticles.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>

              {displayArticles.length === 0 && (
                <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm px-6">
                  <div className="mb-6 inline-block p-6 bg-slate-50 rounded-full text-slate-300">
                    <SearchIcon className="h-16 w-16" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase mb-3">No Results Found</h3>
                  <p className="text-slate-500 max-w-md mx-auto">
                    Our database doesn't have any intelligence matching your criteria. Try different keywords or check our major categories.
                  </p>
                  <Link to="/" className="mt-8 inline-block px-8 py-3 bg-slate-900 text-white font-bold rounded-lg uppercase tracking-widest hover:bg-slate-800 transition-colors">
                    Reset Search
                  </Link>
                </div>
              )}

              {displayArticles.length > 0 && (
                <div className="mt-16 text-center">
                  <button className="px-12 py-5 border-2 border-slate-900 text-slate-900 font-black rounded-xl hover:bg-slate-900 hover:text-white transition-all uppercase tracking-[0.2em] text-xs">
                    View More Reports
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3">
              <Sidebar trending={trendingArticles} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
