
import { Article, Category, Author } from '../types';
import { INITIAL_ARTICLES, MOCK_AUTHORS } from '../constants';

const STORAGE_KEY = 'infosecwire_articles_v2';
const CATEGORIES_KEY = 'infosecwire_categories';
const AUTHORS_KEY = 'infosecwire_authors';

const DEFAULT_CATEGORIES = Object.values(Category);

export const articleService = {
  // Category Management
  getCategories: (): string[] => {
    const saved = localStorage.getItem(CATEGORIES_KEY);
    if (!saved) {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
      return DEFAULT_CATEGORIES;
    }
    return JSON.parse(saved);
  },

  saveCategory: (category: string): void => {
    const categories = articleService.getCategories();
    if (!categories.includes(category)) {
      categories.push(category);
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    }
  },

  updateCategory: (oldName: string, newName: string): void => {
    let categories = articleService.getCategories();
    categories = categories.map(c => c === oldName ? newName : c);
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));

    // Update articles using this category
    const articles = articleService.getArticles();
    const updatedArticles = articles.map(a => 
      a.category === oldName ? { ...a, category: newName } : a
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedArticles));
  },

  deleteCategory: (category: string): void => {
    const categories = articleService.getCategories();
    const filtered = categories.filter(c => c !== category);
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(filtered));
  },

  // Author Management
  getAuthors: (): Author[] => {
    const saved = localStorage.getItem(AUTHORS_KEY);
    if (!saved) {
      localStorage.setItem(AUTHORS_KEY, JSON.stringify(MOCK_AUTHORS));
      return MOCK_AUTHORS;
    }
    return JSON.parse(saved);
  },

  saveAuthor: (author: Author): void => {
    const authors = articleService.getAuthors();
    const index = authors.findIndex(a => a.id === author.id);
    if (index > -1) {
      authors[index] = author;
    } else {
      authors.push(author);
    }
    localStorage.setItem(AUTHORS_KEY, JSON.stringify(authors));
  },

  deleteAuthor: (id: string): void => {
    const authors = articleService.getAuthors();
    const filtered = authors.filter(a => a.id !== id);
    localStorage.setItem(AUTHORS_KEY, JSON.stringify(filtered));
  },

  // Article Management
  getArticles: (): Article[] => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ARTICLES));
      return INITIAL_ARTICLES;
    }
    return JSON.parse(saved);
  },

  saveArticle: (article: Article): void => {
    const articles = articleService.getArticles();
    const index = articles.findIndex(a => a.id === article.id);
    if (index > -1) {
      articles[index] = { ...article, publishedAt: article.status === 'published' ? new Date().toISOString() : article.publishedAt };
    } else {
      articles.push(article);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  },

  deleteArticle: (id: string): void => {
    const articles = articleService.getArticles();
    const filtered = articles.filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  getArticleBySlug: (slug: string): Article | undefined => {
    return articleService.getArticles().find(a => a.slug === slug);
  },

  getArticlesByCategory: (category: string): Article[] => {
    const articles = articleService.getArticles().filter(a => a.status === 'published');
    return articles.filter(a => 
      a.category.toLowerCase().replace(/ /g, '-') === category.toLowerCase()
    );
  },

  searchArticles: (query: string): Article[] => {
    const q = query.toLowerCase();
    return articleService.getArticles().filter(a => 
      a.status === 'published' && (
        a.title.toLowerCase().includes(q) || 
        a.excerpt.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q)) ||
        (a.cveId && a.cveId.toLowerCase().includes(q))
      )
    );
  }
};
