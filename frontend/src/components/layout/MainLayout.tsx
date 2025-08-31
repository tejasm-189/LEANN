import React, { useState } from 'react';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { theme } from '../../theme/theme';
import { DRAWER_WIDTH } from '../../constants/navigation';

interface MainLayoutProps {
  children: React.ReactNode;
  selectedItem: string;
  onItemSelect: (itemId: string) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  selectedItem,
  onItemSelect,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        
        <Header 
          selectedItem={selectedItem} 
          onMenuClick={handleDrawerToggle} 
        />
        
        <Box
          component="nav"
          sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
        >
          <Sidebar
            selectedItem={selectedItem}
            onItemSelect={onItemSelect}
            mobileOpen={mobileOpen}
            onMobileClose={handleDrawerToggle}
          />
        </Box>
        
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
            mt: '64px',
          }}
        >
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
};
