import React, { useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  LinearProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  CloudUpload,
  Description,
  Delete,
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'ready' | 'error';
  progress?: number;
  error?: string;
}

interface DocumentUploadProps {
  onFilesChange?: (files: UploadedFile[]) => void;
  onFilesUploaded?: (files: File[]) => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ onFilesChange, onFilesUploaded }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (fileList: File[]) => {
    const newFiles: UploadedFile[] = fileList.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0,
    }));

    // Simulate upload process
    newFiles.forEach(newFile => {
      simulateUpload(newFile);
    });

    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
    
    // Call onFilesUploaded with the actual File objects
    onFilesUploaded?.(fileList);
  };

  const simulateUpload = (file: UploadedFile) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        updateFileStatus(file.id, 'ready', 100);
      } else {
        updateFileProgress(file.id, progress);
      }
    }, 200);
  };

  const updateFileProgress = (id: string, progress: number) => {
    setFiles(prev => prev.map(file => 
      file.id === id ? { ...file, progress } : file
    ));
  };

  const updateFileStatus = (id: string, status: 'uploading' | 'ready' | 'error', progress?: number) => {
    setFiles(prev => {
      const updated = prev.map(file => 
        file.id === id ? { ...file, status, progress } : file
      );
      onFilesChange?.(updated);
      return updated;
    });
  };

  const removeFile = (id: string) => {
    const updatedFiles = files.filter(file => file.id !== id);
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle color="success" />;
      case 'error': return <ErrorIcon color="error" />;
      default: return <Description />;
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Document Upload
        </Typography>
        
        <Box
          sx={{
            border: `2px dashed ${dragActive ? '#1976d2' : '#ccc'}`,
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            backgroundColor: dragActive ? '#f3f4f6' : 'transparent',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            mb: 2,
          }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <CloudUpload sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Drop files here or click to browse
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Supports PDF, TXT, MD, and other document formats
          </Typography>
          <input
            id="file-input"
            type="file"
            multiple
            accept=".pdf,.txt,.md,.doc,.docx"
            style={{ display: 'none' }}
            onChange={handleFileInput}
          />
        </Box>

        {files.length > 0 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Uploaded Files ({files.length})
            </Typography>
            <List dense>
              {files.map((file) => (
                <ListItem key={file.id}>
                  <ListItemIcon>
                    {getStatusIcon(file.status)}
                  </ListItemIcon>
                  <ListItemText
                    primary={file.name}
                    secondary={
                      <Box>
                        <Typography variant="caption" display="block">
                          {formatFileSize(file.size)}
                        </Typography>
                        {file.status === 'uploading' && file.progress !== undefined && (
                          <LinearProgress 
                            variant="determinate" 
                            value={file.progress} 
                            sx={{ mt: 0.5, height: 4 }}
                          />
                        )}
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip 
                        label={file.status} 
                        size="small" 
                        color={file.status === 'ready' ? 'success' : file.status === 'error' ? 'error' : 'default'}
                      />
                      <IconButton onClick={() => removeFile(file.id)} size="small">
                        <Delete />
                      </IconButton>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {files.length > 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <strong>{files.filter(f => f.status === 'ready').length}</strong> files ready for indexing
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
