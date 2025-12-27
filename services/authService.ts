
import { Author, UserRole } from '../types';
import { articleService } from './articleService';

const SESSION_KEY = 'infosecwire_session';
export const GOOGLE_CLIENT_ID = '1060391129865-bnkv116hf4oaa9vc6qi88hfirb1n25f2.apps.googleusercontent.com';

export const authService = {
  login: (author: Author) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(author));
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser: (): Author | null => {
    const saved = localStorage.getItem(SESSION_KEY);
    return saved ? JSON.parse(saved) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(SESSION_KEY);
  },

  decodeJWT: (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Failed to decode JWT', e);
      return null;
    }
  },

  handleGoogleResponse: async (response: any): Promise<Author | null> => {
    const payload = authService.decodeJWT(response.credential);
    if (!payload) return null;

    // In a real newsroom, we'd verify the email against a whitelist in the database
    // For this demo, we'll map the Google profile to our first author or create a transient one
    const authors = articleService.getAuthors();
    const existing = authors.find(a => a.name.toLowerCase() === payload.name.toLowerCase());

    const authenticatedUser: Author = existing || {
      id: payload.sub,
      name: payload.name,
      bio: "Editorial staff authenticated via Google.",
      avatar: payload.picture,
      role: UserRole.AUTHOR
    };

    authService.login(authenticatedUser);
    return authenticatedUser;
  },

  // Placeholder for Microsoft login - requires a Client ID to be functional
  loginWithMicrosoft: async (): Promise<Author> => {
    return new Promise((resolve) => {
      // Simulation of a Microsoft redirect/popup flow
      setTimeout(() => {
        const defaultAuthor = articleService.getAuthors()[1]; // Marcus Thorne
        authService.login(defaultAuthor);
        resolve(defaultAuthor);
      }, 1200);
    });
  }
};
