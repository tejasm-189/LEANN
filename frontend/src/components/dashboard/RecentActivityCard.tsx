import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Search,
  CloudUpload,
  Sync,
  CheckCircle,
  Schedule,
  Error,
} from '@mui/icons-material';
import { RecentActivity } from '../../types/dashboard';

interface RecentActivityCardProps {
  activities: RecentActivity[];
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'search': return <Search />;
    case 'upload': return <CloudUpload />;
    case 'index': return <Sync />;
    default: return <Sync />;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'search': return '#1976d2';
    case 'upload': return '#2e7d32';
    case 'index': return '#ed6c02';
    default: return '#757575';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'success': return <CheckCircle color="success" fontSize="small" />;
    case 'pending': return <Schedule color="warning" fontSize="small" />;
    case 'error': return <Error color="error" fontSize="small" />;
    default: return <Schedule color="disabled" fontSize="small" />;
  }
};

const getStatusChip = (status: string) => {
  const statusConfig = {
    success: { label: 'Success', color: 'success' as const },
    pending: { label: 'Pending', color: 'warning' as const },
    error: { label: 'Error', color: 'error' as const },
  };

  const config = statusConfig[status as keyof typeof statusConfig];
  if (!config) return null;
  
  return <Chip label={config.label} color={config.color} size="small" />;
};

const formatTimeAgo = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
};

export const RecentActivityCard: React.FC<RecentActivityCardProps> = ({ activities }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        <List dense>
          {activities.map((activity) => (
            <ListItem key={activity.id}>
              <ListItemIcon>
                <Avatar sx={{ bgcolor: getActivityColor(activity.type), width: 32, height: 32 }}>
                  {getActivityIcon(activity.type)}
                </Avatar>
              </ListItemIcon>
              <ListItemText
                primary={activity.description}
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    {getStatusIcon(activity.status)}
                    <Typography variant="caption" color="text.secondary">
                      {formatTimeAgo(activity.timestamp)}
                    </Typography>
                    {getStatusChip(activity.status)}
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
        {activities.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body2" color="text.secondary">
              No recent activity
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
