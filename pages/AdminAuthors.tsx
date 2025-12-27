
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Plus, Trash2, Edit3, Save, X, Users, Zap, LayoutDashboard, FileText, Grid, BarChart, LogOut, Camera, Shield, Upload, Image as ImageIcon
} from 'lucide-react';
import { articleService } from '../services/articleService';
import { Author, UserRole } from '../types';

const AdminAuthors: React.FC = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [editingAuthor, setEditingAuthor] = useState<Partial<Author> | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setAuthors(articleService.getAuthors());
  }, []);

  const handleSignOut = () => {
    navigate('/');
  };

  const startEdit = (author: Author) => {
    setEditingAuthor(author);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this author?')) {
      articleService.deleteAuthor(id);
      setAuthors(articleService.getAuthors());
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setEditingAuthor(prev => ({ ...prev, avatar: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAuthor && editingAuthor.name) {
      const authorToSave: Author = {
        id: editingAuthor.id || Date.now().toString(),
        name: editingAuthor.name || '',
        bio: editingAuthor.bio || '',
        avatar: editingAuthor.avatar || `https://picsum.photos/seed/${Date.now()}/150/150`,
        role: editingAuthor.role || UserRole.AUTHOR
      };
      articleService.saveAuthor(authorToSave);
      setAuthors(articleService.getAuthors());
      setEditingAuthor(null);
      setIsAdding(false);
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
          <Link to="/admin" className="flex items-center space-x-3 p-3 hover:bg-slate-800 rounded-lg transition-colors font-medium">
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/editor" className="flex items-center space-x-3 p-3 hover:bg-slate-800 rounded-lg transition-colors font-medium">
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
          <Link to="/admin/authors" className="flex items-center space-x-3 p-3 bg-blue-600 text-white rounded-lg font-bold">
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

      <main className="flex-1 ml-64 p-8">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-4">
            <Link to="/admin" className="p-2 hover:bg-white rounded-lg transition-colors shadow-sm">
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Editorial Team</h1>
              <p className="text-slate-500 font-medium">Manage credentials and bios for your newsroom staff.</p>
            </div>
          </div>
          {!isAdding && (
            <button 
              onClick={() => { setIsAdding(true); setEditingAuthor({}); }}
              className="px-6 py-3 bg-blue-600 text-white font-black rounded-lg hover:bg-blue-500 transition-all uppercase tracking-widest text-sm flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" /> ADD TEAM MEMBER
            </button>
          )}
        </header>

        {isAdding && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 mb-12 animate-in fade-in slide-in-from-top-4 duration-300 max-w-4xl">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
              <h2 className="text-xl font-black uppercase tracking-tight flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-600" /> 
                {editingAuthor?.id ? 'Edit Profile' : 'New Staff Onboarding'}
              </h2>
              <button onClick={() => { setIsAdding(false); setEditingAuthor(null); }} className="text-slate-400 hover:text-slate-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">Full Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Sarah Connor"
                    className="w-full px-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-bold"
                    value={editingAuthor?.name || ''}
                    onChange={(e) => setEditingAuthor(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">Editorial Role</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-bold"
                    value={editingAuthor?.role || UserRole.AUTHOR}
                    onChange={(e) => setEditingAuthor(prev => ({ ...prev, role: e.target.value as UserRole }))}
                  >
                    <option value={UserRole.ADMIN}>Administrator</option>
                    <option value={UserRole.EDITOR}>Senior Editor</option>
                    <option value={UserRole.AUTHOR}>Staff Writer / Contributor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">Profile Photo</label>
                  <div 
                    onClick={triggerFileInput}
                    className="relative w-full aspect-square md:aspect-auto md:h-48 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all overflow-hidden"
                  >
                    {editingAuthor?.avatar ? (
                      <div className="w-full h-full relative group">
                        <img src={editingAuthor.avatar} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <Camera className="h-8 w-8 text-white" />
                           <span className="ml-2 text-white font-bold text-xs">CHANGE PHOTO</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-6">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-3">
                          <Upload className="h-6 w-6 text-slate-400" />
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Upload Portrait</p>
                        <p className="text-[10px] text-slate-400 mt-1 uppercase">JPG, PNG up to 2MB</p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">Professional Bio</label>
                  <textarea 
                    rows={12}
                    placeholder="Briefly describe background and expertise..."
                    className="w-full px-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm leading-relaxed"
                    value={editingAuthor?.bio || ''}
                    onChange={(e) => setEditingAuthor(prev => ({ ...prev, bio: e.target.value }))}
                  />
                </div>
                <div className="flex space-x-3">
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-500 transition-all uppercase tracking-widest text-xs"
                  >
                    SAVE PROFILE
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setIsAdding(false); setEditingAuthor(null); }}
                    className="px-6 py-4 bg-slate-100 text-slate-600 font-black rounded-xl hover:bg-slate-200 transition-all uppercase tracking-widest text-xs"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {authors.map(author => (
            <div key={author.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col group hover:shadow-md transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="relative">
                  <img src={author.avatar} className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-50 shadow-sm" />
                  <div className={`absolute -bottom-1 -right-1 p-1.5 rounded-lg border-2 border-white shadow-sm ${
                    author.role === UserRole.ADMIN ? 'bg-red-500 text-white' : 
                    author.role === UserRole.EDITOR ? 'bg-blue-500 text-white' : 'bg-slate-500 text-white'
                  }`}>
                    <Shield className="h-3 w-3" />
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button onClick={() => startEdit(author)} className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(author.id)} className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-1">{author.name}</h3>
              <div className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-4">{author.role}</div>
              
              <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 italic mb-6">
                "{author.bio}"
              </p>
              
              <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  <span className="font-bold text-slate-900">{articleService.getArticles().filter(a => a.authorId === author.id).length}</span> Published Articles
                </div>
                <Link to={`/admin/editor?authorId=${author.id}`} className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest">Assign Draft</Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminAuthors;
