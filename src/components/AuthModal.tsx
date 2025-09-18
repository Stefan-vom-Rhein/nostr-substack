import React, { useState } from 'react';
import { useNostrAuth } from '../hooks/useNostr';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [privateKey, setPrivateKey] = useState('');
  const [authMethod, setAuthMethod] = useState<'nip07' | 'privkey'>('nip07');
  const { connectWithNIP07, connectWithPrivateKey, isConnecting } = useNostrAuth();

  if (!isOpen) return null;

  const handleNIP07Login = async () => {
    const success = await connectWithNIP07();
    if (success) {
      onClose();
    } else {
      alert('NIP-07 extension not found. Please install a Nostr extension like Alby or nos2x.');
    }
  };

  const handlePrivateKeyLogin = () => {
    if (!privateKey.trim()) {
      alert('Please enter a private key');
      return;
    }
    
    const success = connectWithPrivateKey(privateKey);
    if (success) {
      onClose();
      setPrivateKey('');
    } else {
      alert('Invalid private key');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Connect to Nostr</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <div className="flex space-x-2 mb-4">
            <button
              className={`px-4 py-2 rounded ${
                authMethod === 'nip07'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setAuthMethod('nip07')}
            >
              Extension (NIP-07)
            </button>
            <button
              className={`px-4 py-2 rounded ${
                authMethod === 'privkey'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setAuthMethod('privkey')}
            >
              Private Key
            </button>
          </div>

          {authMethod === 'nip07' ? (
            <div>
              <p className="text-gray-600 mb-4">
                Use a Nostr browser extension like Alby or nos2x to connect securely.
              </p>
              <button
                onClick={handleNIP07Login}
                disabled={isConnecting}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {isConnecting ? 'Connecting...' : 'Connect with Extension'}
              </button>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-4">
                Enter your private key (nsec or hex format). This is for testing only.
              </p>
              <input
                type="password"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                placeholder="nsec... or hex private key"
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              />
              <button
                onClick={handlePrivateKeyLogin}
                disabled={isConnecting}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {isConnecting ? 'Connecting...' : 'Connect with Private Key'}
              </button>
              <p className="text-sm text-red-600 mt-2">
                Warning: Only use this for testing. Never enter your main private key on untrusted sites.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};