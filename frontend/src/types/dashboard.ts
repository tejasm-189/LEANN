export interface DataSourceStatus {
  id: string;
  name: string;
  type: 'document' | 'email' | 'wechat' | 'code' | 'browser';
  status: 'active' | 'indexing' | 'error' | 'inactive';
  itemCount: number;
  lastUpdated: string;
  storageSize: string;
}

export interface SystemMetrics {
  totalDocuments: number;
  totalStorageUsed: string;
  totalStorageSaved: string;
  compressionRatio: number;
  totalSearches: number;
  averageSearchTime: number;
}

export interface RecentActivity {
  id: string;
  type: 'search' | 'index' | 'upload';
  description: string;
  timestamp: string;
  status: 'success' | 'pending' | 'error';
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactElement;
  action: string;
  color: string;
}
