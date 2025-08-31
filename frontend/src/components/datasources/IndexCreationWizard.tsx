import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stepper,
  Step,
  StepLabel,
  Alert,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  ListItemIcon,
} from '@mui/material';
import {
  Description,
  Email,
  Chat,
  Code,
  Language,
  Storage,
  Speed,
} from '@mui/icons-material';
import { IndexCreationRequest, IndexCreationProgress } from '../../types/datasources';

interface IndexCreationWizardProps {
  onCreateIndex: (request: IndexCreationRequest) => void;
  progress?: IndexCreationProgress;
}

const EMBEDDING_MODELS = [
  { value: 'sentence-transformers/all-MiniLM-L6-v2', label: 'all-MiniLM-L6-v2 (Fast, 384d)' },
  { value: 'sentence-transformers/all-mpnet-base-v2', label: 'all-mpnet-base-v2 (Balanced, 768d)' },
  { value: 'sentence-transformers/all-distilroberta-v1', label: 'all-distilroberta-v1 (Quality, 768d)' },
];

const BACKEND_OPTIONS = [
  { value: 'diskann', label: 'DiskANN (Recommended)', description: 'Better for very large datasets' },
  { value: 'hnsw', label: 'HNSW (Advanced)', description: 'Fast and efficient - requires C++ build tools' },
];

const DATA_SOURCE_TYPES = [
  { id: 'document', icon: <Description />, label: 'Documents', description: 'PDF, TXT, MD files' },
  { id: 'email', icon: <Email />, label: 'Email', description: 'Apple Mail integration' },
  { id: 'wechat', icon: <Chat />, label: 'WeChat', description: 'Chat history' },
  { id: 'code', icon: <Code />, label: 'Code', description: 'Source code repositories' },
  { id: 'browser', icon: <Language />, label: 'Browser', description: 'Browser history' },
];

const steps = ['Configure Data Sources', 'Index Settings', 'Create Index'];

export const IndexCreationWizard: React.FC<IndexCreationWizardProps> = ({ 
  onCreateIndex, 
  progress 
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [indexName, setIndexName] = useState('');
  const [selectedSources, setSelectedSources] = useState<string[]>(['document']);
  const [embeddingModel, setEmbeddingModel] = useState('sentence-transformers/all-MiniLM-L6-v2');
  const [backend, setBackend] = useState<'hnsw' | 'diskann'>('diskann');
  const [chunkSize, setChunkSize] = useState(512);
  const [chunkOverlap, setChunkOverlap] = useState(50);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSourceToggle = (sourceId: string) => {
    setSelectedSources(prev => 
      prev.includes(sourceId) 
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const handleCreateIndex = () => {
    const request: IndexCreationRequest = {
      name: indexName,
      dataSources: selectedSources,
      embeddingModel,
      backend,
      chunkSize,
      chunkOverlap,
    };
    onCreateIndex(request);
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 0: return selectedSources.length > 0;
      case 1: return indexName.trim().length > 0;
      case 2: return true;
      default: return false;
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select Data Sources
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Choose which types of data you want to include in your index
            </Typography>
            <List>
              {DATA_SOURCE_TYPES.map((source) => (
                <ListItem key={source.id} dense>
                  <ListItemIcon>
                    <Checkbox
                      checked={selectedSources.includes(source.id)}
                      onChange={() => handleSourceToggle(source.id)}
                    />
                  </ListItemIcon>
                  <ListItemIcon>
                    {source.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={source.label}
                    secondary={source.description}
                  />
                </ListItem>
              ))}
            </List>
            {selectedSources.length === 0 && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Please select at least one data source
              </Alert>
            )}
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Index Configuration
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Index Name"
                value={indexName}
                onChange={(e) => setIndexName(e.target.value)}
                placeholder="my-personal-index"
                helperText="Choose a unique name for your index"
                fullWidth
              />

              <FormControl fullWidth>
                <InputLabel>Embedding Model</InputLabel>
                <Select
                  value={embeddingModel}
                  onChange={(e) => setEmbeddingModel(e.target.value)}
                >
                  {EMBEDDING_MODELS.map((model) => (
                    <MenuItem key={model.value} value={model.value}>
                      {model.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Backend</InputLabel>
                <Select
                  value={backend}
                  onChange={(e) => setBackend(e.target.value as 'hnsw' | 'diskann')}
                >
                  {BACKEND_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box>
                        <Typography>{option.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.description}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField
                  label="Chunk Size"
                  type="number"
                  value={chunkSize}
                  onChange={(e) => setChunkSize(Number(e.target.value))}
                  helperText="Text chunk size (tokens)"
                />
                <TextField
                  label="Chunk Overlap"
                  type="number"
                  value={chunkOverlap}
                  onChange={(e) => setChunkOverlap(Number(e.target.value))}
                  helperText="Overlap between chunks"
                />
              </Box>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review and Create
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Alert severity="info">
                <strong>Index Name:</strong> {indexName}
              </Alert>
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Data Sources:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {selectedSources.map(sourceId => {
                    const source = DATA_SOURCE_TYPES.find(s => s.id === sourceId);
                    return (
                      <Chip 
                        key={sourceId} 
                        label={source?.label} 
                        icon={source?.icon}
                        variant="outlined"
                      />
                    );
                  })}
                </Box>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Alert severity="info" icon={<Storage />}>
                  <strong>Backend:</strong> {backend.toUpperCase()}
                </Alert>
                <Alert severity="info" icon={<Speed />}>
                  <strong>Model:</strong> {embeddingModel.split('/').pop()}
                </Alert>
              </Box>

              {progress && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Creation Progress:
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={progress.progress} 
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {progress.currentStep} ({progress.progress}%)
                  </Typography>
                  {progress.error && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      {progress.error}
                    </Alert>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Create New Index
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleCreateIndex}
              disabled={!isStepValid(activeStep) || progress?.status === 'processing'}
            >
              {progress?.status === 'processing' ? 'Creating...' : 'Create Index'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!isStepValid(activeStep)}
            >
              Next
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
