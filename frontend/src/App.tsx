import React, { useState } from 'react';
import { Typography, Box } from '@mui/material';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Search } from './pages/Search';
import { MENU_ITEMS } from './constants/navigation';

function App() {
  const [selectedItem, setSelectedItem] = useState('dashboard');

  const renderPageContent = () => {
    switch (selectedItem) {
      case 'dashboard':
        return <Dashboard />;
      case 'search':
        return <Search />;
      default:
        const currentPage = MENU_ITEMS.find(item => item.id === selectedItem);
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              {currentPage?.text}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Coming soon...
            </Typography>
          </Box>
        );
    }
  };

  return (
    <MainLayout selectedItem={selectedItem} onItemSelect={setSelectedItem}>
      {renderPageContent()}
    </MainLayout>
  );
}

export default App;
