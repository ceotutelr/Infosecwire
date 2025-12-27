
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Tag, ExternalLink, Mail, CheckCircle } from 'lucide-react';
import { Article, Category } from '../types';
import { format } from 'date-fns';

export const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
  return (
    <article className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 flex flex-col h-full">
      <Link to={`/article/${article.slug}`} className="relative h-56 overflow-hidden block">
        <img 
          src={article.featuredImage} 
          alt={article.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded shadow-lg">
            {article.category}
          </span>
        </div>
        {article.isSponsored && (
          <div className="absolute bottom-4 right-4">
            <span className="px-2 py-0.5 bg-yellow-400 text-slate-900 text-[9px] font-bold uppercase rounded shadow-sm">
              Sponsored
            </span>
          </div>
        )}
      </Link>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center space-x-4 text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-widest">
          <span className="flex items-center"><Calendar className="h-3.5 w-3.5 mr-1" /> {format(new Date(article.publishedAt), 'MMM dd, yyyy')}</span>
          {article.cveId && <span className="text-red-500 font-mono">{article.cveId}</span>}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
          <Link to={`/article/${article.slug}`}>{article.title}</Link>
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1 line-clamp-3 font-medium">
          {article.excerpt}
        </p>
        <Link 
          to={`/article/${article.slug}`}
          className="inline-flex items-center text-[11px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-[0.2em]"
        >
          Explore Report <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </article>
  );
};

export const Sidebar: React.FC<{ trending: Article[] }> = ({ trending }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <aside className="space-y-10">
      {/* Newsletter Signup */}
      <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl"></div>
        
        {!subscribed ? (
          <>
            <h3 className="text-xl font-black uppercase tracking-tight mb-4 flex items-center">
              <Mail className="h-5 w-5 mr-2 text-blue-500" />
              Threat Intel Daily
            </h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed font-medium">
              Join 65,000+ security experts. Get critical breach alerts and zero-day analysis every morning.
            </p>
            <form className="space-y-3" onSubmit={handleSubscribe}>
              <input 
                required
                type="email" 
                placeholder="professional@email.com" 
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 font-black uppercase tracking-widest transition-all rounded-xl text-xs shadow-lg shadow-blue-900/40 active:scale-95">
                SUBSCRIBE NOW
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6 animate-in zoom-in duration-300">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-black uppercase tracking-tight mb-2">You're In</h3>
            <p className="text-slate-400 text-sm">Check your inbox for the latest intel brief.</p>
            <button onClick={() => setSubscribed(false)} className="mt-4 text-xs font-bold text-slate-500 hover:text-white uppercase tracking-widest underline">Reset</button>
          </div>
        )}
      </div>

      {/* Trending News */}
      <div>
        <h3 className="text-sm font-black uppercase border-b-4 border-blue-600 inline-block mb-8 tracking-[0.2em] text-slate-900">Trending Now</h3>
        <div className="space-y-8">
          {trending.map((article, i) => (
            <div key={article.id} className="flex space-x-4 items-start group">
              <span className="text-4xl font-black text-slate-100 group-hover:text-blue-100 transition-colors leading-none font-mono">{(i + 1).toString().padStart(2, '0')}</span>
              <div className="flex-1">
                <Link 
                  to={`/article/${article.slug}`}
                  className="text-sm font-bold text-slate-800 leading-snug hover:text-blue-600 transition-colors line-clamp-2"
                >
                  {article.title}
                </Link>
                <div className="mt-2 text-[9px] font-black text-blue-600 uppercase tracking-widest">
                  {article.category}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sponsored Ad */}
      <div className="group relative bg-slate-100 border-2 border-slate-200 p-8 text-center rounded-3xl overflow-hidden cursor-pointer">
        <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 block">Sponsored Promotion</span>
        <h4 className="text-lg font-black text-slate-800 mb-2 leading-tight">Secure Your Cloud Infrastructure with Sentrix AI</h4>
        <p className="text-xs text-slate-500 font-medium mb-6">The next generation of autonomous cloud security is here.</p>
        <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b-2 border-blue-600 pb-0.5">Learn More</button>
      </div>
    </aside>
  );
};
