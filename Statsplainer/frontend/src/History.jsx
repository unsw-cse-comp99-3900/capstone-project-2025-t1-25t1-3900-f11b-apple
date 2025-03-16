//import { useNavigate } from 'react-router-dom';
import { Typography, Stack, Button, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';

export const HistoryPage = () => {
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
        //   alignItems: 'center',

          height: '40vh',
          flex: 1,
          minWidth: '70vh',
          bgcolor: '#464646',
          margin: '5vh',
          borderRadius: '40px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'left',
            height: '5vh',
            bgcolor: '#464646',
            margin: '3vh 4vh 2vh 4vh',
            borderBottom: '1px solid #1F2023',
            color: 'white'
          }}
        >
          HISTORY
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'left',
            height: '3vh',
            bgcolor: '#464646',
            margin: '1vh 4vh 1vh 4vh',
            color: 'white'
          }}
        >
          This will be a collection of history elements
        </Box>
      </Grid>
  );
};
