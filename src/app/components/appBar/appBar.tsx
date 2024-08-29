'use client'

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';

import BarMenu from './barMenu';

interface IBarProps {
  logOut: CallableFunction
}

export default function ButtonAppBar(props: IBarProps) {
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(menuAnchor);
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget);
  };
  const handleClose = () => {
    setMenuAnchor(null);
  };
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color='transparent'>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="primary"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleClick}
          >
            <MenuIcon />
          </IconButton>
          <Box>
            <img src='./shum.png' alt='shum' height='20' />
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Box sx={{ padding: '12px' }}>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} color="primary">
                {localStorage.getItem('username')}
              </Typography>
            </Box>
            <IconButton
              size="large"
              onClick={() => {props.logOut()}}
              color="primary"
            >
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Box>
        <BarMenu
          menuAnchor={menuAnchor}
          openMenu={openMenu}
          handleClose={handleClose}
        />
      </Box>
    </Box>
  );
}
