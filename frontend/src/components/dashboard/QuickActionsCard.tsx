import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Avatar,
} from '@mui/material';
import {
  Search,
  CloudUpload,
  Settings,
  Analytics,
} from '@mui/icons-material';
import { QuickAction } from '../../types/dashboard';

interface QuickActionsCardProps {
  onActionClick: (action: string) => void;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: '1',
    title: 'Universal Search',
    description: 'Search across all data sources',
    icon: <Search />,
    action: 'search',
    color: '#1976d2',
  },
  {
    id: '2',
    title: 'Upload Documents',
    description: 'Add new files to index',
    icon: <CloudUpload />,
    action: 'upload',
    color: '#2e7d32',
  },
  {
    id: '3',
    title: 'System Settings',
    description: 'Configure LEANN settings',
    icon: <Settings />,
    action: 'settings',
    color: '#ed6c02',
  },
  {
    id: '4',
    title: 'View Analytics',
    description: 'Usage and performance stats',
    icon: <Analytics />,
    action: 'analytics',
    color: '#9c27b0',
  },
];

export const QuickActionsCard: React.FC<QuickActionsCardProps> = ({ onActionClick }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
          {QUICK_ACTIONS.map((action) => (
            <Button
              key={action.id}
              variant="outlined"
              onClick={() => onActionClick(action.action)}
              sx={{
                p: 2,
                height: 'auto',
                flexDirection: 'column',
                alignItems: 'flex-start',
                textAlign: 'left',
                borderColor: action.color,
                '&:hover': {
                  borderColor: action.color,
                  backgroundColor: `${action.color}10`,
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, width: '100%' }}>
                <Avatar sx={{ bgcolor: action.color, width: 32, height: 32 }}>
                  {action.icon}
                </Avatar>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: action.color }}>
                  {action.title}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {action.description}
              </Typography>
            </Button>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
