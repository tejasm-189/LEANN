import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
} from '@mui/material';
import {
  Storage,
  Description,
  Speed,
  Compress,
} from '@mui/icons-material';
import { SystemMetrics } from '../../types/dashboard';

interface SystemMetricsCardProps {
  metrics: SystemMetrics;
}

export const SystemMetricsCard: React.FC<SystemMetricsCardProps> = ({ metrics }) => {
  const metricItems = [
    {
      icon: <Description color="primary" />,
      label: 'Total Documents',
      value: metrics.totalDocuments.toLocaleString(),
      color: '#1976d2',
    },
    {
      icon: <Storage color="success" />,
      label: 'Storage Used',
      value: metrics.totalStorageUsed,
      color: '#2e7d32',
    },
    {
      icon: <Compress color="warning" />,
      label: 'Storage Saved',
      value: metrics.totalStorageSaved,
      color: '#ed6c02',
    },
    {
      icon: <Speed color="error" />,
      label: 'Avg Search Time',
      value: `${metrics.averageSearchTime}ms`,
      color: '#d32f2f',
    },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          System Metrics
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
          {metricItems.map((item, index) => (
            <Box key={index} sx={{ textAlign: 'center' }}>
              <Box sx={{ mb: 1 }}>
                {item.icon}
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: item.color }}>
                {item.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" gutterBottom>
            Compression Efficiency: {metrics.compressionRatio}% space saved
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={metrics.compressionRatio} 
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};
