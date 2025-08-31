import React, { useState } from 'react';
import {
  Paper,
  InputBase,
  IconButton,
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { Search as SearchIcon, FilterList } from '@mui/icons-material';

interface SearchBarProps {
  onSearch: (query: string, topK: number, sources: string[]) => void;
  loading?: boolean;
}

const DATA_SOURCES = [
  { id: 'document', label: 'Documents', color: '#1976d2' },
  { id: 'email', label: 'Email', color: '#d32f2f' },
  { id: 'wechat', label: 'WeChat', color: '#2e7d32' },
  { id: 'code', label: 'Code', color: '#ed6c02' },
  { id: 'browser', label: 'Browser', color: '#9c27b0' },
];

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, loading = false }) => {
  const [query, setQuery] = useState('');
  const [selectedSources, setSelectedSources] = useState<string[]>(['document', 'email', 'wechat', 'code']);
  const [topK, setTopK] = useState(10);

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query, topK, selectedSources);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSourceToggle = (sourceId: string) => {
    setSelectedSources(prev => 
      prev.includes(sourceId) 
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const handleTopKChange = (event: SelectChangeEvent<number>) => {
    setTopK(event.target.value as number);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Paper
        component="form"
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          mb: 2,
        }}
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search across all your data sources..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        <IconButton 
          type="button" 
          sx={{ p: '10px' }} 
          aria-label="search"
          onClick={handleSearch}
          disabled={loading || !query.trim()}
        >
          <SearchIcon />
        </IconButton>
      </Paper>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterList fontSize="small" />
          <span style={{ fontSize: '14px', fontWeight: 500 }}>Sources:</span>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {DATA_SOURCES.map(source => (
            <Chip
              key={source.id}
              label={source.label}
              onClick={() => handleSourceToggle(source.id)}
              variant={selectedSources.includes(source.id) ? 'filled' : 'outlined'}
              sx={{
                backgroundColor: selectedSources.includes(source.id) ? source.color : 'transparent',
                color: selectedSources.includes(source.id) ? 'white' : source.color,
                borderColor: source.color,
                '&:hover': {
                  backgroundColor: selectedSources.includes(source.id) ? source.color : `${source.color}10`,
                }
              }}
            />
          ))}
        </Box>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Results</InputLabel>
          <Select
            value={topK}
            label="Results"
            onChange={handleTopKChange}
          >
            <MenuItem value={5}>Top 5</MenuItem>
            <MenuItem value={10}>Top 10</MenuItem>
            <MenuItem value={20}>Top 20</MenuItem>
            <MenuItem value={50}>Top 50</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};
