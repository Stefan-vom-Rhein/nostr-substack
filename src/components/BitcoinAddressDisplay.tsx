import React, { useState } from 'react';

interface BitcoinAddressDisplayProps {
  className?: string;
}

export const BitcoinAddressDisplay: React.FC<BitcoinAddressDisplayProps> = ({ 
  className = '' 
}) => {
  const [copied, setCopied] = useState(false);
  
  // Placeholder addresses - in a real app, these would come from user settings
  const onchainAddress = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';
  const lightningAddress = 'your-lightning@wallet.com';
  
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center">
        <span className="mr-2">₿</span>
        Support with Bitcoin
      </h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-yellow-700 mb-1">
            On-chain Address
          </label>
          <div className="flex items-center space-x-2">
            <code className="flex-1 bg-white border border-yellow-300 rounded px-3 py-2 text-sm font-mono break-all">
              {onchainAddress}
            </code>
            <button
              onClick={() => copyToClipboard(onchainAddress)}
              className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm whitespace-nowrap"
            >
              {copied ? '✓' : 'Copy'}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-yellow-700 mb-1">
            Lightning Address
          </label>
          <div className="flex items-center space-x-2">
            <code className="flex-1 bg-white border border-yellow-300 rounded px-3 py-2 text-sm font-mono">
              {lightningAddress}
            </code>
            <button
              onClick={() => copyToClipboard(lightningAddress)}
              className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm whitespace-nowrap"
            >
              {copied ? '✓' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      <p className="text-xs text-yellow-600 mt-3">
        These are placeholder addresses. In a real implementation, these would be connected to your wallet.
        Future versions will support Zaps (NIP-57) for seamless Lightning payments.
      </p>
    </div>
  );
};