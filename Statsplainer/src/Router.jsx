import { useState, useEffect } from 'react';
import {
  Routes,
  Route,
  useNavigate,
  useLocation
} from 'react-router-dom';
import { DashboardPage } from './Dashboard.jsx';
import { NavBar } from './Navbar.jsx'
import { LandingPage } from './Landingpage.jsx';

export default function Router() {
  const location = useLocation();
  
  return (
    <>
      <div>
        <NavBar />
      </div>
      <Routes>
        <Route path='/' element={<LandingPage />}/>
          
        <Route path='/dashboard' element={<DashboardPage />}/>

      </Routes>
    </>
  )
}
