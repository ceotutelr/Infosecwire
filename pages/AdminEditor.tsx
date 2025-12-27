
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  Save, Eye, ArrowLeft, Image as ImageIcon, Sparkles, 
  Globe, Tag, ShieldAlert,
  Bold, Italic, List, Link as LinkIcon, Code, Quote, Table, Plus, Users, LayoutDashboard, Grid, LogOut,
  // Added FileText to fix "Cannot find name 'FileText'" error on line 133
  FileText
} from 'lucide-react';
import { articleService } from '../services/articleService';
import { Article, Author } from '../types';
import { generateArticleOutline, summarizeCVE } from '../services/geminiService';

const AdminEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const queryAuthorId = searchParams.get('authorId');

  const [loadingAI, setLoadingAI] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);

  const [article, setArticle] = useState<Partial<Article>>({
    id: id || Date.now().toString(),
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    authorId: queryAuthorId || '',
    publishedAt: new Date().toISOString(),
    featuredImage: 'https://picsum.photos/id/201/1200/600',
    tags: [],
    isFeatured: false,
    isSponsored: false,
    status: 'draft',
    cveId: ''
  });

  useEffect(() => {
    const cats = articleService.getCategories();
    const auts = articleService.getAuthors();
    setCategories(cats);
    setAuthors(auts);
    
    if (id) {
      const found = articleService.getArticles().find(a => a.id === id);
      if (found) {
        setArticle(found);
      }
    } else {
      if (cats.length > 0) setArticle(prev => ({ ...prev, category: cats[0] }));
      if (queryAuthorId) {
        setArticle(prev => ({ ...prev, authorId: queryAuthorId }));
      } else if (auts.length > 0) {
        setArticle(prev => ({ ...prev, authorId: auts[0].id }));
      }
    }
  }, [id, queryAuthorId]);

  const handleSave = () => {
    if (!article.title || !article.slug) {
      alert('Title and Slug are required');
      return;
    }
    if (!article.category) {
      alert('Please select a category');
      return;
    }
    if (!article.authorId) {
      alert('Please assign an author');
      return;
    }
    articleService.saveArticle(article as Article);
    alert('Report saved successfully');
    navigate('/admin');
  };

  const handleAISuggest = async () => {
    if (!article.title) return alert('Enter a title first');
    setLoadingAI(true);
    try {
      const outline = await generateArticleOutline(article.title);
      setArticle(prev => ({ ...prev, content: outline }));
    } catch (e) {
      console.error(e);
      alert('AI generation failed. Check API key.');
    } finally {
      setLoadingAI(false);
    }
  };

  const handleCVESummarize = async () => {
    if (!article.cveId) return alert('Enter a CVE ID (e.g., CVE-2024-1234)');
    setLoadingAI(true);
    try {
      const summary = await summarizeCVE(article.cveId);
      setArticle(prev => ({ ...prev, content: prev.content + "\n\n" + summary }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSignOut = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-400 flex flex-col fixed h-full z-10">
        <div className="p-8 flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white">
            <Plus className="h-5 w-5" />
          </div>
          <span className="text-white font-black uppercase tracking-tighter text-xl">EDITOR HUB</span>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1">
          <Link to="/admin" className="flex items-center space-x-3 p-3 hover:bg-slate-800 rounded-lg transition-colors font-medium">
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/editor" className="flex items-center space-x-3 p-3 bg-blue-600 text-white rounded-lg font-bold">
            <Plus className="h-5 w-5" />
            <span>New Report</span>
          </Link>
          <div className="pt-4 pb-2 px-3 text-[10px] font-black uppercase tracking-widest text-slate-500">Content Management</div>
          <Link to="/admin" className="flex items-center space-x-3 p-3 hover:bg-slate-800 rounded-lg transition-colors font-medium">
            <FileText className="h-5 w-5" />
            <span>Articles</span>
          </Link>
          <Link to="/admin/categories" className="flex items-center space-x-3 p-3 hover:bg-slate-800 rounded-lg transition-colors font-medium">
            <Grid className="h-5 w-5" />
            <span>Categories</span>
          </Link>
          <Link to="/admin/authors" className="flex items-center space-x-3 p-3 hover:bg-slate-800 rounded-lg transition-colors font-medium">
            <Users className="h-5 w-5" />
            <span>Authors</span>
          </Link>
        </nav>

        <div className="p-4 mt-auto border-t border-slate-800">
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center space-x-3 p-3 hover:bg-red-900/20 hover:text-red-400 rounded-lg transition-colors font-medium"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 ml-64 flex flex-col">
        {/* Editor Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center space-x-4">
            <Link to="/admin" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5 text-slate-500" />
            </Link>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Editing Report</span>
              <h1 className="text-lg font-bold text-slate-900 leading-tight truncate max-w-md">
                {article.title || 'New Untitled Intelligence Report'}
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:bg-slate-100 font-bold rounded-lg transition-all text-sm uppercase tracking-widest">
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Preview</span>
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white font-black rounded-lg hover:bg-blue-500 transition-all text-sm uppercase tracking-widest"
            >
              <Save className="h-4 w-4" />
              <span>SAVE REPORT</span>
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Editor Main Section */}
          <main className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-12">
            <div className="max-w-4xl mx-auto space-y-12">
              {/* Title Area */}
              <section>
                <input 
                  type="text" 
                  placeholder="Headline..."
                  className="w-full text-4xl lg:text-5xl font-black bg-transparent border-none focus:ring-0 placeholder-slate-200 mb-6 p-0"
                  value={article.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                    setArticle(prev => ({ ...prev, title, slug }));
                  }}
                />
                <div className="flex items-center space-x-2 text-slate-400 font-mono text-xs mb-8">
                  <span>https://infosecwire.net/article/</span>
                  <input 
                    type="text"
                    className="bg-slate-100 border-none rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 w-full"
                    value={article.slug}
                    onChange={(e) => setArticle(prev => ({ ...prev, slug: e.target.value }))}
                  />
                </div>
                
                <textarea 
                  placeholder="Report excerpt (Short summary for cards and social media)..."
                  className="w-full text-xl text-slate-600 bg-transparent border-none focus:ring-0 placeholder-slate-200 italic p-0 leading-relaxed resize-none"
                  rows={2}
                  value={article.excerpt}
                  onChange={(e) => setArticle(prev => ({ ...prev, excerpt: e.target.value }))}
                />
              </section>

              {/* AI Helper Bar */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-900">AI Intelligence Assistant</h4>
                    <p className="text-sm text-blue-700">Let Gemini generate an outline or summarize technical data.</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button 
                    disabled={loadingAI}
                    onClick={handleAISuggest}
                    className="px-4 py-2 bg-white text-blue-600 font-bold border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-xs uppercase tracking-widest disabled:opacity-50"
                  >
                    {loadingAI ? 'Working...' : 'Generate Outline'}
                  </button>
                  <button 
                    disabled={loadingAI}
                    onClick={handleCVESummarize}
                    className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-xs uppercase tracking-widest disabled:opacity-50"
                  >
                    Summarize CVE
                  </button>
                </div>
              </div>

              {/* Editor Body */}
              <section>
                <textarea 
                  placeholder="Begin writing your intelligence report here..."
                  className="w-full min-h-[500px] bg-transparent border-none focus:ring-0 p-0 text-lg leading-relaxed text-slate-800 font-medium"
                  value={article.content}
                  onChange={(e) => setArticle(prev => ({ ...prev, content: e.target.value }))}
                />
              </section>
            </div>
          </main>

          {/* Editor Sidebar */}
          <aside className="w-80 bg-white border-l border-slate-200 p-8 overflow-y-auto space-y-10">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center">
                <Globe className="h-3 w-3 mr-2" /> Publishing Settings
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Author</label>
                  <select 
                    className="w-full bg-slate-50 border-slate-200 rounded-lg text-sm font-bold"
                    value={article.authorId}
                    onChange={(e) => setArticle(prev => ({ ...prev, authorId: e.target.value }))}
                  >
                    {authors.map(a => <option key={a.id} value={a.id}>{a.name} ({a.role})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Category</label>
                  <select 
                    className="w-full bg-slate-50 border-slate-200 rounded-lg text-sm font-bold"
                    value={article.category}
                    onChange={(e) => setArticle(prev => ({ ...prev, category: e.target.value }))}
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Status</label>
                  <select 
                    className="w-full bg-slate-50 border-slate-200 rounded-lg text-sm font-bold"
                    value={article.status}
                    onChange={(e) => setArticle(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center">
                <ShieldAlert className="h-3 w-3 mr-2" /> Security Metadata
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">CVE ID</label>
                  <input 
                    type="text" 
                    placeholder="CVE-2024-XXXX"
                    className="w-full bg-slate-50 border-slate-200 rounded-lg text-sm font-mono"
                    value={article.cveId}
                    onChange={(e) => setArticle(prev => ({ ...prev, cveId: e.target.value }))}
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <input 
                    type="checkbox" 
                    className="rounded text-blue-600 focus:ring-blue-500"
                    checked={article.isFeatured}
                    onChange={(e) => setArticle(prev => ({ ...prev, isFeatured: e.target.checked }))}
                  />
                  <span className="text-sm font-bold text-slate-700">Set as Featured</span>
                </div>
                <div className="flex items-center space-x-3">
                  <input 
                    type="checkbox" 
                    className="rounded text-blue-600 focus:ring-blue-500"
                    checked={article.isSponsored}
                    onChange={(e) => setArticle(prev => ({ ...prev, isSponsored: e.target.checked }))}
                  />
                  <span className="text-sm font-bold text-slate-700">Sponsored Content</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center">
                <ImageIcon className="h-3 w-3 mr-2" /> Featured Media
              </h4>
              <div className="relative group rounded-xl overflow-hidden aspect-video bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors">
                {article.featuredImage ? (
                  <img src={article.featuredImage} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <Plus className="h-8 w-8 text-slate-300" />
                )}
              </div>
              <input 
                type="text" 
                placeholder="Image URL..."
                className="mt-3 w-full bg-slate-50 border-slate-200 rounded-lg text-xs"
                value={article.featuredImage}
                onChange={(e) => setArticle(prev => ({ ...prev, featuredImage: e.target.value }))}
              />
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center">
                <Tag className="h-3 w-3 mr-2" /> Indexing Tags
              </h4>
              <div className="flex flex-wrap gap-2 mb-3">
                {article.tags?.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg uppercase flex items-center">
                    {tag}
                    <button className="ml-2" onClick={() => setArticle(prev => ({ ...prev, tags: prev.tags?.filter(t => t !== tag) }))}>&times;</button>
                  </span>
                ))}
              </div>
              <input 
                type="text" 
                placeholder="Add tag and press Enter"
                className="w-full bg-slate-50 border-slate-200 rounded-lg text-xs"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const val = e.currentTarget.value.trim();
                    if (val && !article.tags?.includes(val)) {
                      setArticle(prev => ({ ...prev, tags: [...(prev.tags || []), val] }));
                      e.currentTarget.value = '';
                    }
                  }
                }}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default AdminEditor;
