import { SimplePool, Event, getPublicKey, getEventHash, signEvent, nip19, Filter } from 'nostr-tools';
import type { NostrEvent, Article, Profile, NostrFilter, RelayInfo } from '../types/nostr';

class NostrService {
  private pool: SimplePool;
  private relays: RelayInfo[] = [
    { url: 'wss://relay.damus.io', read: true, write: true },
    { url: 'wss://nos.lol', read: true, write: true },
    { url: 'wss://relay.nostr.band', read: true, write: true },
    { url: 'wss://nostr-pub.wellorder.net', read: true, write: true },
  ];
  private privateKey: string | null = null;
  private publicKey: string | null = null;

  constructor() {
    this.pool = new SimplePool();
  }

  async connect(): Promise<void> {
    try {
      console.log('Connected to Nostr relays');
    } catch (error) {
      console.error('Failed to connect to relays:', error);
      throw error;
    }
  }

  async authenticateWithNIP07(): Promise<boolean> {
    if (typeof window !== 'undefined' && (window as any).nostr) {
      try {
        this.publicKey = await (window as any).nostr.getPublicKey();
        return true;
      } catch (error) {
        console.error('NIP-07 authentication failed:', error);
        return false;
      }
    }
    return false;
  }

  authenticateWithPrivateKey(privateKey: string): boolean {
    try {
      this.privateKey = privateKey;
      this.publicKey = getPublicKey(privateKey);
      return true;
    } catch (error) {
      console.error('Private key authentication failed:', error);
      return false;
    }
  }

  getPublicKey(): string | null {
    return this.publicKey;
  }

  isAuthenticated(): boolean {
    return this.publicKey !== null;
  }

  async publishArticle(
    title: string, 
    content: string, 
    summary?: string, 
    image?: string
  ): Promise<Article> {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated');
    }

    const tags = [
      ['d', `article-${Date.now()}`], // Identifier for replaceable event
      ['title', title],
    ];

    if (summary) {
      tags.push(['summary', summary]);
    }
    
    if (image) {
      tags.push(['image', image]);
    }

    tags.push(['published_at', Math.floor(Date.now() / 1000).toString()]);

    const event: Partial<NostrEvent> = {
      kind: 30023, // Long-form article
      created_at: Math.floor(Date.now() / 1000),
      tags,
      content,
      pubkey: this.publicKey!,
    };

    let signedEvent: Event;

    if (typeof window !== 'undefined' && (window as any).nostr && !this.privateKey) {
      // Use NIP-07 for signing
      signedEvent = await (window as any).nostr.signEvent(event);
    } else if (this.privateKey) {
      // Sign with private key
      event.id = getEventHash(event as Event);
      event.sig = signEvent(event as Event, this.privateKey);
      signedEvent = event as Event;
    } else {
      throw new Error('No signing method available');
    }

    // Publish to relays
    const relayUrls = this.relays.filter(relay => relay.write).map(r => r.url);
    await this.pool.publish(relayUrls, signedEvent);

    return signedEvent as Article;
  }

  async subscribeToArticles(
    authors?: string[], 
    callback?: (article: Article) => void
  ): Promise<() => void> {
    const filter: Filter = {
      kinds: [30023],
      limit: 50,
    };

    if (authors && authors.length > 0) {
      filter.authors = authors;
    }

    const relayUrls = this.relays.map(r => r.url);
    const sub = this.pool.sub(relayUrls, [filter]);
    
    sub.on('event', (event: Event) => {
      if (callback) {
        callback(event as Article);
      }
    });

    sub.on('eose', () => {
      console.log('Initial articles loaded');
    });

    return () => sub.unsub();
  }

  async getProfile(pubkey: string): Promise<Profile | null> {
    const relayUrls = this.relays.map(r => r.url);
    const events = await this.pool.get(relayUrls, { kinds: [0], authors: [pubkey] });
    
    if (events) {
      try {
        return JSON.parse(events.content) as Profile;
      } catch {
        return null;
      }
    }
    return null;
  }

  npubFromPubkey(pubkey: string): string {
    return nip19.npubEncode(pubkey);
  }

  pubkeyFromNpub(npub: string): string {
    const decoded = nip19.decode(npub);
    return decoded.data as string;
  }

  disconnect(): void {
    this.pool.close(this.relays.map(r => r.url));
  }
}

export const nostrService = new NostrService();