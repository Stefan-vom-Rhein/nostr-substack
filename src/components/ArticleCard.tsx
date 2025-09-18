import React from 'react';
import type { Article } from '../types/nostr';

interface ArticleCardProps {
  article: Article;
  onClick?: () => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick }) => {
  const getTitle = (): string => {
    const titleTag = article.tags.find(tag => tag[0] === 'title');
    return titleTag ? titleTag[1] : 'Untitled';
  };

  const getSummary = (): string => {
    const summaryTag = article.tags.find(tag => tag[0] === 'summary');
    return summaryTag ? summaryTag[1] : '';
  };

  const getImage = (): string | null => {
    const imageTag = article.tags.find(tag => tag[0] === 'image');
    return imageTag ? imageTag[1] : null;
  };

  const getPublishedAt = (): Date => {
    const publishedTag = article.tags.find(tag => tag[0] === 'published_at');
    const timestamp = publishedTag ? parseInt(publishedTag[1]) : article.created_at;
    return new Date(timestamp * 1000);
  };

  const truncateContent = (content: string, maxLength: number = 200): string => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const title = getTitle();
  const summary = getSummary();
  const image = getImage();
  const publishedAt = getPublishedAt();
  const content = article.content;

  return (
    <article
      className={`bg-white rounded-lg shadow-md overflow-hidden ${
        onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''
      }`}
      onClick={onClick}
    >
      {image && (
        <div className="aspect-w-16 aspect-h-9">
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      )}
      
      <div className="p-6">
        <header className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {title}
          </h2>
          
          {summary && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {summary}
            </p>
          )}
          
          <time className="text-xs text-gray-500">
            {formatDate(publishedAt)}
          </time>
        </header>

        {!summary && content && (
          <div className="text-gray-700 text-sm line-clamp-3">
            {truncateContent(content)}
          </div>
        )}

        <footer className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <span>
            Author: {article.pubkey.slice(0, 8)}...{article.pubkey.slice(-8)}
          </span>
          <span>
            Kind {article.kind}
          </span>
        </footer>
      </div>
    </article>
  );
};