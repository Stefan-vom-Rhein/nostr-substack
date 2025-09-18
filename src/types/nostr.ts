// Nostr types
export interface NostrEvent {
  id: string;
  pubkey: string;
  created_at: number;
  kind: number;
  tags: string[][];
  content: string;
  sig: string;
}

export interface Article extends NostrEvent {
  kind: 30023;
  title?: string;
  summary?: string;
  image?: string;
  published_at?: number;
}

export interface Profile {
  name?: string;
  about?: string;
  picture?: string;
  nip05?: string;
  lud16?: string; // Lightning address
}

export interface NostrFilter {
  ids?: string[];
  authors?: string[];
  kinds?: number[];
  since?: number;
  until?: number;
  limit?: number;
  '#e'?: string[];
  '#p'?: string[];
  '#d'?: string[];
}

export interface RelayInfo {
  url: string;
  read: boolean;
  write: boolean;
}