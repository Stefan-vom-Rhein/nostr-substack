# Nostr Substack

A decentralized publishing platform built on the Nostr protocol - a Substack clone that runs as a pure frontend app with Bitcoin integration.

## 🚀 Features

- **React + TypeScript + Vite** - Modern web stack for optimal performance
- **Nostr Protocol Integration** - Decentralized publishing using nostr-tools
- **NIP-07 Authentication** - Browser extension support (Alby, nos2x)
- **Long-form Articles** - Publish articles as Nostr events (Kind 30023)
- **Real-time Feed** - Subscribe to articles from Nostr relays
- **Bitcoin Donations** - Placeholder for on-chain and Lightning addresses
- **Modern UI** - Clean interface built with TailwindCSS
- **Censorship Resistant** - No central authority, runs directly over Nostr network

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: TailwindCSS with responsive design
- **Nostr**: nostr-tools for event handling and relay communication
- **Bitcoin**: Prepared for Lightning integration (NIP-57)
- **Authentication**: NIP-07 browser extensions + manual private key (testing)

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Nostr browser extension (recommended: [Alby](https://getalby.com/) or [nos2x](https://github.com/fiatjaf/nos2x))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Stefan-vom-Rhein/nostr-substack.git
   cd nostr-substack
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm run preview
```

## 📱 Usage

### Authentication

1. **Browser Extension (Recommended)**: Click "Connect Wallet" and use your Nostr extension
2. **Private Key (Testing Only)**: Enter your private key manually (not recommended for production)

### Publishing Articles

1. Connect your Nostr identity
2. Click "Write Article"
3. Fill in title, content, and optional summary/image
4. Publish to the Nostr network

### Reading Articles

- Browse the latest articles from the Nostr network
- Articles are fetched in real-time from multiple relays
- No registration required for reading

## 🔧 Configuration

### Nostr Relays

The app connects to these default relays (configurable in `src/utils/nostr.ts`):
- `wss://relay.damus.io`
- `wss://nos.lol`
- `wss://relay.nostr.band`
- `wss://nostr-pub.wellorder.net`

### Bitcoin Integration

Currently shows placeholder addresses. Future integration planned for:
- Lightning Network payments
- Zaps (NIP-57) for article monetization
- Wallet connectivity

## 🗂️ Project Structure

```
src/
├── components/          # React components
│   ├── AuthModal.tsx    # Authentication modal
│   ├── ArticleEditor.tsx # Article writing interface
│   ├── ArticleCard.tsx  # Article display component
│   └── BitcoinAddressDisplay.tsx # Bitcoin donation display
├── hooks/              # Custom React hooks
│   └── useNostr.ts     # Nostr authentication and data hooks
├── types/              # TypeScript type definitions
│   └── nostr.ts        # Nostr-related types
├── utils/              # Utility functions
│   └── nostr.ts        # Nostr service class
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # TailwindCSS imports
```

## 🔐 Security Notes

- **NIP-07 Extensions**: Secure way to manage keys via browser extensions
- **Private Keys**: Only use for testing; never share your main private key
- **Relay Trust**: Articles are stored on public relays; consider privacy implications
- **Client-side Only**: This is a pure frontend app with no backend or databases

## 🛣️ Roadmap

- [ ] **Enhanced Authentication**
  - [ ] Nostr Connect (NIP-46) integration
  - [ ] Multiple key management
  
- [ ] **Bitcoin/Lightning Features**
  - [ ] NIP-57 Zaps integration
  - [ ] Lightning wallet connectivity
  - [ ] Article monetization
  
- [ ] **Social Features**
  - [ ] Article comments (NIP-10)
  - [ ] Author following
  - [ ] Reaction/like system
  
- [ ] **Content Features**
  - [ ] Markdown editor with preview
  - [ ] Image upload to IPFS
  - [ ] Article drafts
  - [ ] Categories and tags
  
- [ ] **UX Improvements**
  - [ ] Profile customization
  - [ ] Dark mode
  - [ ] Mobile app (React Native)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- [Nostr Protocol](https://nostr.com/)
- [NIP-07 (Browser Extension)](https://github.com/nostr-protocol/nips/blob/master/07.md)
- [NIP-23 (Long-form Content)](https://github.com/nostr-protocol/nips/blob/master/23.md)
- [NIP-57 (Lightning Zaps)](https://github.com/nostr-protocol/nips/blob/master/57.md)

## 💬 Support

For questions and support:
- Open an issue on GitHub
- Join the discussion on Nostr
- Contact via the Nostr network

---

**Built with ❤️ on the Nostr protocol**
