import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
  createTheme,
  IconButton,
} from '@mui/material';
import {
  Dashboard,
  Search,
  Description,
  Email,
  Chat,
  Code,
  Settings,
  Menu as MenuIcon,
  Storage,
} from '@mui/icons-material';
import './App.css';

const drawerWidth = 280;

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, id: 'dashboard' },
  { text: 'Universal Search', icon: <Search />, id: 'search' },
  { text: 'Documents', icon: <Description />, id: 'documents' },
  { text: 'Email', icon: <Email />, id: 'email' },
  { text: 'WeChat', icon: <Chat />, id: 'wechat' },
  { text: 'Code', icon: <Code />, id: 'code' },
  { text: 'Data Sources', icon: <Storage />, id: 'sources' },
  { text: 'Settings', icon: <Settings />, id: 'settings' },
];

function App() {
  const [selectedItem, setSelectedItem] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const renderContent = () => {
    switch (selectedItem) {
      case 'dashboard':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Welcome to LEANN
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              The smallest vector index in the world. RAG Everything!
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Typography variant="body1">
                Transform your laptop into a powerful RAG system that can index and search through 
                millions of documents while using 97% less storage than traditional solutions.
              </Typography>
            </Box>
          </Box>
        );
      default:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              {menuItems.find(item => item.id === selectedItem)?.text}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Coming soon...
            </Typography>
          </Box>
        );
    }
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
          LEANN
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={selectedItem === item.id}
              onClick={() => setSelectedItem(item.id)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              {menuItems.find(item => item.id === selectedItem)?.text || 'LEANN'}
            </Typography>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            mt: '64px',
          }}
        >
          {renderContent()}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
