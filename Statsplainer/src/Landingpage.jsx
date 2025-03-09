//import { useNavigate } from 'react-router-dom';
import { Typography, Stack, Button, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';

export const LandingPage = () => {
  // const navigate = useNavigate();

  // const buttonStyles = { 
  //   flexGrow: 1,
  //   paddingY: 2,
  //   fontSize: '1.25rem',
  // };

  // Used https://kovart.github.io/dashed-border-generator/ for dashed border
  return (
      <Grid 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '30vh',
          flex: 1,
          minWidth: '70vh',
          bgcolor: '#1F2023',
          margin: '20vh',
          backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='40' ry='40' stroke='%23fff' stroke-width='4' stroke-dasharray='10%2c 20' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
          borderRadius: '40px',
        }}
      >
        <Box>
          UPLOAD ICON
        </Box>
        <Box>
          UPLOAD PDF
        </Box>
        <Box>
          Drag and drop or CHOOSE file to upload
        </Box>
      </Grid>

      /* <Typography 
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
      </Stack> */
  );
};
