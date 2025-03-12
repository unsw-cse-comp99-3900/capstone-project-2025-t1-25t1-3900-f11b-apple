import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';

export const NavBar = ({ page }) => {
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
  if (page === '/History') {
    nav = (
      <Button color="inherit" variant="contained" component={Link} to="/" sx={buttonStyles}>
        ADD
      </Button>
    );
  } else {
    nav = (
      <>
        <Button color="inherit" variant="contained" component={Link} to="/Dashboard" sx={buttonStyles}>
          Dashboard
        </Button>
        <Button color="inherit" variant="contained" component={Link} to="/" sx={buttonStyles}>
          ADD
        </Button>
        <Button color="inherit" variant="contained" component={Link} to="/history" sx={buttonStyles}>
          History
        </Button>
      </>
    );
  }

  return (
    <AppBar position="static" sx={{ bgcolor: '#1F2023', boxShadow: 'none' }}>
      <Toolbar
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          STATSPLAINER
        </Typography>
        <Box>
          {nav}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
