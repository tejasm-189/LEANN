import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Chip } from '@mui/material';
import { SearchBar } from '../components/search/SearchBar';
import { SearchResults } from '../components/search/SearchResults';
import { SearchResult } from '../types/search';
import { leannApi, SystemStatus } from '../services/api';

export const Search: React.FC = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check system status on component mount
    const checkStatus = async () => {
      try {
        const status = await leannApi.getStatus();
        setSystemStatus(status);
      } catch (err) {
        console.error('Failed to get system status:', err);
        setError('Backend service is not available. Make sure the Python backend is running on port 8000.');
      }
    };

    checkStatus();
  }, []);

  const handleSearch = async (query: string, topK: number, sources: string[]) => {
    setLoading(true);
    setCurrentQuery(query);
    setHasSearched(true);
    setError(null);

    try {
      const response = await leannApi.search({
        query,
        top_k: topK,
        sources,
        complexity: 64,
        recompute_embeddings: false,
      });

      // Convert API response to our frontend format
      const searchResults: SearchResult[] = response.results.map(result => ({
        id: result.id,
        content: result.content,
        score: result.score,
        source: result.source as 'document' | 'email' | 'wechat' | 'code' | 'browser',
        metadata: result.metadata,
      }));

      setResults(searchResults);
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed. Please check if the backend service is running.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusChip = () => {
    if (!systemStatus) return null;

    const statusConfig = {
      ready: { label: 'Backend Ready', color: 'success' as const },
      no_index: { label: 'No Index Found', color: 'warning' as const },
      error: { label: 'Backend Error', color: 'error' as const },
    };

    const config = statusConfig[systemStatus.status as keyof typeof statusConfig] || 
                   { label: 'Unknown Status', color: 'default' as const };

    return <Chip label={config.label} color={config.color} size="small" />;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Typography variant="h4">
          Universal Search
        </Typography>
        {getStatusChip()}
      </Box>

      <Typography variant="body1" color="text.secondary" gutterBottom>
        Search across all your indexed data sources: documents, emails, chat history, code, and more.
      </Typography>

      {systemStatus && (
        <Alert 
          severity={systemStatus.status === 'ready' ? 'success' : systemStatus.status === 'no_index' ? 'warning' : 'info'} 
          sx={{ mb: 3 }}
        >
          <strong>Backend Status:</strong> {systemStatus.status === 'ready' 
            ? `Connected to LEANN index with ${systemStatus.total_documents.toLocaleString()} documents (${systemStatus.backend_name} backend, ${systemStatus.embedding_model})`
            : systemStatus.status === 'no_index'
            ? 'Backend is running but no LEANN index found. Create an index first using the Python examples.'
            : 'Backend service status unknown'
          }
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <SearchBar onSearch={handleSearch} loading={loading} />

      {hasSearched && (
        <SearchResults 
          results={results} 
          loading={loading} 
          query={currentQuery}
        />
      )}

      {!hasSearched && systemStatus?.status === 'ready' && (
        <Box sx={{ textAlign: 'center', mt: 4, p: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Ready to search your data
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enter a query above to search across all your indexed content
          </Typography>
        </Box>
      )}

      {!hasSearched && systemStatus?.status === 'no_index' && (
        <Box sx={{ textAlign: 'center', mt: 4, p: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No LEANN index found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create an index first by running one of the Python examples:
            <br />
            <code>python -m apps.document_rag --data-dir ./data</code>
          </Typography>
        </Box>
      )}
    </Box>
  );
};
