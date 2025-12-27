
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, X, Shield, ChevronDown, User, LogIn, Bell, LogOut } from 'lucide-react';
import { APP_NAME, TAGLINE } from '../constants';
import { articleService } from '../services/articleService';
import { authService } from '../services/authService';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  useEffect(() => {
    setCategories(articleService.getCategories());
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    ...categories.map(cat => ({
      name: cat,
      href: `/category/${cat.replace(/ /g, '-').toLowerCase()}`
    }))
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-900 text-white shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between py-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-500 transition-colors">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-extrabold tracking-tight uppercase leading-none block">
                  {APP_NAME}
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase mt-0.5 block">
                  {TAGLINE}
                </span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/admin" className="text-sm font-bold text-blue-400 hover:text-blue-300">
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-sm font-semibold px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white transition-colors">
                Editor Login
              </Link>
            )}
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-white">
              <Bell className="h-5 w-5" />
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8 py-3 text-sm font-bold uppercase tracking-wide overflow-x-auto no-scrollbar">
          {navLinks.map(link => (
            <Link 
              key={link.name} 
              to={link.href}
              className="text-slate-300 hover:text-blue-400 whitespace-nowrap transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="absolute inset-x-0 top-full bg-slate-900 border-b border-slate-800 p-4 animate-in slide-in-from-top duration-200">
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex items-center bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
            <Search className="h-5 w-5 ml-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search news, vulnerabilities, threat intel..."
              className="w-full bg-transparent border-none focus:ring-0 text-white p-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button type="submit" className="px-6 py-2 bg-blue-600 font-bold hover:bg-blue-500 transition-colors">
              SEARCH
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4">
          <div className="flex flex-col space-y-4">
            {navLinks.map(link => (
              <Link 
                key={link.name} 
                to={link.href} 
                className="text-lg font-bold border-b border-slate-800 pb-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/admin" className="text-blue-400 font-bold" onClick={() => setIsMenuOpen(false)}>Admin Dashboard</Link>
                <button onClick={handleLogout} className="text-left text-red-400 font-bold">Logout</button>
              </>
            ) : (
              <Link to="/login" className="text-blue-400 font-bold" onClick={() => setIsMenuOpen(false)}>Editor Login</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white py-12 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <Shield className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-black tracking-tighter uppercase">{APP_NAME}</span>
            </div>
            <p className="text-slate-400 max-w-sm mb-6">
              InfosecWire is the world's leading source for real-time cybersecurity news and high-impact threat intelligence. 
              Our mission is to empower professionals with actionable knowledge.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold uppercase tracking-wider mb-6 text-slate-200">Quick Links</h4>
            <ul className="space-y-4 text-slate-400">
              <li><Link to="/about" className="hover:text-blue-500 transition-colors">About Us</Link></li>
              <li><Link to="/editorial-policy" className="hover:text-blue-500 transition-colors">Editorial Policy</Link></li>
              <li><Link to="/ethics" className="hover:text-blue-500 transition-colors">Ethics & Disclosure</Link></li>
              <li><Link to="/contact" className="hover:text-blue-500 transition-colors">Contact / Tips</Link></li>
              <li><Link to="/advertise" className="hover:text-blue-500 transition-colors">Advertise</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider mb-6 text-slate-200">Legal</h4>
            <ul className="space-y-4 text-slate-400">
              <li><Link to="/privacy" className="hover:text-blue-500 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-blue-500 transition-colors">Terms of Use</Link></li>
              <li><Link to="/corrections" className="hover:text-blue-500 transition-colors">Corrections Policy</Link></li>
              <li><a href="/rss.xml" className="hover:text-blue-500 transition-colors">RSS Feed</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} InfosecWire Media. All rights reserved. Registered Trademark.
        </div>
      </div>
    </footer>
  );
};
