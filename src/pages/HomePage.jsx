import React, { Suspense, lazy } from 'react';
import { Box, Skeleton } from '@mui/material';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';

// Below-the-fold sections are code-split and only fetched once the user
// scrolls near them (or immediately after the initial paint, off the
// critical path) — keeps the first render (Hero/About, what's visible on
// load) as light and fast as possible.
const Skills = lazy(() => import('../components/sections/Skills'));
const Projects = lazy(() => import('../components/sections/Projects'));
const Experience = lazy(() => import('../components/sections/Experience'));
const Education = lazy(() => import('../components/sections/Education'));
const Certificates = lazy(() => import('../components/sections/Certificates'));
const Contact = lazy(() => import('../components/sections/Contact'));

const SectionFallback = () => (
  <Box sx={{ py: 8, px: { xs: 3, md: 7 } }}>
    <Skeleton variant="text" width={220} height={40} sx={{ mb: 3 }} />
    <Skeleton variant="rounded" height={200} sx={{ mb: 2 }} />
    <Skeleton variant="rounded" height={200} />
  </Box>
);

const HomePage = () => {
  return (
    <>
      <Hero />
      <About />
      <Suspense fallback={<SectionFallback />}><Skills /></Suspense>
      <Suspense fallback={<SectionFallback />}><Projects /></Suspense>
      <Suspense fallback={<SectionFallback />}><Experience /></Suspense>
      <Suspense fallback={<SectionFallback />}><Education /></Suspense>
      <Suspense fallback={<SectionFallback />}><Certificates /></Suspense>
      <Suspense fallback={<SectionFallback />}><Contact /></Suspense>
    </>
  );
};

export default HomePage;