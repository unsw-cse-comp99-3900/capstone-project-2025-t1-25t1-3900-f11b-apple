import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, Typography, IconButton } from '@mui/material';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

export const NavBar = ({ page, pdfUploaded, setPdfUploaded, setUploadedFile, feedBackButton, setPopUpDisplay }) => {
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
      <IconButton color="inherit" variant="contained" onClick={() => reset()} component={Link} to="/" sx={buttonStyles} aria-label="Add New">
        <AddRoundedIcon />
      </IconButton>
    );
  } else if (page === '/dashboard') {
    nav = (
      <>
        <IconButton color="inherit" variant="contained" onClick={() => reset()} component={Link} to="/" sx={buttonStyles} aria-label="Add New">
          <AddRoundedIcon />
        </IconButton>
        <IconButton color="inherit" variant="contained" component={Link} to="/history" sx={buttonStyles} aria-label="View History">
          <HistoryRoundedIcon />
        </IconButton>
      </>
    );
  } else {
    nav = (
      <>
        {pdfUploaded && (
          <IconButton color="inherit" variant="contained" onClick={() => reset()} component={Link} to="/" sx={buttonStyles} aria-label="Add New">
            <AddRoundedIcon />
          </IconButton>
        )}
        <IconButton color="inherit" variant="contained" component={Link} to="/history" sx={buttonStyles} aria-label="View History">
          <HistoryRoundedIcon />
        </IconButton>
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
          {feedBackButton && (
            <IconButton color="inherit" variant="contained" onClick={() => setPopUpDisplay(true)} sx={buttonStyles} aria-label="Feedback">
              feedback
            </IconButton>
          )}
          {nav}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
