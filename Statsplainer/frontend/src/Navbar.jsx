import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';

export const NavBar = ({ page, pdfUploaded, setPdfUploaded, setUploadedFile }) => {
  const buttonStyles = { 
    height: '80%',
    color: 'white',
    bgcolor: '#0A85FF', 
    borderRadius: 1,
    mx: 1,
    '&:hover': {
      bgcolor: 'primary.dark',
    }
  };

  const reset = () => {
    setPdfUploaded(false);
    setUploadedFile(null);
  }

  let nav = <></>;
  if (page === '/history') {
    nav = (
      <Button color="inherit" variant="contained" onClick={() => reset()} component={Link} to="/" sx={buttonStyles}>
        ADD
      </Button>
    );
  } else {
    nav = (
      <>
        {pdfUploaded && (
          <Button color="inherit" variant="contained" onClick={() => reset()} component={Link} to="/" sx={buttonStyles}>
            ADD
          </Button>
        )}
        <Button color="inherit" variant="contained" component={Link} to="/history" sx={buttonStyles}>
          History
        </Button>
      </>
    );
  }

  return (
    <AppBar position="static" sx={{ bgcolor: '#1F2023', boxShadow: 'none', height: '7.9vh', }}>
      <Toolbar
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: '7.9vh'
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontSize: '3vh', fontWeight: 'bold' }}>
          STATSPLAINER
        </Typography>
        <Box sx={{ height: '6vh', display: 'flex', alignItems: 'center' }}>
          {nav}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
