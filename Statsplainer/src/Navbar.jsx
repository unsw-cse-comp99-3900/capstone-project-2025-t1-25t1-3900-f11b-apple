import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';

export const NavBar = () => {
  const buttonStyles = { 
    color: 'white',
    bgcolor: '#0A85FF', 
    borderRadius: 1,
    mx: 1,
    '&:hover': {
      bgcolor: 'primary.dark',
    }
  };

  let nav = <></>;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color='#00cccc' sx={{ bgcolor: '#5CADFF', borderRadius: 1, }}>
        {/* Can add hamburger menu here */}
        <Toolbar>
          <Box sx={{ flexGrow: 1, color: 'white', fontSize: '2rem' }}>
            <Typography variant="h6" component="div" sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                        My Application
            </Typography>
          </Box>
          <Box>
            {nav}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
