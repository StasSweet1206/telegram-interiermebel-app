import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu'; // Раскомментируйте, если понадобится иконка меню

function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        {/* <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton> */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Интер мебель
        </Typography>
        {/* <Button color="inherit">Войти</Button> */}
      </Toolbar>
    </AppBar>
  );
}

export default Header;