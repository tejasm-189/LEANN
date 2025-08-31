import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { DRAWER_WIDTH, MENU_ITEMS } from '../../constants/navigation';

interface HeaderProps {
  selectedItem: string;
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ selectedItem, onMenuClick }) => {
  const currentPageTitle = MENU_ITEMS.find(item => item.id === selectedItem)?.text || 'LEANN';

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { sm: `${DRAWER_WIDTH}px` },
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          {currentPageTitle}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
