import { useNavigate } from 'react-router-dom';
import { Typography, Stack, Button, Box } from '@mui/material';

export const LandingPage = () => {
  const navigate = useNavigate();

  const buttonStyles = { 
    flexGrow: 1,
    paddingY: 2,
    fontSize: '1.25rem',
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        bgcolor: 'white',
        padding: 4,
      }}
    >
      <Typography 
        variant="h2" 
        sx={{ 
          fontSize: '4rem',
          fontWeight: 'bold', 
          mb: 10
        }}>
          WELCOME
      </Typography>
  
      <Stack 
        direction="row" 
        spacing={10} 
        mt={2} 
        sx={{
          justifyContent: "center",
          alignItems: "center",
          width: '100%', 
          maxWidth: 500
        }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={buttonStyles}
          onClick={() => navigate('/dashboard')}
        >
            Start
        </Button>
      </Stack>
    </Box>
  );
};
