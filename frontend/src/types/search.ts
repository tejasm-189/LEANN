export interface SearchResult {
  id: string;
  content: string;
  score: number;
  source: 'document' | 'email' | 'wechat' | 'code' | 'browser';
  metadata: {
    title?: string;
    author?: string;
    date?: string;
    path?: string;
    contact?: string;
    url?: string;
    language?: string;
  };
}

export interface SearchFilters {
  sources: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  scoreThreshold: number;
}

export interface SearchRequest {
  query: string;
  topK: number;
  filters?: SearchFilters;
}
