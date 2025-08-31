import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tab,
  Tabs,
  Alert,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from '@mui/material';
import { Add, Storage, CloudUpload } from '@mui/icons-material';
import { DataSourceList } from './DataSourceList';
import { DocumentUpload } from './DocumentUpload';
import { IndexCreationWizard } from './IndexCreationWizard';
import type { DataSource, IndexCreationRequest, IndexCreationProgress, FileUploadProgress } from '../../types/datasources';
import { leannApi } from '../../services/api';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const DataSourcesPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateIndexDialog, setShowCreateIndexDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [indexCreationProgress, setIndexCreationProgress] = useState<IndexCreationProgress | undefined>();

  useEffect(() => {
    loadDataSources();
  }, []);

  const loadDataSources = async () => {
    try {
      setLoading(true);
      // This would be replaced with actual API call when backend supports it
      const mockDataSources: DataSource[] = [
        {
          id: '1',
          name: 'Documents',
          type: 'document',
          status: 'ready',
          config: { dataDir: './data' },
          itemCount: 15,
          lastIndexed: '2024-01-20T10:30:00Z',
        },
        {
          id: '2',
          name: 'Email Archive',
          type: 'email',
          status: 'configured',
          config: { mailDir: '~/Library/Mail' },
          itemCount: 0,
        },
      ];
      setDataSources(mockDataSources);
    } catch (err) {
      setError('Failed to load data sources');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreateIndex = async (request: IndexCreationRequest) => {
    try {
      setIndexCreationProgress({
        status: 'processing',
        progress: 0,
        currentStep: 'Initializing...',
        totalSteps: 4,
      });

      // Simulate index creation progress
      const steps = [
        'Initializing embedding model...',
        'Processing documents...',
        'Creating vector index...',
        'Finalizing index...',
      ];

      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIndexCreationProgress({
          status: 'processing',
          progress: Math.round(((i + 1) / steps.length) * 100),
          currentStep: steps[i],
          totalSteps: steps.length,
        });
      }

      setIndexCreationProgress({
        status: 'completed',
        progress: 100,
        currentStep: 'Index created successfully!',
        totalSteps: steps.length,
      });

      // Close dialog after a delay
      setTimeout(() => {
        setShowCreateIndexDialog(false);
        setIndexCreationProgress(undefined);
        loadDataSources(); // Reload to show new index
      }, 2000);

    } catch (err) {
      setIndexCreationProgress({
        status: 'error',
        progress: 0,
        currentStep: 'Failed to create index',
        totalSteps: 4,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  };

  const handleFileUpload = async (files: File[]) => {
    // This would integrate with the actual upload API
    console.log('Uploading files:', files.map(f => f.name));
    // For now, just close the dialog
    setTimeout(() => {
      setShowUploadDialog(false);
    }, 1000);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Data Sources
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Fab
            size="medium"
            color="secondary"
            aria-label="upload documents"
            onClick={() => setShowUploadDialog(true)}
          >
            <CloudUpload />
          </Fab>
          <Fab
            size="medium"
            color="primary"
            aria-label="create index"
            onClick={() => setShowCreateIndexDialog(true)}
          >
            <Add />
          </Fab>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="data sources tabs">
          <Tab icon={<Storage />} label="Configured Sources" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <DataSourceList 
          dataSources={dataSources}
          onRefresh={loadDataSources}
        />
      </TabPanel>

      {/* Create Index Dialog */}
      <Dialog
        open={showCreateIndexDialog}
        onClose={() => !indexCreationProgress?.status || indexCreationProgress?.status === 'completed' ? setShowCreateIndexDialog(false) : undefined}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New LEANN Index</DialogTitle>
        <DialogContent>
          <IndexCreationWizard
            onCreateIndex={handleCreateIndex}
            progress={indexCreationProgress}
          />
        </DialogContent>
        {(!indexCreationProgress || indexCreationProgress.status === 'completed') && (
          <DialogActions>
            <Button onClick={() => setShowCreateIndexDialog(false)}>
              Cancel
            </Button>
          </DialogActions>
        )}
      </Dialog>

      {/* Upload Documents Dialog */}
      <Dialog
        open={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upload Documents</DialogTitle>
        <DialogContent>
          <DocumentUpload onFilesUploaded={handleFileUpload} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUploadDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
