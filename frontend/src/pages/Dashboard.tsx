import React from 'react';
import { Box, Typography } from '@mui/material';
import { SystemMetricsCard } from '../components/dashboard/SystemMetricsCard';
import { DataSourcesCard } from '../components/dashboard/DataSourcesCard';
import { QuickActionsCard } from '../components/dashboard/QuickActionsCard';
import { RecentActivityCard } from '../components/dashboard/RecentActivityCard';
import { SystemMetrics, DataSourceStatus, RecentActivity } from '../types/dashboard';

// Mock data for demonstration
const MOCK_METRICS: SystemMetrics = {
  totalDocuments: 1234567,
  totalStorageUsed: '2.3 GB',
  totalStorageSaved: '67.8 GB',
  compressionRatio: 97,
  totalSearches: 15423,
  averageSearchTime: 45,
};

const MOCK_DATA_SOURCES: DataSourceStatus[] = [
  {
    id: '1',
    name: 'Personal Documents',
    type: 'document',
    status: 'active',
    itemCount: 15432,
    lastUpdated: '2025-08-31T10:00:00Z',
    storageSize: '1.2 GB',
  },
  {
    id: '2',
    name: 'Apple Mail',
    type: 'email',
    status: 'active',
    itemCount: 780000,
    lastUpdated: '2025-08-31T09:30:00Z',
    storageSize: '780 MB',
  },
  {
    id: '3',
    name: 'WeChat History',
    type: 'wechat',
    status: 'indexing',
    itemCount: 450000,
    lastUpdated: '2025-08-31T08:45:00Z',
    storageSize: '320 MB',
  },
  {
    id: '4',
    name: 'Code Repositories',
    type: 'code',
    status: 'active',
    itemCount: 25600,
    lastUpdated: '2025-08-30T16:20:00Z',
    storageSize: '180 MB',
  },
  {
    id: '5',
    name: 'Browser History',
    type: 'browser',
    status: 'inactive',
    itemCount: 0,
    lastUpdated: '2025-08-25T12:00:00Z',
    storageSize: '0 MB',
  },
];

const MOCK_RECENT_ACTIVITY: RecentActivity[] = [
  {
    id: '1',
    type: 'search',
    description: 'Searched for "machine learning techniques"',
    timestamp: '2025-08-31T10:30:00Z',
    status: 'success',
  },
  {
    id: '2',
    type: 'index',
    description: 'Indexed 156 new WeChat messages',
    timestamp: '2025-08-31T10:15:00Z',
    status: 'pending',
  },
  {
    id: '3',
    type: 'upload',
    description: 'Uploaded research_paper.pdf',
    timestamp: '2025-08-31T09:45:00Z',
    status: 'success',
  },
  {
    id: '4',
    type: 'search',
    description: 'Searched for "project deadline emails"',
    timestamp: '2025-08-31T09:20:00Z',
    status: 'success',
  },
];

export const Dashboard: React.FC = () => {
  const handleQuickAction = (action: string) => {
    console.log('Quick action clicked:', action);
    // TODO: Implement navigation based on action
    switch (action) {
      case 'search':
        // Navigate to search page
        break;
      case 'upload':
        // Open upload dialog
        break;
      case 'settings':
        // Navigate to settings
        break;
      case 'analytics':
        // Navigate to analytics
        break;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome to LEANN
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        The smallest vector index in the world. RAG Everything!
      </Typography>
      
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* System Metrics */}
        <SystemMetricsCard metrics={MOCK_METRICS} />

        {/* Data Sources and Quick Actions */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
          <DataSourcesCard dataSources={MOCK_DATA_SOURCES} />
          <QuickActionsCard onActionClick={handleQuickAction} />
        </Box>

        {/* Recent Activity */}
        <RecentActivityCard activities={MOCK_RECENT_ACTIVITY} />
      </Box>
    </Box>
  );
};
