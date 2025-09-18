import React, { useState, useEffect } from 'react';
import { nostrService } from './utils/nostr';
import { useNostrAuth, useArticles } from './hooks/useNostr';
import { AuthModal } from './components/AuthModal';
import { ArticleEditor } from './components/ArticleEditor';
import { ArticleCard } from './components/ArticleCard';
import { BitcoinAddressDisplay } from './components/BitcoinAddressDisplay';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const { isAuthenticated, publicKey } = useNostrAuth();
  const { articles, loading } = useArticles();

  useEffect(() => {
    const connectToRelays = async () => {
      try {
        setConnectionStatus('Connecting...');
        await nostrService.connect();
        setConnectionStatus('Connected to Nostr relays');
      } catch (error) {
        setConnectionStatus('Failed to connect to relays');
        console.error('Connection error:', error);
      }
    };

    connectToRelays();

    return () => {
      nostrService.disconnect();
    };
  }, []);

  const handleWriteArticle = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsEditorOpen(true);
  };

  const formatPubkey = (pubkey: string) => {
    const npub = nostrService.npubFromPubkey(pubkey);
    return `${npub.slice(0, 12)}...${npub.slice(-8)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nostr Substack</h1>
              <p className="text-sm text-gray-600">{connectionStatus}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-gray-600">
                    {formatPubkey(publicKey!)}
                  </span>
                  <button
                    onClick={handleWriteArticle}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Write Article
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Articles Feed */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Latest Articles
              </h2>
              
              {!isAuthenticated && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-blue-800">
                    <strong>Welcome to Nostr Substack!</strong> Connect your Nostr identity to publish and interact with articles.
                  </p>
                </div>
              )}
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : articles.length > 0 ? (
              <div className="space-y-6">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No articles found yet.</p>
                {isAuthenticated && (
                  <button
                    onClick={() => setIsEditorOpen(true)}
                    className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
                  >
                    Write the First Article
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* About */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                About Nostr Substack
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                A decentralized publishing platform built on the Nostr protocol. 
                Publish articles, build your audience, and receive Bitcoin donations 
                without intermediaries.
              </p>
              <div className="text-xs text-gray-500 space-y-1">
                <div>• Articles stored as Nostr events (Kind 30023)</div>
                <div>• NIP-07 authentication support</div>
                <div>• Bitcoin Lightning integration ready</div>
                <div>• Censorship resistant</div>
              </div>
            </div>

            {/* Bitcoin Support */}
            <BitcoinAddressDisplay />

            {/* Future Features */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Coming Soon</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Zaps (NIP-57) integration</li>
                <li>• Profile customization</li>
                <li>• Article comments</li>
                <li>• Subscription feeds</li>
                <li>• Content monetization</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      
      <ArticleEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onPublished={() => {
          // Articles will be automatically updated via the subscription
        }}
      />
    </div>
  );
}

export default App;
