import {
  Dashboard,
  Search,
  Description,
  Email,
  Chat,
  Code,
  Settings,
  Storage,
} from '@mui/icons-material';

export interface MenuItem {
  text: string;
  icon: React.ReactElement;
  id: string;
}

export const DRAWER_WIDTH = 280;

export const MENU_ITEMS: MenuItem[] = [
  { text: 'Dashboard', icon: <Dashboard />, id: 'dashboard' },
  { text: 'Universal Search', icon: <Search />, id: 'search' },
  { text: 'Documents', icon: <Description />, id: 'documents' },
  { text: 'Email', icon: <Email />, id: 'email' },
  { text: 'WeChat', icon: <Chat />, id: 'wechat' },
  { text: 'Code', icon: <Code />, id: 'code' },
  { text: 'Data Sources', icon: <Storage />, id: 'sources' },
  { text: 'Settings', icon: <Settings />, id: 'settings' },
];
