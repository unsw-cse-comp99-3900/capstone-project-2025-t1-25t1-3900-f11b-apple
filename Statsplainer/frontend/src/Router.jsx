import { useState } from 'react';
import {
  Routes,
  Route,
  // useNavigate,
  useLocation
} from 'react-router-dom';
import { DashboardPage } from './Dashboard.jsx';
import { NavBar } from './Navbar.jsx'
import { LandingPage } from './Landingpage.jsx';
import { HistoryPage } from './History.jsx';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid2';

export default function Router() {
  const location = useLocation();

  const [pdfUploaded, setPdfUploaded] = useState(false);

  
  return (
    <Grid
      sx={{
        display: 'flex',
        flexShrink: 0,
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        bgcolor: '#1F2023',
        height: '100vh',
        width: '100vw'
      }}
    >
      <NavBar pdfUploaded={pdfUploaded} page={location.pathname}/>
      <Routes>
        <Route path='/' element={<LandingPage setPdfUploaded={setPdfUploaded}/>}/>
          
        <Route path='/dashboard' element={<DashboardPage />}/>

        <Route path='/history' element={<HistoryPage />}/>

      </Routes>
    </Grid>
  )
}
