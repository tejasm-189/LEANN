import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
} from '@mui/material';
import {
  Description,
  Email,
  Chat,
  Code,
  Language,
  CheckCircle,
  Sync,
  Error,
  RadioButtonUnchecked,
} from '@mui/icons-material';
import { DataSourceStatus } from '../../types/dashboard';

interface DataSourcesCardProps {
  dataSources: DataSourceStatus[];
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

const getSourceColor = (type: string) => {
  switch (type) {
    case 'document': return '#1976d2';
    case 'email': return '#d32f2f';
    case 'wechat': return '#2e7d32';
    case 'code': return '#ed6c02';
    case 'browser': return '#9c27b0';
    default: return '#757575';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active': return <CheckCircle color="success" />;
    case 'indexing': return <Sync color="primary" />;
    case 'error': return <Error color="error" />;
    case 'inactive': return <RadioButtonUnchecked color="disabled" />;
    default: return <RadioButtonUnchecked color="disabled" />;
  }
};

const getStatusChip = (status: string) => {
  const statusConfig = {
    active: { label: 'Active', color: 'success' as const },
    indexing: { label: 'Indexing', color: 'primary' as const },
    error: { label: 'Error', color: 'error' as const },
    inactive: { label: 'Inactive', color: 'default' as const },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
  return <Chip label={config.label} color={config.color} size="small" />;
};

export const DataSourcesCard: React.FC<DataSourcesCardProps> = ({ dataSources }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Data Sources
        </Typography>
        <List dense>
          {dataSources.map((source) => (
            <ListItem key={source.id}>
              <ListItemIcon>
                <Avatar sx={{ bgcolor: getSourceColor(source.type), width: 32, height: 32 }}>
                  {getSourceIcon(source.type)}
                </Avatar>
              </ListItemIcon>
              <ListItemText
                primary={source.name}
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {source.itemCount.toLocaleString()} items • {source.storageSize}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Last updated: {new Date(source.lastUpdated).toLocaleDateString()}
                    </Typography>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getStatusIcon(source.status)}
                  {getStatusChip(source.status)}
                </Box>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};
