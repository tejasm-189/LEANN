import React, { useState } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { SearchBar } from '../components/search/SearchBar';
import { SearchResults } from '../components/search/SearchResults';
import { SearchResult } from '../types/search';

// Mock data for demonstration
const MOCK_RESULTS: SearchResult[] = [
  {
    id: '1',
    content: 'LEANN is an innovative vector database that democratizes personal AI. Transform your laptop into a powerful RAG system that can index and search through millions of documents while using 97% less storage than traditional solutions without accuracy loss.',
    score: 0.95,
    source: 'document',
    metadata: {
      title: 'LEANN Documentation',
      path: 'README.md',
      date: '2025-08-31',
    }
  },
  {
    id: '2',
    content: 'Subject: Weekly standup meeting\nHi team, just a reminder about our weekly standup meeting tomorrow at 10 AM. Please prepare your updates and any blockers you might have.',
    score: 0.87,
    source: 'email',
    metadata: {
      title: 'Weekly standup meeting',
      author: 'john@company.com',
      date: '2025-08-30',
    }
  },
  {
    id: '3',
    content: '[Me]: Hey, are we still meeting for coffee tomorrow?\n[Contact]: Yes! See you at the usual place at 3 PM',
    score: 0.82,
    source: 'wechat',
    metadata: {
      contact: 'Sarah Chen',
      date: '2025-08-29',
    }
  },
  {
    id: '4',
    content: 'function searchDocuments(query: string, topK: number): SearchResult[] {\n  // Implementation for searching documents\n  const results = performVectorSearch(query, topK);\n  return results.map(formatResult);\n}',
    score: 0.79,
    source: 'code',
    metadata: {
      title: 'search.ts',
      path: 'src/utils/search.ts',
      language: 'typescript',
    }
  }
];

export const Search: React.FC = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string, topK: number, sources: string[]) => {
    setLoading(true);
    setCurrentQuery(query);
    setHasSearched(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Filter mock results based on selected sources and topK
      const filteredResults = MOCK_RESULTS
        .filter(result => sources.includes(result.source))
        .filter(result => 
          result.content.toLowerCase().includes(query.toLowerCase()) ||
          result.metadata.title?.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, topK);

      setResults(filteredResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Universal Search
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Search across all your indexed data sources: documents, emails, chat history, code, and more.
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>Demo Mode:</strong> This is a frontend preview with mock data. 
        Backend integration will connect to your actual LEANN indices.
      </Alert>

      <SearchBar onSearch={handleSearch} loading={loading} />

      {hasSearched && (
        <SearchResults 
          results={results} 
          loading={loading} 
          query={currentQuery}
        />
      )}

      {!hasSearched && (
        <Box sx={{ textAlign: 'center', mt: 4, p: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Ready to search your data
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enter a query above to search across all your indexed content
          </Typography>
        </Box>
      )}
    </Box>
  );
};
