import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

interface IBarProps {
  logOut: CallableFunction
}

export default function ButtonAppBar(props: IBarProps) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color='transparent'>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} color="primary">
            {localStorage.getItem('username')}
          </Typography>
          <Button
            color="primary"
            onClick={() => {props.logOut()}}
          >
            LogOut
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
