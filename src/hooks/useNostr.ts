import { useState, useEffect } from 'react';
import { nostrService } from '../utils/nostr';
import type { Article } from '../types/nostr';

export const useNostrAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const auth = nostrService.isAuthenticated();
      const pubkey = nostrService.getPublicKey();
      setIsAuthenticated(auth);
      setPublicKey(pubkey);
    };

    checkAuth();
  }, []);

  const connectWithNIP07 = async (): Promise<boolean> => {
    setIsConnecting(true);
    try {
      const success = await nostrService.authenticateWithNIP07();
      if (success) {
        setIsAuthenticated(true);
        setPublicKey(nostrService.getPublicKey());
      }
      return success;
    } catch (error) {
      console.error('NIP-07 connection failed:', error);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const connectWithPrivateKey = (privateKey: string): boolean => {
    setIsConnecting(true);
    try {
      const success = nostrService.authenticateWithPrivateKey(privateKey);
      if (success) {
        setIsAuthenticated(true);
        setPublicKey(nostrService.getPublicKey());
      }
      return success;
    } catch (error) {
      console.error('Private key connection failed:', error);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  return {
    isAuthenticated,
    publicKey,
    isConnecting,
    connectWithNIP07,
    connectWithPrivateKey,
  };
};

export const useArticles = (authors?: string[]) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const setupSubscription = async () => {
      try {
        unsubscribe = await nostrService.subscribeToArticles(
          authors,
          (article: Article) => {
            setArticles(prev => {
              // Avoid duplicates
              const exists = prev.some(a => a.id === article.id);
              if (exists) return prev;
              
              // Sort by created_at descending
              const newArticles = [article, ...prev].sort((a, b) => b.created_at - a.created_at);
              return newArticles.slice(0, 50); // Keep only latest 50
            });
          }
        );
        setLoading(false);
      } catch (error) {
        console.error('Failed to subscribe to articles:', error);
        setLoading(false);
      }
    };

    setupSubscription();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [authors]);

  return { articles, loading };
};