
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Share2, MessageSquare, Clock, ChevronRight, ShieldCheck } from 'lucide-react';
import { articleService } from '../services/articleService';
import { Article, Author } from '../types';
import { format } from 'date-fns';

const ArticleView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [authors, setAuthors] = useState<Author[]>([]);
  
  const author = authors.find(a => a.id === article?.authorId);

  useEffect(() => {
    setAuthors(articleService.getAuthors());
    if (slug) {
      const found = articleService.getArticleBySlug(slug);
      setArticle(found || null);
      window.scrollTo(0, 0);
    }
  }, [slug]);

  if (!article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-3xl font-black mb-4">404: Intel Not Found</h2>
        <p className="text-slate-500 mb-8 max-w-md">The requested report could not be found or may have been classified.</p>
        <Link to="/" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg uppercase tracking-widest">Return Home</Link>
      </div>
    );
  }

  return (
    <article className="bg-white">
      {/* Article Header */}
      <header className="bg-slate-900 text-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex items-center space-x-2 text-blue-400 font-bold uppercase tracking-widest text-xs mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to={`/category/${article.category.toLowerCase().replace(/ /g, '-')}`} className="hover:text-white transition-colors">{article.category}</Link>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight tracking-tight">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-400">
            <div className="flex items-center space-x-3">
              <img src={author?.avatar} className="w-10 h-10 rounded-full border-2 border-slate-700 object-cover" alt={author?.name} />
              <div>
                <span className="block text-white font-bold">{author?.name || 'Staff Reporter'}</span>
                <span className="text-[10px] uppercase tracking-widest text-blue-500">{author?.role || 'Intelligence'}</span>
              </div>
            </div>
            <div className="flex items-center"><Calendar className="h-4 w-4 mr-1.5" /> {format(new Date(article.publishedAt), 'MMMM dd, yyyy')}</div>
            <div className="flex items-center"><Clock className="h-4 w-4 mr-1.5" /> 6 min read</div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 -mt-10 mb-20">
        {/* Featured Image */}
        <div className="rounded-2xl overflow-hidden shadow-2xl mb-12 bg-slate-100">
          <img src={article.featuredImage} className="w-full h-auto object-cover max-h-[500px]" alt={article.title} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Social Sticky */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-32 space-y-6">
              <button className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-50 border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all">
                <Share2 className="h-5 w-5" />
              </button>
              <button className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-50 border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all">
                <MessageSquare className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-11">
            <div className="prose prose-lg max-w-none text-slate-800 leading-relaxed font-medium">
              <div className="whitespace-pre-wrap space-y-6">
                {article.content.split('\n\n').map((para, i) => {
                  if (para.startsWith('## ')) return <h2 key={i} className="text-3xl font-black text-slate-900 mt-12 mb-6 border-l-4 border-blue-600 pl-4 uppercase tracking-tight">{para.replace('## ', '')}</h2>;
                  if (para.startsWith('### ')) return <h3 key={i} className="text-2xl font-bold text-slate-900 mt-8 mb-4">{para.replace('### ', '')}</h3>;
                  if (para.startsWith('* ')) return (
                    <ul key={i} className="list-disc pl-6 space-y-2">
                      {para.split('\n').map((li, j) => <li key={j}>{li.replace('* ', '')}</li>)}
                    </ul>
                  );
                  return <p key={i} className="mb-6">{para}</p>;
                })}
              </div>
            </div>

            {/* CVE Widget if applicable */}
            {article.cveId && (
              <div className="mt-12 p-8 bg-slate-50 border border-slate-200 rounded-2xl flex items-start space-x-6">
                <div className="bg-red-100 p-4 rounded-xl text-red-600">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-widest text-slate-400 text-xs mb-2">Vulnerability Analysis</h4>
                  <div className="text-2xl font-mono font-bold text-slate-900 mb-2">{article.cveId}</div>
                  <p className="text-slate-600 text-sm">
                    This vulnerability is categorized as CRITICAL SEVERITY. Organizations are advised to apply patches released in the latest advisory immediately.
                  </p>
                </div>
              </div>
            )}

            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap gap-2">
              {article.tags.map(tag => (
                <span key={tag} className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider hover:bg-slate-200 cursor-pointer transition-colors">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Author Bio */}
            {author && (
              <div className="mt-16 p-8 bg-slate-900 rounded-2xl text-white flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                <img src={author.avatar} className="w-24 h-24 rounded-2xl object-cover" alt={author.name} />
                <div>
                  <div className="text-blue-500 text-[10px] font-black uppercase tracking-widest mb-2">About The Author</div>
                  <h3 className="text-2xl font-black mb-4 uppercase">{author.name}</h3>
                  <p className="text-slate-400 leading-relaxed italic">
                    "{author.bio}"
                  </p>
                  <button className="mt-6 text-sm font-bold text-white uppercase tracking-widest flex items-center hover:text-blue-400 transition-colors">
                    View Author Profile <ChevronRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticleView;
