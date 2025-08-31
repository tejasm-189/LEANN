const BASE_URL = 'http://127.0.0.1:8000/api';

export interface SearchRequest {
  query: string;
  top_k: number;
  sources: string[];
  complexity?: number;
  recompute_embeddings?: boolean;
}

export interface SearchResult {
  id: string;
  content: string;
  score: number;
  source: string;
  metadata: Record<string, any>;
}

export interface SearchResponse {
  results: SearchResult[];
  total_count: number;
  query: string;
  search_time: number;
}

export interface SystemStatus {
  status: string;
  index_loaded: boolean;
  index_path?: string;
  total_documents: number;
  backend_name: string;
  embedding_model: string;
}

export interface IndexCreationRequest {
  name: string;
  dataSources: string[];
  embeddingModel: string;
  backend: string;
  chunkSize: number;
  chunkOverlap: number;
}

export interface IndexCreationProgress {
  status: string;
  progress: number;
  currentStep: string;
  message?: string;
  error?: string;
}

class LeannApiService {
  async search(request: SearchRequest): Promise<SearchResponse> {
    try {
      const response = await fetch(`${BASE_URL}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Search API error:', error);
      throw error;
    }
  }

  async getStatus(): Promise<SystemStatus> {
    try {
      const response = await fetch(`${BASE_URL}/status`);
      
      if (!response.ok) {
        throw new Error(`Status check failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Status API error:', error);
      throw error;
    }
  }

  async listIndices(): Promise<any> {
    try {
      const response = await fetch(`${BASE_URL}/indices`);
      
      if (!response.ok) {
        throw new Error(`List indices failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('List indices API error:', error);
      throw error;
    }
  }
}

export const leannApi = new LeannApiService();
