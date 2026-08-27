import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Chip, Stack, Avatar, useTheme, alpha, Container } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import CodeIcon from '@mui/icons-material/Code';
import SectionWrapper from '../common/SectionWrapper';
import { profileData as defaultProfile } from '../../data/profile';
import { getProfile, getSettings } from '../../services/portfolioService';
import { useInView } from '../../hooks/useApiData';

const defaultAboutSettings = {
  sectionTitle: 'About Me',
  sectionSubtitle: 'Who I Am',
  highlights: [],
  availability: '',
  yearsOfExperience: '',
};

const InfoItem = ({ icon, label, value, theme }) => (
  <Box 
    sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 2,
      p: 1.5,
      borderRadius: '12px',
      transition: 'all 0.3s ease',
      '&:hover': {
        bgcolor: alpha(theme.palette.secondary.main, 0.04),
        transform: 'translateX(5px)'
      }
    }}
  >
    <Box sx={{ 
      color: 'secondary.main',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 1,
      borderRadius: '10px',
      bgcolor: alpha(theme.palette.secondary.main, 0.08),
    }}>
      {icon}
    </Box>
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.68rem', fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} sx={{ color: 'text.primary', mt: 0.2 }}>
        {value}
      </Typography>
    </Box>
  </Box>
);

const About = () => {
  const theme = useTheme();
  const { mode } = theme.palette;
  const [leftRef, leftInView] = useInView();
  const [rightRef, rightInView] = useInView();
  // Starts with local defaults, then swaps in the real data from the
  // backend (edited via the admin dashboard) once it arrives.
  const [profileData, setProfileData] = useState(defaultProfile);
  const [about, setAbout] = useState(defaultAboutSettings);

  useEffect(() => {
    let cancelled = false;
    getProfile()
      .then((res) => { if (!cancelled && res.data) setProfileData(res.data); })
      .catch(() => {});
    getSettings()
      .then((res) => { if (!cancelled && res.data?.about) setAbout(res.data.about); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // "MA" from "Mohamed Alnazly", etc. — falls back to nothing while the
  // profile hasn't loaded yet rather than showing a fake placeholder.
  const initials = profileData.name
    ? profileData.name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    : '';

  return (
    <SectionWrapper id="about" title={about.sectionTitle} subtitle={about.sectionSubtitle}>
      {/* Container لمنع الالتصاق بالحواف الجانبية وضبط أبعاد القسم بتناسق مع الـ Hero */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          px: { xs: 3, sm: 5, md: 7 }, // حشوة أمان جانبية فخمة لجميع مقاسات الشاشات
          py: { xs: 4, md: 6 }         // مسافة علوية وسفلية مريحة لتنفس العناصر
        }}
      >
        <Grid container spacing={{ xs: 6, md: 8 }} alignItems="center">
          
          {/* Left Side — Avatar + Bento Info Card */}
          <Grid item xs={12} md={5} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
            <Box
              ref={leftRef}
              sx={{
                opacity: leftInView ? 1 : 0,
                transform: leftInView ? 'none' : 'translateY(30px)',
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                width: '100%',
                maxWidth: { xs: 320, md: '100%' },
                display: 'flex',
                flexDirection: 'column',
                alignItems: { xs: 'center', md: 'flex-start' }
              }}
            >
              {/* Premium Avant-Garde Avatar Container */}
              <Box sx={{ position: 'relative', mb: 5, display: 'inline-block' }}>
                <Avatar
                  sx={{
                    width: { xs: 180, md: 220 },
                    height: { xs: 180, md: 220 },
                    bgcolor: alpha(theme.palette.text.primary, 0.03),
                    color: 'text.primary',
                    fontSize: { xs: '2.8rem', md: '3.5rem' },
                    fontFamily: '"Syne", sans-serif',
                    fontWeight: 800,
                    borderRadius: '32px',
                    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                    boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.05)}`,
                    transform: 'rotate(-3deg)',
                    transition: 'transform 0.5s ease',
                    '&:hover': { transform: 'rotate(0deg) scale(1.02)' }
                  }}
                >
                  {initials}
                </Avatar>
                
                {/* Decorative Frame Element */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: -8,
                    border: `2px solid ${alpha(theme.palette.secondary.main, 0.25)}`,
                    borderRadius: '36px',
                    zIndex: -1,
                    transform: 'rotate(3deg)',
                    pointerEvents: 'none',
                  }}
                />
              </Box>

              {/* Bento Style Info Container */}
              <Box
                sx={{
                  width: '100%',
                  maxWidth: 360,
                  p: 2,
                  borderRadius: '24px',
                  border: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
                  bgcolor: alpha(theme.palette.text.primary, 0.01),
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Stack spacing={1}>
                  <InfoItem icon={<LocationOnIcon fontSize="small" />} label="Location" value={profileData.location} theme={theme} />
                  <InfoItem icon={<EmailIcon fontSize="small" />} label="Email" value={profileData.email} theme={theme} />
                  {about.yearsOfExperience && (
                    <InfoItem icon={<CodeIcon fontSize="small" />} label="Experience" value={`${about.yearsOfExperience} Years Professional`} theme={theme} />
                  )}
                  {about.availability && (
                    <InfoItem icon={<CodeIcon fontSize="small" />} label="Status" value={about.availability} theme={theme} />
                  )}
                </Stack>
              </Box>
            </Box>
          </Grid>

          {/* Right Side — Editorial Bio & Custom Chips */}
          <Grid item xs={12} md={7}>
            <Box
              ref={rightRef}
              sx={{
                opacity: rightInView ? 1 : 0,
                transform: rightInView ? 'none' : 'translateY(30px)',
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
              }}
            >
              <Typography
                variant="body1"
                sx={{ 
                  fontSize: { xs: '1.05rem', md: '1.2rem' }, 
                  lineHeight: 1.85, 
                  color: 'text.primary', 
                  fontWeight: 500,
                  fontFamily: '"Syne", sans-serif',
                  mb: 3 
                }}
              >
                {profileData.bio}
              </Typography>
              
              {profileData.shortBio && (
                <Typography
                  variant="body1"
                  sx={{ 
                    fontSize: { xs: '1rem', md: '1.08rem' }, 
                    lineHeight: 1.9, 
                    color: 'text.secondary', 
                    mb: 5 
                  }}
                >
                  {profileData.shortBio}
                </Typography>
              )}

              {about.highlights?.length > 0 && (
                <>
                  {/* Core Expertise Header */}
                  <Typography 
                    variant="overline" 
                    sx={{ 
                      color: mode === 'dark' ? 'text.primary' : 'secondary.main', 
                      letterSpacing: '0.18em', 
                      fontWeight: 700, 
                      display: 'block', 
                      mb: 2.5,
                      fontSize: '0.75rem'
                    }}
                  >
                    Core Expertise
                  </Typography>

                  {/* Custom Interactive Chips */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                    {about.highlights.map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        variant="outlined"
                        sx={{
                          fontFamily: '"Syne", sans-serif',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          px: 1.5,
                          py: 2.2,
                          borderRadius: '10px',
                          borderColor: alpha(theme.palette.divider, 0.2),
                          color: 'text.secondary',
                          bgcolor: alpha(theme.palette.text.primary, 0.01),
                          transition: 'all 0.25s ease',
                          '&:hover': { 
                            borderColor: 'secondary.main', 
                            color: mode === 'dark' ? '#FFF' : 'secondary.main',
                            bgcolor: alpha(theme.palette.secondary.main, 0.03),
                            transform: 'translateY(-2px)'
                          },
                        }}
                      />
                    ))}
                  </Box>
                </>
              )}
            </Box>
          </Grid>

        </Grid>
      </Container>
    </SectionWrapper>
  );
};

export default About;