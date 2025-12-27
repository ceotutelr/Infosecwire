
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, Plus, Search, 
  Users, BarChart, LogOut, 
  Edit3, Trash2, Eye, 
  CheckCircle2, Clock, FileWarning, Zap, Grid,
  Calendar, FileEdit
} from 'lucide-react';
import { articleService } from '../services/articleService';
import { authService } from '../services/authService';
import { Article, Author } from '../types';
import { format } from 'date-fns';

const AdminDashboard: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    setArticles(articleService.getArticles());
    setAuthors(articleService.getAuthors());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Permanently delete this intelligence report?')) {
      articleService.deleteArticle(id);
      setArticles(articleService.getArticles());
    }
  };

  const handleSignOut = () => {
    authService.logout();
    navigate('/');
  };

  const filtered = articles.filter(a => {
    const searchTerm = search.toLowerCase();
    const authorName = authors.find(auth => auth.id === a.authorId)?.name.toLowerCase() || '';
    
    return (
      a.title.toLowerCase().includes(searchTerm) || 
      a.category.toLowerCase().includes(searchTerm) ||
      authorName.includes(searchTerm)
    );
  });

  const getStatusBadge = (status: Article['status']) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 mr-1.5" />
            Published
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-indigo-100 text-indigo-700 border border-indigo-200">
            <Calendar className="w-3 h-3 mr-1.5" />
            Scheduled
          </span>
        );
      case 'draft':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-700 border border-amber-200">
            <FileEdit className="w-3 h-3 mr-1.5" />
            Draft
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-400 flex flex-col fixed h-full z-10">
        <div className="p-8 flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white">
            <Zap className="h-5 w-5 fill-current" />
          </div>
          <span className="text-white font-black uppercase tracking-tighter text-xl">EDITOR HUB</span>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1">
          <Link to="/admin" className="flex items-center space-x-3 p-3 bg-blue-600 text-white rounded-lg font-bold">
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/editor" className="flex items-center space-x-3 p-3 hover:bg-slate-800 rounded-lg transition-colors font-medium">
            <Plus className="h-5 w-5" />
            <span>New Report</span>
          </Link>
          <div className="pt-4 pb-2 px-3 text-[10px] font-black uppercase tracking-widest text-slate-500">Content Management</div>
          <Link to="/admin" className="w-full flex items-center space-x-3 p-3 hover:bg-slate-800 rounded-lg transition-colors font-medium">
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
          <div className="pt-4 pb-2 px-3 text-[10px] font-black uppercase tracking-widest text-slate-500">Analytics</div>
          <button className="w-full flex items-center space-x-3 p-3 hover:bg-slate-800 rounded-lg transition-colors font-medium">
            <BarChart className="h-5 w-5" />
            <span>Traffic</span>
          </button>
        </nav>

        <div className="p-4 mt-auto border-t border-slate-800">
          {currentUser && (
            <div className="flex items-center space-x-3 mb-4 p-3 bg-slate-800/50 rounded-xl">
              <img src={currentUser.avatar} className="w-10 h-10 rounded-full border border-slate-700 object-cover" />
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest truncate">{currentUser.role}</p>
              </div>
            </div>
          )}
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center space-x-3 p-3 hover:bg-red-900/20 hover:text-red-400 rounded-lg transition-colors font-medium"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 ml-64 p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-1 uppercase tracking-tight">Editorial Queue</h1>
            <p className="text-slate-500 font-medium">Overseeing the latest cybersecurity intelligence.</p>
          </div>
          <Link 
            to="/admin/editor" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-black rounded-lg hover:bg-blue-500 transition-all uppercase tracking-widest text-sm"
          >
            <Plus className="h-4 w-4 mr-2" /> CREATE NEW REPORT
          </Link>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FileText className="h-6 w-6" /></div>
              <span className="text-xs font-black text-slate-400 uppercase">Reports</span>
            </div>
            <div className="text-3xl font-black text-slate-900">{articles.length}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Users className="h-6 w-6" /></div>
              <span className="text-xs font-black text-slate-400 uppercase">Authors</span>
            </div>
            <div className="text-3xl font-black text-slate-900">{authors.length}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-50 text-green-600 rounded-lg"><CheckCircle2 className="h-6 w-6" /></div>
              <span className="text-xs font-black text-slate-400 uppercase">Published</span>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {articles.filter(a => a.status === 'published').length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg"><Clock className="h-6 w-6" /></div>
              <span className="text-xs font-black text-slate-400 uppercase">Drafts</span>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {articles.filter(a => a.status === 'draft').length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-red-50 text-red-600 rounded-lg"><FileWarning className="h-6 w-6" /></div>
              <span className="text-xs font-black text-slate-400 uppercase">Urgent</span>
            </div>
            <div className="text-3xl font-black text-slate-900">3</div>
          </div>
        </div>

        {/* Article Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by title, category, or author name..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(article => {
                const author = authors.find(auth => auth.id === article.authorId);
                return (
                  <tr key={article.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      {getStatusBadge(article.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{article.title}</span>
                        <span className="text-xs text-slate-400 font-mono">/{article.slug}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-500 uppercase">{article.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {author && (
                          <>
                            <img src={author.avatar} className="w-6 h-6 rounded-full object-cover" alt={author.name} />
                            <span className="text-xs font-bold text-slate-700">{author.name}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-500">{format(new Date(article.publishedAt), 'MMM dd, HH:mm')}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link to={`/admin/editor/${article.id}`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                          <Edit3 className="h-4 w-4" />
                        </Link>
                        <Link to={`/article/${article.slug}`} target="_blank" className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all">
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button onClick={() => handleDelete(article.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-12 text-center text-slate-500 font-medium">
              No articles match your search criteria.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
