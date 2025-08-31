export interface DataSource {
  id: string;
  name: string;
  type: 'document' | 'email' | 'wechat' | 'code' | 'browser';
  status: 'configured' | 'indexing' | 'ready' | 'error';
  config: Record<string, any>;
  itemCount?: number;
  lastIndexed?: string;
}

export interface IndexCreationRequest {
  name: string;
  dataSources: string[];
  embeddingModel: string;
  backend: 'hnsw' | 'diskann';
  chunkSize: number;
  chunkOverlap: number;
}

export interface IndexCreationProgress {
  status: 'initializing' | 'processing' | 'indexing' | 'completed' | 'error';
  progress: number;
  currentStep: string;
  totalSteps: number;
  message?: string;
  error?: string;
}

export interface FileUploadProgress {
  filename: string;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}
