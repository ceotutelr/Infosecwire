
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Plus, Trash2, Edit3, Save, X, Grid, Zap, LayoutDashboard, FileText, Users, BarChart, LogOut
} from 'lucide-react';
import { articleService } from '../services/articleService';

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setCategories(articleService.getCategories());
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      articleService.saveCategory(newCategory.trim());
      setCategories(articleService.getCategories());
      setNewCategory('');
    }
  };

  const handleDelete = (cat: string) => {
    if (confirm(`Delete category "${cat}"? This will not delete articles, but they will lose this association.`)) {
      articleService.deleteCategory(cat);
      setCategories(articleService.getCategories());
    }
  };

  const startEdit = (index: number, val: string) => {
    setEditingIndex(index);
    setEditingValue(val);
  };

  const handleUpdate = () => {
    if (editingIndex !== null && editingValue.trim()) {
      const oldName = categories[editingIndex];
      articleService.updateCategory(oldName, editingValue.trim());
      setCategories(articleService.getCategories());
      setEditingIndex(null);
    }
  };

  const handleSignOut = () => {
    // In a production app, clear tokens/session here
    navigate('/');
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
          <Link to="/admin/categories" className="flex items-center space-x-3 p-3 bg-blue-600 text-white rounded-lg font-bold">
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

      <main className="flex-1 ml-64 p-8">
        <header className="flex items-center space-x-4 mb-12">
          <Link to="/admin" className="p-2 hover:bg-white rounded-lg transition-colors shadow-sm">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Taxonomy Manager</h1>
            <p className="text-slate-500 font-medium">Organize news intelligence by vertical and subject.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Add Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-black uppercase mb-6 flex items-center">
                <Plus className="h-5 w-5 mr-2 text-blue-600" /> New Category
              </h3>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">Display Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Infrastructure Security"
                    className="w-full px-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-sm font-bold"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-500 transition-all uppercase tracking-widest text-xs"
                >
                  ADD TO TAXONOMY
                </button>
              </form>
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <tr>
                    <th className="px-8 py-4">Name</th>
                    <th className="px-8 py-4">Article Count</th>
                    <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {categories.map((cat, idx) => (
                    <tr key={cat} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        {editingIndex === idx ? (
                          <div className="flex items-center space-x-2">
                            <input 
                              autoFocus
                              type="text"
                              className="px-3 py-1 border border-blue-500 rounded font-bold text-sm outline-none"
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
                            />
                            <button onClick={handleUpdate} className="p-1 text-green-600 hover:bg-green-50 rounded">
                              <Save className="h-4 w-4" />
                            </button>
                            <button onClick={() => setEditingIndex(null)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="font-bold text-slate-800">{cat}</span>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-mono text-slate-400">
                          {articleService.getArticles().filter(a => a.category === cat).length}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => startEdit(idx, cat)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(cat)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminCategories;
