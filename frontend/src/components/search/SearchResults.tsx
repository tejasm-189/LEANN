import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
} from '@mui/material';
import {
  Description,
  Email,
  Chat,
  Code,
  Language,
  ExpandMore,
  Person,
  Schedule,
  Folder,
} from '@mui/icons-material';
import { SearchResult } from '../../types/search';

interface SearchResultsProps {
  results: SearchResult[];
  loading?: boolean;
  query?: string;
}

const getSourceIcon = (source: string) => {
  switch (source) {
    case 'document': return <Description />;
    case 'email': return <Email />;
    case 'wechat': return <Chat />;
    case 'code': return <Code />;
    case 'browser': return <Language />;
    default: return <Description />;
  }
};

const getSourceColor = (source: string) => {
  switch (source) {
    case 'document': return '#1976d2';
    case 'email': return '#d32f2f';
    case 'wechat': return '#2e7d32';
    case 'code': return '#ed6c02';
    case 'browser': return '#9c27b0';
    default: return '#757575';
  }
};

const highlightText = (text: string, query: string) => {
  if (!query) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, index) => 
    regex.test(part) ? (
      <mark key={index} style={{ backgroundColor: '#ffeb3b', padding: '2px' }}>
        {part}
      </mark>
    ) : part
  );
};

export const SearchResults: React.FC<SearchResultsProps> = ({ 
  results, 
  loading = false, 
  query = '' 
}) => {
  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
        <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
          Searching across your data sources...
        </Typography>
      </Box>
    );
  }

  if (results.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No results found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try adjusting your search query or filters
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Found {results.length} result{results.length !== 1 ? 's' : ''}
      </Typography>
      
      {results.map((result, index) => (
        <Card key={result.id} sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Avatar sx={{ bgcolor: getSourceColor(result.source), width: 32, height: 32 }}>
                {getSourceIcon(result.source)}
              </Avatar>
              
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Chip 
                    label={result.source} 
                    size="small" 
                    sx={{ 
                      bgcolor: getSourceColor(result.source), 
                      color: 'white',
                      textTransform: 'capitalize'
                    }} 
                  />
                  <Typography variant="body2" color="text.secondary">
                    Score: {(result.score * 100).toFixed(1)}%
                  </Typography>
                </Box>

                {result.metadata.title && (
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {highlightText(result.metadata.title, query)}
                  </Typography>
                )}

                <Accordion elevation={0} sx={{ '&:before': { display: 'none' } }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="body2" sx={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {highlightText(result.content.substring(0, 150) + '...', query)}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {highlightText(result.content, query)}
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                  {result.metadata.author && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Person fontSize="small" color="disabled" />
                      <Typography variant="caption" color="text.secondary">
                        {result.metadata.author}
                      </Typography>
                    </Box>
                  )}
                  
                  {result.metadata.date && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Schedule fontSize="small" color="disabled" />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(result.metadata.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  )}
                  
                  {result.metadata.path && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Folder fontSize="small" color="disabled" />
                      <Typography variant="caption" color="text.secondary">
                        {result.metadata.path}
                      </Typography>
                    </Box>
                  )}

                  {result.metadata.contact && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Person fontSize="small" color="disabled" />
                      <Typography variant="caption" color="text.secondary">
                        {result.metadata.contact}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};
