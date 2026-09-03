import React from 'react';
import { Box } from '@mui/material';
import { SiteDataProvider } from '../context/SiteDataContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const MainLayout = ({ children }) => {
  return (
    <SiteDataProvider>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <Box component="main" sx={{ flex: 1 }}>
          {children}
        </Box>
        <Footer />
      </Box>
    </SiteDataProvider>
  );
};

export default MainLayout;