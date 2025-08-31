import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Button,
} from '@mui/material';
import {
  Description,
  Email,
  Chat,
  Code,
  Language,
  Refresh,
  Settings,
  PlayArrow,
  CheckCircle,
  Error,
  Schedule,
} from '@mui/icons-material';
import { DataSource } from '../../types/datasources';

interface DataSourceListProps {
  dataSources: DataSource[];
  onRefresh: () => void;
}

const getSourceIcon = (type: string) => {
  switch (type) {
    case 'document': return <Description />;
    case 'email': return <Email />;
    case 'wechat': return <Chat />;
    case 'code': return <Code />;
    case 'browser': return <Language />;
    default: return <Description />;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'ready': return <CheckCircle color="success" />;
    case 'configured': return <Schedule color="warning" />;
    case 'indexing': return <PlayArrow color="info" />;
    case 'error': return <Error color="error" />;
    default: return <Schedule />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ready': return 'success';
    case 'configured': return 'warning';
    case 'indexing': return 'info';
    case 'error': return 'error';
    default: return 'default';
  }
};

export const DataSourceList: React.FC<DataSourceListProps> = ({ dataSources, onRefresh }) => {
  if (dataSources.length === 0) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Data Sources Configured
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create a new index to get started with LEANN
          </Typography>
          <Button variant="outlined" onClick={onRefresh} startIcon={<Refresh />}>
            Refresh
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Configured Data Sources ({dataSources.length})
        </Typography>
        <IconButton onClick={onRefresh} size="small">
          <Refresh />
        </IconButton>
      </Box>

      <List>
        {dataSources.map((source) => (
          <Card key={source.id} sx={{ mb: 2 }}>
            <ListItem>
              <ListItemIcon>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {getSourceIcon(source.type)}
                </Avatar>
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1">{source.name}</Typography>
                    <Chip 
                      size="small" 
                      label={source.status} 
                      color={getStatusColor(source.status) as any}
                      icon={getStatusIcon(source.status)}
                    />
                  </Box>
                }
                secondary={
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Type: {source.type} • {source.itemCount || 0} items
                      {source.lastIndexed && (
                        <> • Last indexed: {new Date(source.lastIndexed).toLocaleDateString()}</>
                      )}
                    </Typography>
                    {source.config && Object.keys(source.config).length > 0 && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        Config: {Object.entries(source.config).map(([key, value]) => 
                          `${key}: ${value}`
                        ).join(', ')}
                      </Typography>
                    )}
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {source.status === 'configured' && (
                    <Button variant="outlined" size="small" startIcon={<PlayArrow />}>
                      Index
                    </Button>
                  )}
                  <IconButton size="small">
                    <Settings />
                  </IconButton>
                </Box>
              </ListItemSecondaryAction>
            </ListItem>
          </Card>
        ))}
      </List>
    </Box>
  );
};
