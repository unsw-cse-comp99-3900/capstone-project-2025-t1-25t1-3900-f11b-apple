import {CardMedia, CardActionArea, Typography, CardContent, Card, Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Sidebar from './Sidebar';
import {PdfSidebar} from './PdfSidebar';
import {useLocation} from 'react-router-dom';


export const DashboardPage = ( {setTaskCompletion} ) => {
  const location = useLocation();
  const {file} = location.state || {};

  if (!file) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          color: 'white',
        }}
      >
        <Typography variant="h6">
          No PDF file specified
        </Typography>
      </Box>
    )
  }
  return (
    <PdfSidebar file={file} isFromDashboard={true} setTaskCompletion={setTaskCompletion}/>
  )
}
